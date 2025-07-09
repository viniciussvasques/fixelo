# 🚀 Deployment Guide

This guide covers deploying the Fixelo platform to production environments.

## 🎯 Deployment Overview

Fixelo is designed for cloud-native deployment with the following architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web App       │    │   Mobile Apps   │    │   Admin Panel   │
│   (Next.js)     │    │   (React Native)│    │   (AdminJS)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         └────────────────────────┼────────────────────────┘
                                  │
                    ┌─────────────────┐
                    │   API Server    │
                    │   (NestJS)      │
                    └─────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
      ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
      │ PostgreSQL  │ │    Redis    │ │   Supabase  │
      │ Database    │ │   Cache     │ │   Storage   │
      └─────────────┘ └─────────────┘ └─────────────┘
```

## 🏗️ Deployment Platforms

### 1. Railway (Recommended)

Railway provides the easiest deployment experience with built-in PostgreSQL and Redis.

#### Setup Railway Deployment

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**
   ```bash
   railway login
   ```

3. **Create New Project**
   ```bash
   railway new fixelo-production
   ```

4. **Deploy API Server**
   ```bash
   cd apps/api
   railway up
   ```

5. **Add Services**
   ```bash
   # Add PostgreSQL
   railway add postgresql
   
   # Add Redis
   railway add redis
   ```

6. **Configure Environment Variables**
   ```bash
   # Set production environment variables
   railway variables set NODE_ENV=production
   railway variables set DATABASE_URL=${{Postgres.DATABASE_URL}}
   railway variables set REDIS_URL=${{Redis.REDIS_URL}}
   ```

#### Railway Configuration Files

Create `railway.json` in the root:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run start:prod",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### 2. Fly.io

Fly.io offers global deployment with excellent performance.

#### Setup Fly.io Deployment

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly.io**
   ```bash
   fly auth login
   ```

3. **Initialize Fly App**
   ```bash
   fly launch --name fixelo-api
   ```

4. **Create Database**
   ```bash
   fly postgres create --name fixelo-db
   fly postgres attach --app fixelo-api fixelo-db
   ```

5. **Deploy**
   ```bash
   fly deploy
   ```

#### Fly.io Configuration (`fly.toml`)

```toml
app = "fixelo-api"
primary_region = "mia"

[build]
  builder = "heroku/buildpacks:20"

[env]
  NODE_ENV = "production"
  PORT = "8080"

[http_service]
  internal_port = 8080
  force_https = true
  auto_stop_machines = true
  auto_start_machines = true

[[services]]
  http_checks = []
  internal_port = 8080
  processes = ["app"]
  protocol = "tcp"
  script_checks = []

  [services.concurrency]
    hard_limit = 25
    soft_limit = 20
    type = "connections"

  [[services.ports]]
    force_https = true
    handlers = ["http"]
    port = 80

  [[services.ports]]
    handlers = ["tls", "http"]
    port = 443

  [[services.tcp_checks]]
    grace_period = "1s"
    interval = "15s"
    restart_limit = 0
    timeout = "2s"
```

### 3. Vercel (Frontend Only)

Deploy Next.js web app to Vercel.

#### Setup Vercel Deployment

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy Web App**
   ```bash
   cd apps/web
   vercel --prod
   ```

3. **Configure Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
   ```

#### Vercel Configuration (`vercel.json`)

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["mia1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": "@stripe_publishable_key"
  }
}
```

## 🔧 Environment Configuration

### Production Environment Variables

#### API Server (`apps/api/.env.production`)

```env
# Application
NODE_ENV=production
PORT=8080
API_URL=https://api.fixelo.com

# Database
DATABASE_URL=postgresql://user:password@host:5432/fixelo_prod

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-key
JWT_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Redis
REDIS_URL=redis://user:password@host:6379

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# File Upload
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=noreply@fixelo.com

# SMS
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1234567890

# Push Notifications
FIREBASE_PROJECT_ID=fixelo-prod
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----...
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-...@fixelo-prod.iam.gserviceaccount.com

