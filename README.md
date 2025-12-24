# Practicum Demo Docker

Demo application for Yandex Practicum webinar (web+, sprint 16) with full CI/CD setup.

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose installed
- Node.js 22+ (for local development)

### Local Development

```bash
# 1. Clone the repository
git clone <repository-url>
cd node_21

# 2. Copy environment file
cp .env.example .env

# 3. Start development environment
docker compose up -d

# Access the application:
# - Frontend: http://localhost:9000
# - Backend: http://localhost:4000
# - Adminer: http://localhost:9001
```

### Development without Docker

**Backend:**
```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

---

## 📁 Project Structure

```
node_21/
├── backend/                 # NestJS backend application
│   ├── src/                # Source code
│   ├── Dockerfile          # Development Docker image
│   ├── Dockerfile.pub      # Production Docker image (optimized)
│   └── ecosystem.config.js # PM2 configuration
├── frontend/               # React frontend application
│   ├── src/               # Source code
│   ├── nginx/             # Nginx configuration
│   ├── Dockerfile         # Development Docker image
│   └── Dockerfile.pub     # Production Docker image (optimized)
├── scripts/               # Deployment scripts
│   ├── deploy-staging.sh   # Staging deployment script
│   └── deploy-production.sh # Production deployment script
├── .github/workflows/     # GitHub Actions CI/CD
│   ├── ci.yml             # Continuous Integration
│   ├── deploy-staging.yml # Staging deployment
│   └── deploy-production.yml # Production deployment
├── docker-compose.yml     # Development environment
├── docker-compose.staging.yml    # Staging environment
├── docker-compose.production.yml # Production environment
└── DEPLOYMENT.md          # Detailed deployment guide
```

---

## 🔄 CI/CD Pipeline

This project includes a complete CI/CD setup with GitHub Actions for automated testing and deployment.

### Workflows

1. **CI (Continuous Integration)** - [ci.yml](.github/workflows/ci.yml)
   - Runs on every PR and push to `main`/`develop`
   - Linting, type checking, tests
   - Docker build validation

2. **Staging Deployment** - [deploy-staging.yml](.github/workflows/deploy-staging.yml)
   - Triggers on PR open/update to `main`
   - Automatic deployment to staging server
   - Comments on PR with deployment URLs
   - Telegram notifications

3. **Production Deployment** - [deploy-production.yml](.github/workflows/deploy-production.yml)
   - Triggers on release creation
   - Manual approval required
   - Zero-downtime rolling update
   - Database backup before deployment
   - Telegram notifications

### Deployment Flow

```
Feature Branch → PR to main → Staging Deploy → Code Review → Merge → Release → Production Deploy
```

---

## 🌍 Environments

### Staging
- **Purpose:** Testing before production
- **Trigger:** Automatic on PR open/update
- **Image Tags:** `pr-{number}`
- **Database:** Separate staging database
- **URLs:** Configure in GitHub Secrets

### Production
- **Purpose:** Live production environment
- **Trigger:** Manual via release creation
- **Image Tags:** Semantic versioning (e.g., `v1.0.0`)
- **Database:** Production database with backups
- **URLs:** Configure in GitHub Secrets

---

## 🔧 Configuration

### Environment Variables

See [.env.example](.env.example) for all available environment variables.

**Key Variables:**
- `POSTGRES_*` - Database configuration
- `BACKEND_PORT` - Backend API port (default: 4000)
- `FRONTEND_PORT` - Frontend port (default: 9000)
- `REACT_APP_API_URL` - Frontend API endpoint
- `NODE_ENV` - Environment (development/staging/production)
- `TYPEORM_SYNC` - Auto-sync database schema (1=enabled, 0=disabled)

### GitHub Secrets Setup

For CI/CD to work, you need to configure GitHub Secrets. See [DEPLOYMENT.md](DEPLOYMENT.md#настройка-github-secrets) for detailed instructions.

**Required Secrets:**
- Docker Hub credentials
- SSH credentials for staging/production servers
- Database credentials
- Telegram bot token and chat ID
- Environment-specific URLs

---

## 📦 Docker Images

### Development Images
- Built from `Dockerfile` (backend/frontend)
- Include dev dependencies
- Hot-reload enabled
- Not optimized for size

### Production Images
- Built from `Dockerfile.pub` (backend/frontend)
- Multi-stage builds
- Production dependencies only
- Optimized for size and performance

**Backend Production Stack:**
- Node.js 22 Alpine
- TypeScript compiled to JavaScript
- PM2 process manager

**Frontend Production Stack:**
- Build stage: Node.js 22 Alpine
- Runtime stage: Nginx Alpine
- Static files served by Nginx

---

## 🚢 Deployment

### Quick Deployment Guide

1. **Setup Servers:** Follow [DEPLOYMENT.md](DEPLOYMENT.md#настройка-серверов)
2. **Configure Secrets:** Add all required secrets to GitHub
3. **Deploy to Staging:** Open a PR to `main`
4. **Test:** Verify changes on staging environment
5. **Deploy to Production:** Create a release with semver tag

### Detailed Guide

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Complete setup instructions
- Server configuration
- CI/CD pipeline details
- Rollback procedures
- Troubleshooting

---

## 🔄 Deployment Commands

### Create a Staging Deployment
```bash
# 1. Create feature branch
git checkout -b feature/my-feature

