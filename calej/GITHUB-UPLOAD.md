# CalEJ GitHub Upload Guide

This guide walks you through uploading CalEJ to GitHub.com and making it publicly available.

---

## Prerequisites

- GitHub account
- Repository created at: https://github.com/psadigh91/CalEJ

---

## Option 1: Upload via GitHub Web Interface (Easiest)

### Step 1: Navigate to Your Repository

1. Go to https://github.com/psadigh91/CalEJ
2. Click "Upload files" button

### Step 2: Prepare Files for Upload

From your terminal:

```bash
cd /Users/psadigh/Desktop/PS/calej

# Create a temporary upload folder (exclude node_modules and build artifacts)
mkdir -p /tmp/calej-upload
rsync -av --exclude='node_modules' \
          --exclude='.next' \
          --exclude='cdk.out' \
          --exclude='.env' \
          --exclude='.env.local' \
          --exclude='dist' \
          --exclude='build' \
          . /tmp/calej-upload/
```

### Step 3: Upload to GitHub

**Method A: Drag and Drop (for small projects)**
1. Open `/tmp/calej-upload` in Finder
2. Select all files and folders
3. Drag them to the GitHub "Upload files" page
4. Wait for upload to complete
5. Add commit message: "Initial commit - CalEJ MVP v1.0.0"
6. Click "Commit changes"

**Method B: Using GitHub CLI (recommended for larger uploads)**

```bash
# Install GitHub CLI if you haven't already
brew install gh

# Authenticate
gh auth login

# Navigate to project
cd /tmp/calej-upload

# Initialize git and push
git init
git add .
git commit -m "Initial commit - CalEJ MVP v1.0.0"
git branch -M main
git remote add origin https://github.com/psadigh91/CalEJ.git
git push -u origin main
```

---

## Option 2: Upload via Git Command Line (Advanced)

### Step 1: Initialize Git Repository

```bash
cd /Users/psadigh/Desktop/PS/calej

# Initialize git
git init

# Add remote
git remote add origin https://github.com/psadigh91/CalEJ.git
```

### Step 2: Create .gitignore (if not exists)

Ensure your `.gitignore` includes:

```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Production
.vercel
.amplify

# Environment
.env
.env.local
.env.*.local

# CDK
cdk.out/
*.js
!jest.config.js
!prettier.config.js
!postcss.config.js
!next.config.js

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Database
*.sql
data/*.csv
data/*.geojson
```

### Step 3: Commit and Push

