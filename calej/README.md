# CalEJ - California Environmental Justice Mapper

**Live Demo**: [Coming Soon]  
**GitHub**: https://github.com/psadigh91/CalEJ  
**License**: MIT

---

## 🗺️ What is CalEJ?

CalEJ is an interactive web platform that maps environmental hazards and demographic data across California communities. It combines CalEnviroScreen scores, EPA Superfund sites, toxic release facilities, and census demographics to help Californians understand environmental justice issues in their neighborhoods.

### Key Features

- 🗺️ **Interactive Map** - Explore 8,000+ California census tracts
- 📊 **Pollution Burden Scores** - CalEnviroScreen 4.0 comprehensive ratings
- 🏭 **Facility Tracking** - EPA Superfund sites and TRI facilities
- 👥 **Demographics** - Income, race/ethnicity, language, education
- 🔍 **Address Search** - Find your neighborhood in seconds
- 📱 **Mobile Responsive** - Works on any device
- 🆓 **Free & Open Source** - No ads, no tracking, community-driven

---

## 🎯 Why CalEJ?

**The Problem**: Environmental hazards (contaminated sites, industrial pollution, toxic waste) disproportionately impact low-income communities and communities of color. Data exists but is scattered across multiple government sources and hard to access.

**The Solution**: CalEJ brings together multiple data sources into one interactive map, making it easy for:
- **Residents** to understand environmental issues in their community
- **Advocates** to identify and organize around environmental justice concerns
- **Researchers** to analyze patterns across California
- **Journalists** to investigate environmental inequities
- **Policymakers** to make data-driven decisions

---

## 📊 Data Sources

CalEJ integrates data from trusted government sources:

1. **CalEnviroScreen 4.0** (California EPA)
   - Pollution burden scores for all CA census tracts
   - 20 environmental and health indicators
   - Updated October 2021

2. **EPA Superfund Sites** (CERCLIS)
   - Contaminated land requiring cleanup
   - National Priorities List (NPL) status
   - Real-time API updates

3. **EPA Toxics Release Inventory** (TRI)
   - Industrial facilities releasing toxic chemicals
   - Annual pollution quantities by chemical
   - Historical data (1987-present)

4. **U.S. Census Bureau** (American Community Survey)
   - Demographic data at census tract level
   - Income, race/ethnicity, language, education
   - Updated annually

All data is public domain and freely accessible.

---

## 🚀 Quick Start

### For Users

Visit the live site and:
1. Search for your address or click on the map
2. View your census tract's pollution burden score
3. See nearby Superfund sites and TRI facilities
4. Compare your area to the California average

### For Developers

```bash
# Clone the repository
git clone https://github.com/psadigh91/CalEJ.git
cd calej

# Backend setup (AWS CDK)
cd backend
npm install
cdk bootstrap
cdk deploy --all

# Seed data
npm run seed

# Frontend setup
cd ../frontend
npm install
cp .env.example .env.local
# Edit .env.local with API URL from CDK output
npm run dev

# Visit http://localhost:3000
```

