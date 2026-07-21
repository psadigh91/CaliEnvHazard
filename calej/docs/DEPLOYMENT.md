# CalEJ Deployment Guide

This guide walks through deploying CalEJ (California Environmental Justice Mapper) to AWS.

## Prerequisites

- AWS Account with CLI configured
- Node.js 18+ and npm
- PostgreSQL client (psql) for database management
- Mapbox account (free tier) for mapping

## Architecture Overview

```
┌─────────────┐
│   Frontend  │  Next.js 14 (Vercel or AWS Amplify)
│  (React UI) │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────────┐
│  API Gateway    │  REST API
└────────┬────────┘
         │
    ┌────┴────┬────────┬────────┐
    ▼         ▼        ▼        ▼
┌────────┐ ┌────────┐ ┌────────┐
│ Lambda │ │ Lambda │ │ Lambda │  (VPC Private Subnets)
│ Tracts │ │ Search │ │Facilit │
└───┬────┘ └───┬────┘ └───┬────┘
    └──────────┴────────────┘
                 │
                 ▼
         ┌──────────────┐
         │  RDS Postgres│  PostGIS-enabled
         │  (db.t3.micro)│
         └──────────────┘
```

## Step 1: Backend Infrastructure Deployment

### 1.1 Install Dependencies

```bash
cd backend
npm install
```

### 1.2 Bootstrap CDK (First Time Only)

```bash
npx cdk bootstrap aws://YOUR-ACCOUNT-ID/us-west-2
```

### 1.3 Deploy Database Stack

```bash
npx cdk deploy CalEJ-Database
```

This creates:
- VPC with public/private subnets
- RDS PostgreSQL 15.3 instance (db.t3.micro)
- Security groups
- Secrets Manager secret for database credentials

**Save the outputs:**
- `CalEJ-Database.DatabaseEndpoint` - Database host
- `CalEJ-Database.DatabasePort` - Database port (5432)
- `CalEJ-Database.DatabaseSecretArn` - Secret ARN

### 1.4 Enable PostGIS Extension

Connect to the database using the credentials from Secrets Manager:

```bash
# Get credentials
aws secretsmanager get-secret-value --secret-id <DatabaseSecretArn> --region us-west-2

# Connect
psql -h <database-endpoint> -U calejadmin -d calej

# Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;

\q
```

### 1.5 Deploy API Stack

```bash
npx cdk deploy CalEJ-API
```

This creates:
- 3 Lambda functions (GetTract, SearchTracts, GetFacilities)
- API Gateway REST API
- Lambda execution roles with database access