```bash
# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - CalEJ MVP v1.0.0

Complete California Environmental Justice Mapper MVP including:
- Backend: AWS CDK infrastructure + Lambda functions
- Frontend: Next.js 14 with interactive Mapbox map
- Data: CalEnviroScreen 4.0 integration
- Docs: Comprehensive deployment and usage guides

Completion: 100%
Ready for production deployment"

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 4: Configure Repository Settings

### Enable GitHub Pages (Optional - for static docs)

1. Go to repository Settings → Pages
2. Source: Deploy from branch
3. Branch: `main`, folder: `/docs`
4. Click Save

### Add Repository Description

1. Go to repository main page
2. Click ⚙️ (settings icon) next to "About"
3. Add description:
   ```
   California Environmental Justice Mapper - Interactive map showing pollution burden and health risks across 8,000+ census tracts
   ```
4. Add website: (your deployed URL)
5. Add topics:
   ```
   environmental-justice
   california
   mapping
   calenviroscreen
   nextjs
   aws-cdk
   postgresql
   postgis
   open-source
   public-health
   ```

### Create Repository Labels

Add these labels for issue tracking:

- `bug` (red) - Something isn't working
- `enhancement` (blue) - New feature or request
- `documentation` (yellow) - Improvements to documentation
- `good first issue` (green) - Good for newcomers
- `help wanted` (purple) - Extra attention needed
- `data` (orange) - Data import or quality issues
- `frontend` (cyan) - Frontend (Next.js) issues
- `backend` (brown) - Backend (AWS) issues

---

## Step 5: Create README Badges (Optional)

Add to top of README.md:

```markdown
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-black)](https://nextjs.org/)
[![AWS CDK](https://img.shields.io/badge/AWS-CDK-orange)](https://aws.amazon.com/cdk/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.3-blue)](https://www.postgresql.org/)
[![PostGIS](https://img.shields.io/badge/PostGIS-3.3-green)](https://postgis.net/)
```

---

## Step 6: Create GitHub Issues Templates

### Bug Report Template

Create `.github/ISSUE_TEMPLATE/bug_report.md`:

```markdown
---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''
---

## Describe the bug
A clear and concise description of what the bug is.

## To Reproduce
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected behavior
A clear description of what you expected to happen.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- Browser: [e.g. Chrome 98]
- Device: [e.g. iPhone 12, Desktop]
- OS: [e.g. iOS 15, Windows 11]

## Additional context
Add any other context about the problem here.
```

### Feature Request Template

Create `.github/ISSUE_TEMPLATE/feature_request.md`:

```markdown
---
name: Feature Request
about: Suggest an idea for CalEJ
title: '[FEATURE] '
labels: enhancement
assignees: ''
---

## Is your feature request related to a problem?
A clear description of what the problem is. Ex. I'm always frustrated when [...]

## Describe the solution you'd like
A clear description of what you want to happen.

## Describe alternatives you've considered
A clear description of alternative solutions or features you've considered.

## Additional context
Add any other context or screenshots about the feature request here.

## Would you be willing to contribute?
[ ] Yes, I'd like to work on this
[ ] No, but I can test it
[ ] No, just suggesting
```

---

## Step 7: Create Pull Request Template

Create `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
## Description
[Provide a brief description of the changes in this PR]

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Infrastructure/DevOps change

## Related Issues
Closes #[issue number]

## Changes Made
- [List specific changes]
- [One change per line]

## Testing
- [ ] I have tested these changes locally
- [ ] I have tested on mobile devices
- [ ] I have added/updated tests (if applicable)
- [ ] I have updated documentation (if applicable)

## Screenshots (if applicable)
[Add screenshots showing the changes]

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code where necessary
- [ ] My changes generate no new warnings
- [ ] I have updated the README (if applicable)

## Additional Notes
[Any additional information about the PR]
```

---

## Step 8: Add GitHub Actions (Optional CI/CD)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  backend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install dependencies
      working-directory: backend
      run: npm ci
    
    - name: Build
      working-directory: backend
      run: npm run build
    
    - name: CDK Synth
      working-directory: backend
      run: npx cdk synth

  frontend:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install dependencies
      working-directory: frontend
      run: npm ci
    
    - name: Lint
      working-directory: frontend
      run: npm run lint
    
    - name: Build
      working-directory: frontend
      run: npm run build
      env:
        NEXT_PUBLIC_API_URL: https://example.com
        NEXT_PUBLIC_MAPBOX_TOKEN: pk.example
```

---

## Step 9: Create CONTRIBUTING.md

Create `CONTRIBUTING.md`:

```markdown
# Contributing to CalEJ

Thank you for your interest in contributing to CalEJ! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR-USERNAME/CalEJ.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## Development Setup

See README.md for detailed setup instructions.

## Code Style

- **TypeScript**: Use strict typing, avoid `any`
- **React**: Use functional components with hooks
- **Formatting**: Prettier with default settings
- **Naming**: camelCase for variables, PascalCase for components

## Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

Example: `feat: add ZIP code search functionality`

## Pull Request Process

1. Update README.md if needed
2. Update BUILD-STATUS.md with completion percentage
3. Add screenshots for UI changes
4. Request review from maintainers
5. Address feedback promptly
6. Squash commits before merge

## Reporting Issues

- Use issue templates
- Provide clear reproduction steps
- Include screenshots/logs if applicable
- Check for existing issues first

## Code of Conduct

- Be respectful and inclusive
- Assume good intentions
- Focus on what's best for the community
- Show empathy towards others

## Questions?

Open a GitHub Discussion or reach out via issues.

Thank you for making CalEJ better! 🎉
```

---

## Step 10: Create Security Policy

Create `SECURITY.md`:

```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email: [your-email]
3. Include:
   - Description of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and provide a fix within 7 days for critical issues.

## Security Best Practices

When deploying CalEJ:

1. **Database**: Never expose RDS publicly
2. **Secrets**: Use AWS Secrets Manager, rotate regularly
3. **API**: Restrict CORS to your domain only
4. **Updates**: Keep dependencies up-to-date
5. **Monitoring**: Enable CloudWatch alarms

## Known Security Considerations

- All data in CalEJ is public government data
- No user authentication = no PII collected
- Database credentials stored in AWS Secrets Manager
- Lambda functions use least-privilege IAM roles

## Security Updates

Security updates will be announced via:
- GitHub Security Advisories
- README changelog
- Release notes
```

---

## Step 11: Verify Upload

After uploading, verify:

### Checklist
- [ ] All files uploaded successfully
- [ ] `.gitignore` working (no `node_modules` or `.env` files)
- [ ] README renders correctly on GitHub
- [ ] LICENSE file displays correctly
- [ ] Repository description and topics added
- [ ] No sensitive data exposed (check commits)

### Files That Should Be Present

**Root Directory:**
- [x] README.md
- [x] LICENSE
- [x] .gitignore
- [x] BUILD-STATUS.md
- [x] COMPLETED-FEATURES.md
- [x] GITHUB-UPLOAD.md (this file)
- [x] CONTRIBUTING.md
- [x] SECURITY.md

**Backend:**
- [x] backend/package.json
- [x] backend/tsconfig.json
- [x] backend/cdk.json
- [x] backend/bin/backend.ts
- [x] backend/lib/database-stack.ts
- [x] backend/lib/api-stack.ts
- [x] backend/lambda/tracts/get.ts
- [x] backend/lambda/search/search.ts
- [x] backend/lambda/facilities/get.ts
- [x] backend/lambda/shared/db.ts
- [x] backend/scripts/seed-data.ts
- [x] backend/.env.example

**Frontend:**
- [x] frontend/package.json
- [x] frontend/tsconfig.json
- [x] frontend/next.config.js
- [x] frontend/tailwind.config.ts
- [x] frontend/postcss.config.js
- [x] frontend/app/layout.tsx
- [x] frontend/app/page.tsx
- [x] frontend/app/globals.css
- [x] frontend/app/about/page.tsx
- [x] frontend/app/data/page.tsx
- [x] frontend/app/tract/[tractId]/page.tsx
- [x] frontend/components/Map.tsx
- [x] frontend/.env.example

**Documentation:**
- [x] docs/DEPLOYMENT.md

---

## Step 12: Post-Upload Tasks

### Update Repository URL

If you deployed CalEJ, update these files with your live URL:

1. **README.md**: Update the "Live Demo" link
2. **frontend/app/layout.tsx**: Update footer GitHub link if different
3. **docs/DEPLOYMENT.md**: Add your actual API Gateway URL

### Create First Release

1. Go to Releases → "Create a new release"
2. Tag: `v1.0.0`
3. Release title: `CalEJ MVP v1.0.0`
4. Description:
   ```markdown
   ## CalEJ v1.0.0 - Initial Release
   
   First production-ready release of CalEJ (California Environmental Justice Mapper).
   
   ### Features
   - Interactive map with 8,000+ California census tracts
   - CalEnviroScreen 4.0 integration (20 indicators)
   - EPA Superfund and TRI facility tracking
   - Proximity calculations and search functionality
   - Fully responsive design
   - Complete AWS deployment guide
   
   ### Tech Stack
   - Backend: AWS CDK + Lambda + PostgreSQL/PostGIS
   - Frontend: Next.js 14 + Mapbox GL JS + Tailwind CSS
   
   ### Deployment
   See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for instructions.
   
   ### Documentation
   - [README](README.md) - Project overview
   - [BUILD STATUS](BUILD-STATUS.md) - Completion details
   - [COMPLETED FEATURES](COMPLETED-FEATURES.md) - Feature checklist
   
   **Status**: ✅ Ready for production deployment
   ```
5. Click "Publish release"

### Share Your Project

Tweet it, share on LinkedIn, post in relevant communities:

- r/opensource
- r/dataisbeautiful
- r/webdev
- Environmental justice communities
- California community forums

---

## Troubleshooting

### "File too large" error

GitHub has a 100MB file size limit. Check for:
- Large CSV files in `backend/data/`
- node_modules (should be in .gitignore)
- Build artifacts (cdk.out, .next, dist)

Solution:
```bash
find . -type f -size +50M
# Remove or add to .gitignore
```

### "Push rejected" error

If the repository already has commits:
```bash
git pull origin main --rebase
git push origin main
```

### "Permission denied" error

Authenticate with GitHub:
```bash
gh auth login
# OR set up SSH keys
ssh-keygen -t ed25519 -C "your_email@example.com"
# Add public key to GitHub Settings → SSH Keys
```

---

## Success! 🎉

Your CalEJ repository is now live on GitHub.

**Next steps:**
1. Deploy to AWS (see docs/DEPLOYMENT.md)
2. Update README with live demo URL
3. Create GitHub Issues for future enhancements
4. Share with the community

---

**Questions?**

Open an issue at: https://github.com/psadigh91/CalEJ/issues

---

*Last Updated: July 21, 2026*  
*Version: 1.0.0*