Detailed deployment instructions: [DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## 🏗️ Architecture

### Technology Stack

**Frontend**:
- Next.js 14 (React 18, App Router)
- TypeScript
- Tailwind CSS
- Mapbox GL JS (interactive mapping)
- Recharts (data visualization)
- React Query (data fetching)

**Backend**:
- AWS Lambda (serverless functions)
- Amazon API Gateway (REST API)
- PostgreSQL + PostGIS (spatial database)
- Amazon RDS (managed database)
- AWS CDK (infrastructure as code)

**Data Pipeline**:
- CalEnviroScreen 4.0 CSV import
- EPA Envirofacts API integration
- Census Bureau API integration
- GeoJSON processing for tract boundaries

### System Architecture

```
┌─────────────┐
│   Browser   │
│  (Next.js)  │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│   AWS Amplify       │
│  (Static Hosting)   │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│   API Gateway       │
│  (REST Endpoints)   │
└──────┬──────────────┘
       │
       ▼
┌──────────────────────────────────────┐
│          AWS Lambda                   │
│  ┌──────────┬──────────┬───────────┐ │
│  │ Tracts   │ Search   │ Facilities│ │
│  └──────────┴──────────┴───────────┘ │
└──────┬───────────────────────────────┘
       │
       ▼
┌─────────────────────┐      ┌──────────────┐
│  PostgreSQL + PostGIS│◄────►│  EPA APIs    │
│   (RDS Database)     │      │  (External)  │
└──────────────────────┘      └──────────────┘
```

---

## 📱 Features

### Interactive Map

- **Color-Coded Tracts**: Census tracts colored by CalEnviroScreen percentile
- **Facility Markers**: Superfund sites (red pins), TRI facilities (orange pins)
- **Zoom & Pan**: Explore anywhere in California
- **Click for Details**: Tap any tract to see full breakdown
- **Layer Toggles**: Show/hide environmental layers

### Tract Detail View

Each census tract shows:
- Overall CalEnviroScreen score and percentile
- Pollution burden breakdown (air quality, water, hazardous waste)
- Population characteristics breakdown (age, income, education, race/ethnicity, health)
- Nearby facilities (Superfund sites within 5 miles, TRI facilities)
- Comparison to California average
- Designated as "disadvantaged community" (SB 535)

### Search & Discovery

- **Address Search**: Enter any California address
- **City Search**: Find all tracts in a city
- **ZIP Code Search**: Explore by postal code
- **Filter by Score**: Show only high-pollution areas
- **Disadvantaged Communities**: Filter for SB 535 designated areas

---

## 📖 Understanding the Scores

### CalEnviroScreen Scores

CalEnviroScreen ranks census tracts on a scale of 1-100:
- **1-25**: Lower pollution burden
- **26-50**: Moderate pollution burden
- **51-75**: Higher pollution burden (watch zones)
- **76-100**: Highest pollution burden (priority areas)

Tracts scoring 75+ are designated as "disadvantaged communities" under California SB 535.

### Components

**Pollution Burden** (50% of score):
- Ozone and PM2.5 air pollution
- Diesel particulate matter
- Drinking water contaminants
- Pesticide use
- Toxic releases from facilities
- Traffic density
- Cleanup sites (Superfund, etc.)
- Groundwater threats
- Hazardous waste
- Impaired water bodies
- Solid waste sites

**Population Characteristics** (50% of score):
- Asthma rates
- Low birth weight
- Cardiovascular disease
- Educational attainment
- Housing burden
- Linguistic isolation
- Poverty
- Unemployment

---

## 🤝 Contributing

CalEJ is open source and welcomes contributions!

### How to Contribute

1. **Report Issues**: Found a bug or have a feature request? [Open an issue](https://github.com/psadigh91/CalEJ/issues)
2. **Submit PRs**: Fix bugs, add features, improve documentation
3. **Share Data**: Know of additional data sources? Let us know
4. **Spread the Word**: Share CalEJ with your community

### Development Setup

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed development guidelines.

---

## 💰 Cost Estimate

### Development (Free Tier)
- **Lambda**: Free (1M requests/month)
- **RDS PostgreSQL**: ~$15/month (db.t3.micro)
- **API Gateway**: Free (1M requests/month)
- **S3**: <$1/month
- **Amplify Hosting**: Free tier or ~$5/month

**Total**: ~$20/month for California-only deployment

### Production (10K monthly users)
- **Lambda**: $5/month
- **RDS PostgreSQL**: $30/month (db.t3.small)
- **API Gateway**: $3.50/month
- **Data Transfer**: $5/month
- **Amplify Hosting**: $15/month

**Total**: ~$60/month

---

## 🔒 Privacy & Security

- **No User Tracking**: We don't collect personal data
- **No Cookies**: Session-free browsing
- **Open Source**: All code is auditable
- **Public Data Only**: We display government data, no private information
- **Secure Infrastructure**: AWS best practices (encryption, IAM policies)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

This project displays public government data. Data sources retain their original licenses:
- CalEnviroScreen 4.0: Public domain (California EPA)
- EPA Data: Public domain (U.S. Government)
- Census Data: Public domain (U.S. Census Bureau)

---

## 🙏 Acknowledgments

Built with:
- **CalEnviroScreen 4.0** by California Office of Environmental Health Hazard Assessment (OEHHA)
- **EPA Envirofacts** APIs
- **U.S. Census Bureau** American Community Survey
- **Mapbox** for mapping platform
- **Next.js** and the React ecosystem
- **Claude Code** (Anthropic) for development assistance

Inspired by:
- EPA EJScreen
- CalEnviroScreen website
- Environmental justice organizations across California

---

## 📧 Contact

- **Issues**: [GitHub Issues](https://github.com/psadigh91/CalEJ/issues)
- **Email**: [Your contact email]
- **Portfolio**: https://github.com/psadigh91

---

## 🗺️ Roadmap

### Phase 1: MVP (Current)
- [x] California census tract mapping
- [x] CalEnviroScreen 4.0 integration
- [x] EPA Superfund and TRI data
- [x] Address search
- [x] Tract detail pages

### Phase 2: Enhanced Features
- [ ] Historical trend analysis (pollution over time)
- [ ] County and city aggregations
- [ ] Downloadable reports (PDF export)
- [ ] Comparison tool (compare two tracts)
- [ ] Mobile app (iOS/Android)

### Phase 3: Community Features
- [ ] Community incident reporting
- [ ] User accounts and saved locations
- [ ] Email alerts for nearby facility changes
- [ ] Advocacy toolkit (template letters, meeting resources)
- [ ] Spanish language support

### Phase 4: Expansion
- [ ] Additional states (starting with Oregon, Washington)
- [ ] National coverage using EPA EJScreen
- [ ] Climate resilience data (flooding, heat, wildfires)
- [ ] Air quality real-time monitoring

---

**Last Updated**: July 21, 2026  
**Version**: 1.0.0 MVP  
**Status**: In Development 🚧
