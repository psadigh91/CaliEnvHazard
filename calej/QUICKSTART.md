# CalEJ Quick Start Guide

**🚀 Get CalEJ running in under 30 minutes**

---

## What You Need

- AWS Account with CLI configured
- Node.js 18+ installed
- Mapbox account (free tier, sign up at mapbox.com)
- 30 minutes

---

## Step 1: Clone & Install (5 minutes)

```bash
# Navigate to project
cd /Users/psadigh/Desktop/PS/calej

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## Step 2: Deploy Backend (10 minutes)

```bash
cd backend

# Bootstrap CDK (first time only)
npx cdk bootstrap aws://YOUR-ACCOUNT-ID/us-west-2

# Deploy infrastructure
npx cdk deploy --all

# Save these outputs:
# - CalEJ-Database.DatabaseEndpoint
# - CalEJ-Database.DatabaseSecretArn
# - CalEJ-API.ApiUrl
```

---

## Step 3: Setup Database (5 minutes)

```bash
# Get database password from Secrets Manager
aws secretsmanager get-secret-value \
  --secret-id <DatabaseSecretArn> \
  --region us-west-2 \
  --query SecretString \
  --output text

# Connect to database
psql -h <DatabaseEndpoint> -U calejadmin -d calej

# Enable PostGIS (copy/paste this)
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
\q
```

---

## Step 4: Seed Sample Data (5 minutes)

```bash
cd backend

# Set environment variables
export DB_HOST=<your-database-endpoint>
export DB_PORT=5432
export DB_NAME=calej
export DB_USER=calejadmin
export DB_PASSWORD=<from-secrets-manager>

# Run seed script
npm run seed
```

**Note:** This seeds sample data. For production, download full datasets (see DEPLOYMENT.md).

---

## Step 5: Launch Frontend (5 minutes)

```bash
cd frontend

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values:
# NEXT_PUBLIC_API_URL=<ApiUrl from Step 2>
# NEXT_PUBLIC_MAPBOX_TOKEN=<from mapbox.com>

# Start development server
npm run dev
```

**Open:** http://localhost:3000

---

## ✅ Success!

You should see:
- Interactive map of California
- Search bar (try "Los Angeles")
- Clickable census tracts
- About and Data pages working

---

## What's Next?

### For Development
- Add more test data
- Customize the frontend theme
- Test on mobile devices
- Explore the codebase

### For Production
1. **Import Full Data** (1 hour)
   - Download CalEnviroScreen 4.0 CSV
   - Download Census tract boundaries
   - Fetch EPA Superfund sites
   - Fetch EPA TRI facilities
   - See DEPLOYMENT.md for details

2. **Deploy Frontend** (15 minutes)
   - Push to GitHub
   - Deploy to Vercel (easiest, free)
   - OR AWS Amplify ($5/month)

3. **Configure Production Settings**
   - Restrict CORS to your domain
   - Add CloudWatch alarms
   - Enable RDS backups
   - See DEPLOYMENT.md for security hardening

---

## Troubleshooting

### Lambda can't connect to database
**Issue:** Timeout errors after 30 seconds

**Fix:**
1. Check Lambda security group allows outbound to port 5432
2. Check RDS security group allows inbound from Lambda SG
3. Verify Lambda is in same VPC as RDS

```bash
# Verify security groups
aws ec2 describe-security-groups \
  --filters "Name=tag:aws:cloudformation:stack-name,Values=CalEJ-*"
```

### Map not loading
**Issue:** Blank screen or "Loading map..." forever

**Fix:**
1. Check NEXT_PUBLIC_MAPBOX_TOKEN is set in .env.local
2. Verify Mapbox token is valid at mapbox.com
3. Check browser console for errors

### No census tracts visible
**Issue:** Map loads but no colored tracts

**Fix:**
1. Verify API URL is correct in .env.local
2. Check API is returning data:
   ```bash
   curl -X POST <API_URL>/search \
     -H "Content-Type: application/json" \
     -d '{"city":"Los Angeles"}'
   ```
3. Ensure seed script ran successfully

### "Table does not exist" error
**Issue:** Lambda returns 500 error

**Fix:**
1. Ensure PostGIS extension is enabled
2. Run seed script to create tables
3. Verify database connection:
   ```bash
   psql -h <endpoint> -U calejadmin -d calej -c "\dt"
   ```

---

## Useful Commands

### Backend

```bash
# Rebuild CDK
cd backend && npm run build

