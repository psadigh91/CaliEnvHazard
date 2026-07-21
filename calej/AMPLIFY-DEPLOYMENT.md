# Deploy CalEJ to AWS Amplify

**Quick Start Guide for AWS Amplify Deployment**

---

## Prerequisites

- AWS Account with Amplify access
- AWS CLI configured
- Node.js 18+ installed locally
- Mapbox account (free at mapbox.com)

---

## Deployment Steps

### Step 1: Deploy Backend First (Required) ⚠️

The frontend needs the backend API URL, so deploy backend first:

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Bootstrap CDK (first time only)
npx cdk bootstrap aws://YOUR-ACCOUNT-ID/us-west-2

# Deploy infrastructure
npx cdk deploy --all

# SAVE THIS OUTPUT:
# CalEJ-API.ApiUrl: https://xxxxx.execute-api.us-west-2.amazonaws.com/prod
```

### Step 2: Enable PostGIS & Seed Data

```bash
# Get database credentials
aws secretsmanager get-secret-value \
  --secret-id <DatabaseSecretArn> \
  --region us-west-2 \
  --query SecretString \
  --output text

# Connect to database
psql -h <DatabaseEndpoint> -U calejadmin -d calej

# Enable PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
\q

# Seed sample data
export DB_HOST=<endpoint>
export DB_PORT=5432
export DB_NAME=calej
export DB_USER=calejadmin
export DB_PASSWORD=<from-secrets-manager>

npm run seed
```

### Step 3: Get Mapbox Token

1. Sign up at https://mapbox.com (free tier)
2. Create a new access token
3. Copy the token (starts with `pk.`)

### Step 4: Deploy Frontend to Amplify

#### Option A: Via Amplify Console (Easiest)

1. **Go to AWS Amplify Console**
   - https://console.aws.amazon.com/amplify

2. **Create New App → Deploy without Git**

3. **Upload This Zip File**
   - Drag and drop `calej-amplify-deploy.zip`
   - Or use the file picker

4. **Configure Build Settings**
   - App name: `calej`
   - Environment: `production`
   - Branch: `main`

5. **Add Environment Variables**
   Click "Environment variables" and add:
   ```
   NEXT_PUBLIC_API_URL=<your-api-gateway-url-from-step-1>
   NEXT_PUBLIC_MAPBOX_TOKEN=<your-mapbox-token>
   ```

6. **Build Settings** (should auto-detect, verify):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/.next
       files:
         - '**/*'
     cache:
       paths:
         - frontend/node_modules/**/*
   ```

7. **Deploy**
   - Click "Save and Deploy"
   - Wait 5-10 minutes for build

8. **Access Your Site**
   - Amplify will provide a URL: `https://main.xxxxx.amplifyapp.com`

#### Option B: Via Amplify CLI

```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Configure Amplify
amplify configure

# Initialize in frontend directory
cd frontend
amplify init
# Choose defaults, select your AWS profile

# Add hosting
amplify add hosting
# Choose: Hosting with Amplify Console
# Choose: Manual deployment

# Set environment variables (in Amplify Console or via CLI)
amplify env add
# Set NEXT_PUBLIC_API_URL and NEXT_PUBLIC_MAPBOX_TOKEN

# Deploy
amplify publish
```

---

## Verify Deployment

### Test Checklist

1. **Homepage loads**
   - ✅ Map appears
   - ✅ Search bar visible
   - ✅ Legend shows colors

2. **Search works**
   - ✅ Search "Los Angeles"
   - ✅ Results appear
   - ✅ Click result zooms map

3. **Tract details load**
   - ✅ Click any tract
   - ✅ Popup appears
   - ✅ "View Full Details" link works
   - ✅ Detail page shows all 20 indicators

4. **Navigation works**
   - ✅ About page loads
   - ✅ Data page loads
   - ✅ Footer links work

---

## Troubleshooting

### Issue: Map not loading

**Symptoms:** Blank screen, "Loading map..." forever

**Fixes:**
1. Check Mapbox token is set correctly in Amplify environment variables
2. Verify token is valid at mapbox.com
3. Check browser console for errors (F12)
4. Ensure `NEXT_PUBLIC_` prefix on environment variable

### Issue: API errors (500 or network errors)

**Symptoms:** Search returns nothing, tract details fail

**Fixes:**
1. Verify API URL is correct in Amplify environment variables
2. Check API Gateway is deployed and accessible:
   ```bash
   curl <API_URL>/search -X POST \
     -H "Content-Type: application/json" \
     -d '{"city":"Los Angeles"}'
   ```
3. Verify Lambda functions are deployed
4. Check CloudWatch logs for errors

### Issue: Build fails in Amplify

