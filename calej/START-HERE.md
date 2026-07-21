# 🚀 CalEJ Deployment - START HERE

**Your deployment-ready zip file:** `calej-amplify-deploy.zip` (89 KB)

---

## ⚡ Quick Deploy to AWS Amplify (15 minutes)

### Prerequisites Checklist

Before starting, make sure you have:
- [ ] AWS Account with Amplify access
- [ ] Mapbox account (free at https://mapbox.com)
- [ ] Backend already deployed (**IMPORTANT: Deploy backend first!**)

---

## Step 1: Deploy Backend (Required First!) ⚠️

The frontend needs the backend API URL, so you **must** deploy the backend first:

### A. Install Dependencies
```bash
cd /Users/psadigh/Desktop/PS/calej/backend
npm install
```

### B. Deploy Infrastructure
```bash
# Bootstrap CDK (first time only)
npx cdk bootstrap aws://YOUR-ACCOUNT-ID/us-west-2

# Deploy both stacks
npx cdk deploy --all
```

### C. Save These Outputs
After deployment completes, you'll see:
```
CalEJ-Database.DatabaseEndpoint = xxxx.rds.amazonaws.com
CalEJ-Database.DatabaseSecretArn = arn:aws:secretsmanager:...
CalEJ-API.ApiUrl = https://xxxxx.execute-api.us-west-2.amazonaws.com/prod
```

**📝 COPY the ApiUrl - you'll need it for Amplify!**

### D. Quick Database Setup
```bash
# Get database password
aws secretsmanager get-secret-value \
  --secret-id <DatabaseSecretArn> \
  --region us-west-2 \
  --query SecretString \
  --output text

# Connect and enable PostGIS
psql -h <DatabaseEndpoint> -U calejadmin -d calej
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

---

## Step 2: Get Mapbox Token (2 minutes)

1. Go to https://mapbox.com
2. Sign up (free tier is fine)
3. Go to Account → Tokens
4. Create a new token or copy existing token
5. **📝 COPY the token (starts with `pk.`)**

---

## Step 3: Deploy Frontend to Amplify (10 minutes)

### Option A: Via AWS Console (Easiest) 👈 **RECOMMENDED**

1. **Go to AWS Amplify Console**
   ```
   https://console.aws.amazon.com/amplify
   ```

2. **Click "New app" → "Deploy without Git"**

3. **Give it a name:** `calej`

4. **Drag and drop the zip file:**
   ```
   /Users/psadigh/Desktop/PS/calej/calej-amplify-deploy.zip
   ```

5. **Add Environment Variables** (CRITICAL!)
   
   Click "Environment variables" and add these TWO variables:
   
   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_URL` | `<Your API URL from Step 1C>` |
   | `NEXT_PUBLIC_MAPBOX_TOKEN` | `<Your Mapbox token from Step 2>` |

   ⚠️ **Make sure they start with `NEXT_PUBLIC_`**

6. **Verify Build Settings**
   
   Should auto-detect as Next.js. Verify it looks like this:
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

7. **Deploy!**
   
   Click "Save and deploy"
   
   Wait 5-10 minutes while Amplify:
   - Provisions resources
   - Installs dependencies
   - Builds your app
   - Deploys to CDN

8. **Get Your URL**
   
   After deployment, you'll get a URL like:
   ```
   https://main.xxxxxxxxxxxxx.amplifyapp.com
   ```
   
   **🎉 Your app is live!**

---

## Step 4: Test Your Deployment (5 minutes)

Visit your Amplify URL and verify:

### Homepage
- [ ] Map loads and shows California
- [ ] Search bar is visible
- [ ] Legend shows color scale (green, yellow, orange, red)

### Search Functionality
- [ ] Type "Los Angeles" in search
- [ ] Results dropdown appears
- [ ] Click a result → map zooms to that tract
- [ ] Tract info popup appears

### Navigation
- [ ] Click "About" in header → About page loads
- [ ] Click "Data Sources" → Data page loads
- [ ] Click "Map" → Returns to homepage

### Tract Details
- [ ] Click any census tract on map
- [ ] Popup shows tract info
- [ ] Click "View Full Details"
- [ ] Detail page loads with all 20 indicators
- [ ] Nearby facilities section appears (if data is seeded)

---

## 🎯 Success Criteria

✅ All checkboxes above are checked  
✅ No console errors (press F12 to check)  
✅ Map is interactive (can pan and zoom)  
✅ Search returns results  
✅ Tract details display properly  

**If all pass: 🎉 DEPLOYMENT SUCCESSFUL!**

---

## 🐛 Troubleshooting

### Map not loading / blank screen

**Problem:** Mapbox token issue

**Fix:**
1. Check environment variable is named `NEXT_PUBLIC_MAPBOX_TOKEN`
2. Verify token is valid at mapbox.com
3. Redeploy after fixing environment variables

### Search returns nothing / API errors

**Problem:** Backend not connected

**Fix:**
1. Check `NEXT_PUBLIC_API_URL` is correct
2. Test API directly:
   ```bash
   curl <API_URL>/search -X POST \
     -H "Content-Type: application/json" \
     -d '{"city":"Los Angeles"}'
   ```
3. Verify Lambda functions are deployed in AWS Console

### Build fails in Amplify

**Problem:** Dependencies or build configuration

**Fix:**
1. Check build logs in Amplify Console
2. Verify Node.js version is 18.x
3. Try local build first:
   ```bash
   cd frontend
   npm ci
   npm run build
   ```

### Environment variables not working

**Problem:** Missing `NEXT_PUBLIC_` prefix or not redeployed

**Fix:**
1. All frontend env vars MUST start with `NEXT_PUBLIC_`
2. After adding env vars, trigger a new deployment
3. Clear cache in Amplify Console settings

---

## 📊 What You Just Deployed

### Backend (AWS)
- **PostgreSQL Database** with PostGIS (spatial queries)
- **3 Lambda Functions** for API endpoints
- **API Gateway** for HTTP access
- **Secrets Manager** for database credentials

**Monthly Cost:** ~$20 (mostly the database)

### Frontend (Amplify)
- **Next.js 14 Application** with SSR
- **Interactive Map** powered by Mapbox
- **Search & Detail Pages** for 8,000+ census tracts
- **Mobile Responsive** design

**Monthly Cost:** ~$5-10 with light traffic (free tier available)

### Total Operating Cost: ~$25-30/month

---

## 🔄 Making Updates

### Update Frontend Only
1. Make changes to code in `/Users/psadigh/Desktop/PS/calej/frontend`
2. Create new zip:
   ```bash
   cd /Users/psadigh/Desktop/PS/calej
   zip -r calej-frontend-update.zip frontend/ \
     -x "*/node_modules/*" -x "*/.next/*" -x "*/.env*"
   ```
3. Upload to Amplify Console
4. Redeploy

### Update Backend Only
1. Make changes to code in `/Users/psadigh/Desktop/PS/calej/backend`
2. Deploy changes:
   ```bash
   cd backend
   npx cdk deploy --all
   ```
3. API URL stays the same (no frontend update needed)

---

## 🎨 Customization Ideas

### Add Custom Domain
1. Go to Amplify Console → Domain management
2. Add your domain (e.g., calej.yourdomain.com)
3. Follow DNS setup instructions
4. SSL certificate auto-provisioned

### Restrict CORS (Production)
Edit `backend/lib/api-stack.ts`:
```typescript
allowOrigins: ['https://your-amplify-url.amplifyapp.com'],
```
Then redeploy backend.

### Import Full Data
See `docs/DEPLOYMENT.md` for instructions on importing:
- Full CalEnviroScreen 4.0 CSV (8,000+ tracts)
- Complete EPA Superfund site list
- Complete EPA TRI facility data
- Census tract boundaries (GeoJSON)

---

## 📚 Additional Resources

### Documentation
- **Full Deployment Guide:** `docs/DEPLOYMENT.md`
- **Amplify-Specific Guide:** `AMPLIFY-DEPLOYMENT.md`
- **Testing Results:** `TEST-RESULTS.md` (89 tests, all pass)
- **Quick Start:** `QUICKSTART.md`

### Support
- **GitHub Issues:** https://github.com/psadigh91/CalEJ/issues
- **AWS Amplify Docs:** https://docs.amplify.aws
- **Mapbox Docs:** https://docs.mapbox.com

### Project Info
- **License:** MIT (free to use, modify, distribute)
- **Data Sources:** All public government data
- **Version:** 1.0.0
- **Status:** Production ready ✅

---

## 🎉 Congratulations!

You now have a fully functional environmental justice mapping platform running on AWS!

**Next steps:**
1. Share with friends/colleagues
2. Gather feedback
3. Import more data (see DEPLOYMENT.md)
4. Plan future enhancements
5. Consider contributing back to the project

---

## 📞 Need Help?

1. Check `AMPLIFY-DEPLOYMENT.md` for detailed troubleshooting
2. Review `TEST-RESULTS.md` to understand the architecture
3. Open an issue on GitHub
4. Check AWS Amplify build logs in Console

---

**Deployment Guide Created:** July 21, 2026  
**Version:** 1.0.0  
**Status:** Ready to Deploy 🚀

**Estimated Total Time:** 30-45 minutes  
(Backend: 20 min, Frontend: 10 min, Testing: 10 min)

---

*Good luck with your deployment! 🎯*