# Monitoring
SENTRY_DSN=https://...@sentry.io/...
POSTHOG_API_KEY=phc_...
```

#### Web App (`apps/web/.env.production`)

```env
NEXT_PUBLIC_API_URL=https://api.fixelo.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-api-key
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_POSTHOG_API_KEY=phc_...
```

#### Mobile Apps (`apps/mobile/.env.production`)

```env
EXPO_PUBLIC_API_URL=https://api.fixelo.com
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-api-key
```

## 🗄️ Database Deployment

### PostgreSQL Setup

#### Using Railway PostgreSQL

```bash
# Connect to Railway PostgreSQL
railway connect postgresql

# Run migrations
npm run db:migrate:deploy

# Seed production data
npm run db:seed:prod
```

#### Using External PostgreSQL

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://user:password@host:5432/fixelo_prod"

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### Database Migration Strategy

1. **Backup Current Database**
   ```bash
   pg_dump $DATABASE_URL > backup.sql
   ```

2. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

3. **Verify Migration**
   ```bash
   npx prisma migrate status
   ```

4. **Rollback if Needed**
   ```bash
   # Restore from backup
   psql $DATABASE_URL < backup.sql
   ```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: fixelo_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/fixelo_test
          REDIS_URL: redis://localhost:6379
      
      - name: Run linting
        run: npm run lint
      
      - name: Type check
        run: npm run type-check

  deploy-api:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build API
        run: npm run build:api
      
      - name: Deploy to Railway
        uses: railway-deploy@v1
        with:
          railway-token: ${{ secrets.RAILWAY_TOKEN }}
          service: fixelo-api
      
      - name: Run database migrations
        run: |
          npm run db:migrate:deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

  deploy-web:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Web App
        run: npm run build:web
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.NEXT_PUBLIC_API_URL }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Deployment Secrets

Configure these secrets in your GitHub repository:

```
RAILWAY_TOKEN=your-railway-token
DATABASE_URL=your-production-database-url
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-vercel-org-id
VERCEL_PROJECT_ID=your-vercel-project-id
NEXT_PUBLIC_API_URL=https://api.fixelo.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 📱 Mobile App Deployment

### iOS App Store

1. **Build for iOS**
   ```bash
   cd apps/mobile
   expo build:ios
   ```

2. **Configure App Store Connect**
   - Create app in App Store Connect
   - Configure app information
   - Set up pricing and availability

3. **Upload to App Store**
   ```bash
   expo upload:ios
   ```

### Google Play Store

1. **Build for Android**
   ```bash
   cd apps/mobile
   expo build:android
   ```

2. **Configure Google Play Console**
   - Create app in Google Play Console
   - Configure app information
   - Set up pricing and distribution

3. **Upload to Play Store**
   ```bash
   expo upload:android
   ```

### Expo Application Services (EAS)

For more advanced builds:

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for both platforms
eas build --platform all

# Submit to app stores
eas submit --platform all
```

## 🔍 Monitoring & Observability

### Health Checks

Implement comprehensive health checks:

```typescript
// apps/api/src/health/health.controller.ts
@Get('health')
async getHealth() {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
    database: await this.checkDatabase(),
    redis: await this.checkRedis(),
    stripe: await this.checkStripe()
  };
}
```

### Error Tracking with Sentry

```typescript
// apps/api/src/main.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### Performance Monitoring

```typescript
// apps/web/src/lib/monitoring.ts
import { init } from '@sentry/nextjs';

init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
});
```

## 🔒 Security Considerations

### SSL/TLS Configuration

