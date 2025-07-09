# 🚀 Getting Started with Fixelo

This guide will help you set up and run the Fixelo platform locally for development.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.17.0 or higher)
- **npm** or **yarn** package manager
- **Docker** and **Docker Compose**
- **PostgreSQL** (if not using Docker)
- **Redis** (if not using Docker)
- **Git**

## 🏗️ Project Structure

```
fixelo/
├── apps/
│   ├── api/                    # NestJS API server
│   ├── web/                    # Next.js web application
│   ├── mobile/                 # React Native mobile apps
│   └── admin/                  # AdminJS admin panel
├── libs/
│   ├── prisma/                 # Database schema and client
│   ├── utils/                  # Shared utilities
│   └── types/                  # TypeScript type definitions
├── docs/                       # Documentation
├── docker-compose.yml          # Docker services
├── package.json               # Root package.json
└── turbo.json                 # TurboRepo configuration
```

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/fixelo.git
cd fixelo
```

### 2. Install Dependencies

```bash
# Install all dependencies for all apps and packages
npm install

# Or using yarn
yarn install
```

### 3. Environment Setup

Copy the environment template files:

```bash
# API environment
cp apps/api/.env.example apps/api/.env

# Web environment
cp apps/web/.env.example apps/web/.env.local

# Mobile environment
cp apps/mobile/.env.example apps/mobile/.env
```

### 4. Configure Environment Variables

Edit the `.env` files with your configuration:

#### `apps/api/.env`
```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/fixelo"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Redis
REDIS_URL="redis://localhost:6379"

# File Upload
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"

# Notifications
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_PRIVATE_KEY="your-private-key"
FIREBASE_CLIENT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"

# Email
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@fixelo.com"

# SMS
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"
```

#### `apps/web/.env.local`
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-maps-api-key"
```

#### `apps/mobile/.env`
```env
EXPO_PUBLIC_API_URL="http://localhost:3001"
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 5. Start Services with Docker

```bash
# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Or start all services
docker-compose up -d
```

### 6. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# Seed the database with initial data
npm run db:seed
```

## 🚀 Running the Application

### Development Mode

Start all applications in development mode:

```bash
# Start all apps (API, Web, Mobile)
npm run dev

# Or start individual apps
npm run dev:api      # Start API server (port 3001)
npm run dev:web      # Start web app (port 3000)
npm run dev:mobile   # Start mobile development server
```

### Production Mode

```bash
# Build all applications
npm run build

# Start in production mode
npm run start
```

## 📱 Mobile Development

### Prerequisites for Mobile

- **Expo CLI**: `npm install -g @expo/cli`
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)

### Running Mobile Apps

```bash
# Navigate to mobile directory
cd apps/mobile

# Start Expo development server
npm run start

# Run on specific platforms
npm run android    # Android emulator/device
npm run ios        # iOS simulator/device
npm run web        # Web browser
```

### Building Mobile Apps

```bash
# Build for production
expo build:android  # Android APK/AAB
expo build:ios      # iOS IPA
```

## 🔑 API Documentation

Once the API is running, you can access:

- **Swagger Documentation**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/health
- **API Base URL**: http://localhost:3001/api

### Key API Endpoints

```
POST /api/auth/register          # User registration
POST /api/auth/login            # User login
GET  /api/services              # Get services
POST /api/bookings              # Create booking
GET  /api/chat/conversations    # Get conversations
POST /api/payments/intent       # Create payment intent
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm run test

# Run tests for specific app
npm run test:api     # API tests
npm run test:web     # Web app tests

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

### Test Coverage

```bash
# Generate test coverage report
npm run test:coverage
```

## 📊 Database Management

### Prisma Studio

Access the database GUI:

```bash
npm run db:studio
```

This opens Prisma Studio at http://localhost:5555

### Database Commands

```bash
# Reset database (⚠️ Destructive)
npm run db:reset

# Deploy migrations to production
npm run db:deploy

# Generate migration from schema changes
npm run db:migrate:dev

# View migration status
npm run db:migrate:status
```

## 🔧 Development Tools

### Code Quality

```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type checking
npm run type-check
```

### Build Tools

```bash
# Build all apps
npm run build

# Clean build artifacts
npm run clean

# Check build size
npm run analyze
```

## 🌍 Internationalization

The platform supports three languages:

- **English (en)** - Default
- **Portuguese (pt)** - Brazilian Portuguese
- **Spanish (es)** - Latin American Spanish

### Adding Translations

1. Add new keys to translation files:
   ```
   apps/web/locales/en/common.json
   apps/web/locales/pt/common.json
   apps/web/locales/es/common.json
   ```

2. Use translations in components:
   ```typescript
   import { useTranslation } from 'next-i18next';
   
   const { t } = useTranslation('common');
   return <h1>{t('welcome')}</h1>;
   ```

## 🚀 Deployment

### Environment Setup

1. **Production Environment Variables**
2. **Database Migration**
3. **Build Applications**
4. **Deploy to Hosting Platform**

### Deployment Platforms

- **Railway** (Recommended)
- **Fly.io**
- **Vercel** (Frontend only)
- **Heroku**

### CI/CD with GitHub Actions

The project includes automated CI/CD pipelines:

```yaml
# .github/workflows/ci.yml
- Build and test on every push
- Deploy to staging on main branch
- Deploy to production on release tags
```

## 🔍 Monitoring & Analytics

### Health Monitoring

- **API Health**: http://localhost:3001/health
- **Database Status**: Included in health check
- **Redis Status**: Included in health check

### Analytics

- **PostHog**: User behavior analytics
- **Sentry**: Error tracking and performance monitoring
- **Custom Metrics**: Business metrics dashboard

## 🆘 Troubleshooting

### Common Issues

#### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Restart database
docker-compose restart postgres

# Check connection
npm run db:status
```

#### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001

# Kill process
kill -9 <PID>
```

#### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf apps/web/.next
```

#### Prisma Client Issues
```bash
# Regenerate Prisma client
npm run db:generate

# Reset and reseed database
npm run db:reset
```

### Getting Help

1. **Check Documentation**: Browse the `/docs` folder
2. **GitHub Issues**: Report bugs and feature requests
3. **Discord/Slack**: Join our development community
4. **Email**: Contact the development team

## 📚 Next Steps

Now that you have Fixelo running locally, you can:

1. **Explore the API**: Use the Swagger documentation
2. **Customize the UI**: Modify components and styles
3. **Add Features**: Implement new functionality
4. **Run Tests**: Ensure everything works correctly
5. **Deploy**: Set up production environment

### Recommended Reading

- [API Documentation](../modules/README.md)
- [Frontend Development Guide](./frontend-development.md)
- [Mobile Development Guide](./mobile-development.md)
- [Deployment Guide](./deployment.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

## 🎯 Development Workflow

### Feature Development

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/new-feature
   ```

2. **Make Changes**
   - Write code
   - Add tests
   - Update documentation

3. **Test Changes**
   ```bash
   npm run test
   npm run lint
   npm run type-check
   ```

4. **Commit and Push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

5. **Create Pull Request**
   - Use the PR template
   - Request code review
   - Ensure CI passes

### Code Standards

- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Consistent code formatting
- **Conventional Commits**: Standardized commit messages

Happy coding! 🎉 