# 2. Make changes and commit
git add .
git commit -m "Add new feature"

# 3. Push and create PR
git push origin feature/my-feature
# Open PR on GitHub: main ← feature/my-feature

# Staging will deploy automatically!
```

### Create a Production Release
```bash
# 1. Ensure main is up to date
git checkout main
git pull origin main

# 2. Create and push tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# 3. Create release on GitHub
gh release create v1.0.0 \
  --title "Release v1.0.0" \
  --notes "Release notes here"

# 4. Approve deployment in GitHub Actions
# Actions → Deploy to Production → Review deployments → Approve
```

### Manual Deployment (Emergency)
```bash
# Go to GitHub Actions
# → Deploy to Production
# → Run workflow
# → Enter version tag (e.g., v1.0.0)
# → Run workflow
```

---

## 🧪 Testing

### Run Tests Locally

**Backend:**
```bash
cd backend
npm test
npm run test:e2e
npm run test:cov
```

**Frontend:**
```bash
cd frontend
npm test
npm test -- --coverage
```

### CI Tests

Tests run automatically on every PR:
- ESLint
- TypeScript type checking
- Unit tests
- Integration tests
- Build verification

---

## 📱 Notifications

Telegram notifications are sent for:
- ✅ Successful deployments (staging & production)
- ❌ Failed deployments
- 🚀 Production releases

Notifications include:
- Deployment status
- Environment details
- URLs to access the application
- Docker image tags
- Links to PR/Release/Workflow

---

## 🔙 Rollback

### Quick Rollback to Previous Version

**Option 1: Create new release with old tag**
```bash
gh release create v1.0.0-rollback \
  --target v1.0.0 \
  --title "Rollback to v1.0.0" \
  --notes "Rolling back due to issues"
```

**Option 2: Manual rollback on server**
```bash
ssh root@production-server
cd /home/deploy/production
docker compose -f docker-compose.production.yml down
sed -i 's/IMAGE_TAG=v1.1.0/IMAGE_TAG=v1.0.0/' .env.production
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up -d
```

See [DEPLOYMENT.md](DEPLOYMENT.md#rollback-откат-изменений) for detailed rollback procedures.

---

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS 9
- **Language:** TypeScript
- **Database:** PostgreSQL 14
- **ORM:** TypeORM
- **Process Manager:** PM2
- **Runtime:** Node.js 22

### Frontend
- **Framework:** React 17
- **Language:** TypeScript
- **State Management:** Redux
- **Routing:** React Router
- **Build Tool:** react-scripts (Create React App)
- **Web Server:** Nginx (production)

### DevOps
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Registry:** Docker Hub
- **Hosting:** SimpleCloud (Ubuntu 24.04)
- **Notifications:** Telegram Bot

---

## 📚 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [.env.example](.env.example) - Environment variables reference
- [Backend README](./backend/README.md) - Backend documentation (if exists)
- [Frontend README](./frontend/README.md) - Frontend documentation (if exists)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
6. Wait for staging deployment and testing
7. Get code review approval
8. Merge to main

---

## 📄 License

This project is part of Yandex Practicum educational materials.

---

## 🆘 Support & Troubleshooting

Having issues? Check:

1. [DEPLOYMENT.md - Troubleshooting section](DEPLOYMENT.md#troubleshooting)
2. GitHub Actions logs
3. Server logs: `docker compose logs`
4. Create an issue in the repository

---

## 📊 Status Badges

![CI](https://github.com/yourusername/yourrepo/workflows/CI/badge.svg)
![Deploy Staging](https://github.com/yourusername/yourrepo/workflows/Deploy%20to%20Staging/badge.svg)
![Deploy Production](https://github.com/yourusername/yourrepo/workflows/Deploy%20to%20Production/badge.svg)

---

**Made with ❤️ for Yandex Practicum**
# CI/CD Test