**Symptoms:** Amplify build fails during npm install or build

**Fixes:**
1. Check Node.js version in build settings (should be 18.x)
2. Verify package.json has all dependencies
3. Check Amplify build logs for specific error
4. Try local build first:
   ```bash
   cd frontend
   npm ci
   npm run build
   ```

### Issue: Environment variables not applied

**Symptoms:** API calls go to localhost, Mapbox errors

**Fixes:**
1. Environment variables must start with `NEXT_PUBLIC_`
2. Redeploy after adding environment variables
3. Clear cache and rebuild in Amplify Console
4. Verify variables in Amplify Console → App Settings → Environment variables

---

## Update Deployment

### Update Frontend Only

1. Make changes to frontend code
2. Zip updated files
3. Upload to Amplify Console
4. Rebuild

OR via CLI:
```bash
cd frontend
amplify publish
```

### Update Backend (API changes)

1. Make changes to backend code
2. Deploy updated stacks:
   ```bash
   cd backend
   npx cdk deploy --all
   ```
3. API URL remains the same (no frontend update needed)

---

## Amplify-Specific Configuration

### Custom Domain

1. Go to Amplify Console → Domain management
2. Add domain (e.g., calej.yourdomain.com)
3. Follow DNS verification steps
4. SSL certificate auto-provisioned

### CORS Update (Production)

After deploying with custom domain, restrict CORS:

1. Edit `backend/lib/api-stack.ts`:
   ```typescript
   allowOrigins: ['https://calej.yourdomain.com'],
   ```

2. Redeploy backend:
   ```bash
   cd backend
   npx cdk deploy CalEJ-API
   ```

### Performance Settings

In Amplify Console:
1. Enable "Server-side rendering" (automatically enabled for Next.js)
2. Enable "Asset optimization" (automatic compression)
3. Set cache headers in `next.config.js` if needed

---

## Cost Estimate

### AWS Amplify Hosting
- Build minutes: Free tier 1,000 minutes/month
- Hosting: Free tier 15 GB served/month, 5 GB stored
- After free tier: ~$0.15/GB served
- **Expected:** Free tier sufficient for MVP, ~$5-10/month with traffic

### Backend (from CDK deployment)
- RDS PostgreSQL: ~$15/month (db.t3.micro)
- Lambda: ~$1/month (10K requests/day)
- API Gateway: ~$3.50/month
- **Total Backend:** ~$20/month

### Mapbox
- Free tier: 50,000 map loads/month
- After free tier: $0.50/1,000 loads
- **Expected:** Free tier sufficient for MVP

**Grand Total:** $0-10/month initially, $20-30/month with modest traffic

---

## Monitoring

### Amplify Monitoring
- Go to Amplify Console → Monitoring
- View:
  - Deployment history
  - Build logs
  - Access logs
  - Performance metrics

### Backend Monitoring
- CloudWatch Logs for Lambda functions
- API Gateway metrics (requests, latency, errors)
- RDS Performance Insights

Set up CloudWatch Alarms for:
- Lambda errors > 10/hour
- API Gateway 5xx errors > 5%
- RDS CPU > 80%

---

## Security Best Practices

### Production Checklist

- [ ] Restrict CORS to your domain only
- [ ] Enable WAF on API Gateway (optional, ~$5/month)
- [ ] Set up CloudTrail logging
- [ ] Enable RDS encryption (already enabled)
- [ ] Rotate database credentials quarterly
- [ ] Enable Amplify access control (if needed)
- [ ] Set up AWS Budget alerts

---

## Support

### Documentation
- Full deployment guide: `docs/DEPLOYMENT.md`
- Testing results: `TEST-RESULTS.md`
- Quick start: `QUICKSTART.md`

### AWS Resources
- Amplify Docs: https://docs.amplify.aws
- CDK Docs: https://docs.aws.amazon.com/cdk
- API Gateway Docs: https://docs.aws.amazon.com/apigateway

### GitHub
- Repository: https://github.com/psadigh91/CalEJ
- Issues: https://github.com/psadigh91/CalEJ/issues

---

## Next Steps After Deployment

1. **Test thoroughly** using checklist above
2. **Monitor costs** in AWS Billing Dashboard
3. **Set up custom domain** (optional)
4. **Import full CalEnviroScreen data** (see DEPLOYMENT.md)
5. **Share with users** and gather feedback
6. **Plan Phase 2 features** (user accounts, data export, etc.)

---

**Deployment Time:** ~60-90 minutes total
- Backend: 45 minutes
- Frontend: 15 minutes
- Testing: 15 minutes

**Estimated by:** July 21, 2026

---

*For issues or questions, see TROUBLESHOOTING section above or open a GitHub issue.*