Ensure all services use HTTPS:

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name api.fixelo.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    location / {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Environment Security

1. **Use Environment Variables** for all secrets
2. **Rotate Keys Regularly** (JWT, API keys)
3. **Enable CORS** with specific origins
4. **Use Rate Limiting** to prevent abuse
5. **Implement Input Validation** on all endpoints

### Database Security

```typescript
// Prisma configuration for production
generator client {
  provider = "prisma-client-js"
  binaryTargets = ["native", "linux-musl"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

## 🚀 Performance Optimization

### API Optimization

1. **Enable Compression**
   ```typescript
   import compression from 'compression';
   app.use(compression());
   ```

2. **Implement Caching**
   ```typescript
   @UseInterceptors(CacheInterceptor)
   @CacheTTL(300)
   @Get('services')
   async getServices() {
     // Cached for 5 minutes
   }
   ```

3. **Database Query Optimization**
   ```typescript
   // Use select to limit fields
   const services = await this.prisma.service.findMany({
     select: {
       id: true,
       title: true,
       price: true,
       provider: {
         select: {
           id: true,
           name: true,
           avatar: true
         }
       }
     }
   });
   ```

### Frontend Optimization

1. **Next.js Image Optimization**
   ```typescript
   import Image from 'next/image';
   
   <Image
     src="/hero-image.jpg"
     alt="Hero"
     width={800}
     height={600}
     priority
   />
   ```

2. **Code Splitting**
   ```typescript
   import dynamic from 'next/dynamic';
   
   const DynamicComponent = dynamic(() => import('./Component'), {
     loading: () => <p>Loading...</p>,
   });
   ```

## 📊 Scaling Strategies

### Horizontal Scaling

1. **Load Balancing**
   ```yaml
   # docker-compose.production.yml
   version: '3.8'
   services:
     api:
       image: fixelo-api:latest
       scale: 3
       environment:
         - NODE_ENV=production
     
     nginx:
       image: nginx:alpine
       ports:
         - "80:80"
         - "443:443"
       depends_on:
         - api
   ```

2. **Database Read Replicas**
   ```typescript
   // Use read replicas for queries
   const services = await this.prisma.$queryRaw`
     SELECT * FROM services 
     WHERE active = true
   `;
   ```

### Vertical Scaling

1. **Increase Server Resources**
2. **Optimize Database Queries**
3. **Implement Connection Pooling**

## 🔄 Backup & Recovery

### Database Backup

```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="fixelo_backup_$DATE.sql"

pg_dump $DATABASE_URL > $BACKUP_FILE
gzip $BACKUP_FILE

# Upload to cloud storage
aws s3 cp $BACKUP_FILE.gz s3://fixelo-backups/
```

### Recovery Procedures

```bash
# Restore from backup
gunzip fixelo_backup_20240101_120000.sql.gz
psql $DATABASE_URL < fixelo_backup_20240101_120000.sql
```

## 📈 Monitoring Dashboard

### Key Metrics to Monitor

1. **API Response Times**
2. **Database Query Performance**
3. **Error Rates**
4. **User Activity**
5. **Payment Processing**
6. **Mobile App Crashes**

### Alerting

Set up alerts for:
- High error rates (>5%)
- Slow response times (>2s)
- Database connection failures
- Payment processing failures
- High memory/CPU usage

## 🎯 Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code review completed
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] SSL certificates valid
- [ ] Monitoring configured

### Deployment

- [ ] Backup current database
- [ ] Deploy API server
- [ ] Run database migrations
- [ ] Deploy web application
- [ ] Update mobile app builds
- [ ] Verify all services running

### Post-Deployment

- [ ] Health checks passing
- [ ] Monitoring alerts configured
- [ ] Performance metrics normal
- [ ] User acceptance testing
- [ ] Documentation updated

## 🆘 Troubleshooting

### Common Deployment Issues

1. **Database Connection Errors**
   ```bash
   # Check database connectivity
   psql $DATABASE_URL -c "SELECT 1"
   ```

2. **Memory Issues**
   ```bash
   # Monitor memory usage
   docker stats
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate validity
   openssl s_client -connect api.fixelo.com:443
   ```

### Rollback Procedures

```bash
# Rollback to previous version
railway rollback --service fixelo-api

# Rollback database migration
npx prisma migrate reset
```

## 📚 Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Fly.io Documentation](https://fly.io/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Expo Documentation](https://docs.expo.dev)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

Ready to deploy Fixelo to production! 🚀 