**Save the output:**
- `CalEJ-API.ApiUrl` - API Gateway URL (e.g., https://abc123.execute-api.us-west-2.amazonaws.com/prod)

## Step 2: Data Seeding

### 2.1 Download CalEnviroScreen Data

1. Visit: https://oehha.ca.gov/calenviroscreen/report/calenviroscreen-40
2. Download the CSV file (CalEnviroScreen 4.0 Results)
3. Save as `backend/data/calenviroscreen-4.0.csv`

### 2.2 Download Census Tract Boundaries

1. Visit: https://www.census.gov/cgi-bin/geo/shapefiles/index.php
2. Select: Census Tracts → California → 2020
3. Download the shapefile ZIP
4. Extract and convert to GeoJSON using ogr2ogr:

```bash
ogr2ogr -f GeoJSON -t_srs EPSG:4326 ca_tracts.geojson tl_2020_06_tract.shp
```

### 2.3 Run Seeding Script

Set environment variables:

```bash
export DB_HOST=<database-endpoint>
export DB_PORT=5432
export DB_NAME=calej
export DB_USER=calejadmin
export DB_PASSWORD=<password-from-secrets-manager>
```

Run the seed script:

```bash
cd backend
npm run seed
```

This creates tables and imports CalEnviroScreen data.

### 2.4 Import Census Tract Geometries

Use PostGIS to import the GeoJSON file:

```bash
ogr2ogr -f "PostgreSQL" PG:"host=<endpoint> user=calejadmin dbname=calej password=<password>" \
  -nln census_tracts_geom \
  -append \
  ca_tracts.geojson
```

Then update the main table with geometries:

```sql
UPDATE census_tracts ct
SET geom = (
  SELECT ST_Multi(wkb_geometry)
  FROM census_tracts_geom ctg
  WHERE ctg.geoid = ct.tract_id
);
```

### 2.5 Import EPA Data (Optional)

For production, fetch full datasets:

**Superfund Sites:**
```bash
curl "https://data.epa.gov/efservice/CERCLIS/STATE_CODE/CA/JSON" > superfund_ca.json
```

**TRI Facilities:**
```bash
# Register at https://www.epa.gov/enviro/web-services
# Use their API to fetch California TRI data
```

Parse and import into PostgreSQL tables.

## Step 3: Frontend Deployment

### 3.1 Configure Environment

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://abc123.execute-api.us-west-2.amazonaws.com/prod
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1... # Get from mapbox.com
```

### 3.2 Test Locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000

### 3.3 Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Visit https://vercel.com
3. Import repository
4. Add environment variables
5. Deploy

**OR**

### 3.4 Deploy to AWS Amplify

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

## Step 4: Post-Deployment

### 4.1 Update CORS

Edit `backend/lib/api-stack.ts` to restrict CORS:

```typescript
allowOrigins: ['https://your-frontend-domain.com'],
```

Redeploy:

```bash
cd backend
npx cdk deploy CalEJ-API
```

### 4.2 Enable Caching (Optional)

Add CloudFront distribution in front of API Gateway for caching:

```typescript
// Add to api-stack.ts
const distribution = new cloudfront.Distribution(this, 'ApiDistribution', {
  defaultBehavior: {
    origin: new origins.RestApiOrigin(this.api),
    cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
  },
});
```

### 4.3 Set Up Monitoring

Enable CloudWatch alarms for:
- Lambda errors
- API Gateway 4xx/5xx errors
- RDS CPU/memory/storage

### 4.4 Enable Backups

RDS automated backups are enabled by default (7-day retention). Consider:
- Increasing retention period for production
- Setting up cross-region snapshots

## Cost Estimates

**Development (MVP):**
- RDS db.t3.micro: ~$15/month
- Lambda (10K requests/day): ~$1/month
- API Gateway: ~$3/month
- Total: ~$20/month

**Production (10K users/day):**
- RDS db.t3.small: ~$30/month
- Lambda (1M requests/day): ~$20/month
- API Gateway: ~$35/month
- CloudFront: ~$10/month
- Total: ~$95/month

## Troubleshooting

### Lambda Timeout Connecting to Database

**Issue:** Lambda functions timeout at 30 seconds

**Solution:**
- Verify Lambda security group allows outbound to port 5432
- Verify RDS security group allows inbound from Lambda security group
- Check VPC route tables and NAT gateway configuration

### PostGIS Extension Not Available

**Issue:** `ERROR: could not open extension control file`

**Solution:**
- Verify RDS instance is PostgreSQL 15.3 or higher
- Ensure parameter group has `shared_preload_libraries` set to `postgis`

### Empty Map / No Census Tracts

**Issue:** Map loads but no tracts visible

**Solution:**
- Check that geometries were imported correctly:
  ```sql
  SELECT COUNT(*) FROM census_tracts WHERE geom IS NOT NULL;
  ```
- Verify tract data is returned by API:
  ```bash
  curl https://your-api-url/prod/search -X POST -H "Content-Type: application/json" -d '{"city":"Los Angeles"}'
  ```

## Scaling Considerations

For higher traffic:

1. **Database:**
   - Upgrade to db.t3.medium or db.m5.large
   - Enable Multi-AZ deployment
   - Add read replicas for search queries

2. **Lambda:**
   - Increase memory to 1024MB for faster cold starts
   - Enable provisioned concurrency for consistent latency

3. **API Gateway:**
   - Add WAF for DDoS protection
   - Use API keys for rate limiting per user

4. **Frontend:**
   - Use CloudFront CDN
   - Enable static asset caching
   - Use incremental static regeneration (ISR) in Next.js

## Security Hardening

1. **Database:**
   - Rotate credentials regularly
   - Enable encryption at rest (default)
   - Restrict security group to Lambda SG only

2. **API:**
   - Add API key authentication
   - Implement request throttling per IP
   - Add input validation and sanitization

3. **Secrets:**
   - Never commit `.env` files
   - Use AWS Secrets Manager rotation
   - Enable CloudTrail for audit logs

## Next Steps

1. Set up CI/CD pipeline (GitHub Actions)
2. Add automated testing
3. Enable automatic database backups to S3
4. Set up staging environment
5. Add analytics (Google Analytics, Plausible)

## Support

For issues or questions:
- GitHub Issues: https://github.com/psadigh91/CalEJ/issues
- Documentation: https://github.com/psadigh91/CalEJ

---

**Last Updated:** 2026-07-21  
**Version:** 1.0.0