# View CDK changes (before deploy)
npx cdk diff

# Destroy infrastructure (careful!)
npx cdk destroy --all

# View logs
aws logs tail /aws/lambda/calej-get-tract --follow
```

### Frontend

```bash
# Build for production
cd frontend && npm run build

# Check for errors
npm run lint

# Start production server locally
npm run start
```

### Database

```bash
# Connect to database
psql -h <endpoint> -U calejadmin -d calej

# Check table counts
SELECT COUNT(*) FROM census_tracts;
SELECT COUNT(*) FROM superfund_sites;
SELECT COUNT(*) FROM tri_facilities;

# Test spatial query
SELECT tract_id, county_name, ces_percentile 
FROM census_tracts 
ORDER BY ces_percentile DESC 
LIMIT 10;
```

---

## Cost Monitoring

Check your AWS costs:

```bash
# View current month costs
aws ce get-cost-and-usage \
  --time-period Start=2026-07-01,End=2026-07-31 \
  --granularity MONTHLY \
  --metrics BlendedCost \
  --filter file://filter.json
```

Expected costs:
- **Development:** ~$20/month
- **Light Production:** ~$50/month
- **Heavy Production:** ~$110/month

Set up billing alerts:
1. Go to AWS Console → Billing → Alerts
2. Create alert for $25 threshold
3. Get email when approaching budget

---

## Getting Help

### Documentation
- **Full Deployment:** docs/DEPLOYMENT.md
- **Feature List:** COMPLETED-FEATURES.md
- **Architecture:** README.md

### Support
- **GitHub Issues:** https://github.com/psadigh91/CalEJ/issues
- **Discussions:** https://github.com/psadigh91/CalEJ/discussions

### Common Resources
- **CalEnviroScreen:** https://oehha.ca.gov/calenviroscreen
- **AWS CDK Docs:** https://docs.aws.amazon.com/cdk
- **Next.js Docs:** https://nextjs.org/docs
- **Mapbox Docs:** https://docs.mapbox.com

---

## Quick Reference

### Environment Variables

**Backend (for seeding):**
```bash
DB_HOST=<rds-endpoint>
DB_PORT=5432
DB_NAME=calej
DB_USER=calejadmin
DB_PASSWORD=<from-secrets-manager>
```

**Frontend (.env.local):**
```bash
NEXT_PUBLIC_API_URL=https://xxx.execute-api.us-west-2.amazonaws.com/prod
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1...
```

### API Endpoints

```bash
# Get tract details
GET /tracts/06037137000

# Search by city
POST /search
{"city": "Los Angeles"}

# Get nearby facilities
GET /facilities?lat=34.0522&lon=-118.2437&radius=5
```

### Project Structure

```
calej/
├── backend/           # AWS CDK infrastructure
│   ├── bin/           # CDK app entry
│   ├── lib/           # Stack definitions
│   ├── lambda/        # API functions
│   └── scripts/       # Data import
│
├── frontend/          # Next.js application
│   ├── app/           # Pages and layout
│   └── components/    # React components
│
└── docs/              # Documentation
    └── DEPLOYMENT.md  # Full guide
```

---

## Next Steps

Once everything is working locally:

1. ✅ **Verify all features work**
   - Map loads
   - Search finds tracts
   - Detail pages display data
   - About/Data pages render

2. 📦 **Upload to GitHub**
   - Follow GITHUB-UPLOAD.md
   - Create v1.0.0 release

3. 🌐 **Deploy to Production**
   - Import full datasets
   - Deploy frontend to Vercel
   - Restrict CORS
   - Set up monitoring

4. 📢 **Launch!**
   - Share on social media
   - Post in environmental justice communities
   - Announce to California advocacy groups

---

**That's it! You now have a working CalEJ instance.** 🎉

*Time to deployment: ~30 minutes*  
*Questions? Open a GitHub issue!*

---

**Built with ❤️ for California communities**
