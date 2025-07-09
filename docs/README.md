# 🏠 Fixelo - Professional Services Marketplace

> **Modern, scalable services marketplace platform focused on Florida, USA. Connect clients with verified service providers for cleaning, repairs, beauty, and more.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.17.0-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue.svg)
![NestJS](https://img.shields.io/badge/NestJS-10.3.3-red.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.30-black.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.74.5-blue.svg)

## 🌟 Overview

Fixelo is a comprehensive services marketplace platform that connects clients with verified service providers across Florida. Built with modern technologies and scalable architecture, it offers a complete solution for service booking, payment processing, real-time communication, and business management.

### Key Features

- 🔐 **Complete Authentication System** - JWT + Refresh tokens with role-based access
- 👥 **Multi-role Support** - Clients, Service Providers, and Admins
- 🛍️ **Service Marketplace** - Browse, book, and pay for 120+ service categories
- 💬 **Real-time Chat** - Direct communication between clients and providers
- 💳 **Advanced Payment System** - Stripe integration with multiple payment methods
- ⭐ **Review System** - Rate and review service providers
- 📱 **Mobile Applications** - Native iOS and Android apps
- 🌐 **Multi-language Support** - English, Portuguese, and Spanish
- 📍 **Location-based Services** - Geolocation search and filtering
- 📊 **Analytics Dashboard** - Performance metrics and business insights
- 🚀 **ADS System** - Service promotion and boost campaigns
- 💼 **Business Plans** - FREE and PRO subscription tiers

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Framework:** NestJS with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT + Refresh tokens
- **Real-time:** Socket.IO
- **Payments:** Stripe (Cards, Apple Pay, Google Pay, In-app purchases)
- **File Storage:** Supabase Storage
- **Cache:** Redis
- **Documentation:** Swagger/OpenAPI

#### Frontend
- **Web:** Next.js 14 with TailwindCSS
- **Mobile:** React Native with Expo
- **UI Components:** shadcn/ui + React Native Paper
- **State Management:** React Query + Zustand

#### Infrastructure
- **Monorepo:** Turbo + npm workspaces
- **Containerization:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Hosting:** Railway/Fly.io
- **Monitoring:** Sentry + PostHog

### Project Structure

```
fixelo/
├── apps/                           # Applications
│   ├── api/                       # NestJS API server
│   ├── web/                       # Next.js web application
│   ├── mobile-client/             # React Native client app
│   └── mobile-provider/           # React Native provider app
├── libs/                          # Shared libraries
│   ├── common/                    # Shared types and utilities
│   ├── prisma/                    # Database schema and client
│   └── utils/                     # Utility functions
├── docs/                          # Documentation
├── infra/                         # Infrastructure configs
└── scripts/                       # Development scripts
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.17.0
- npm >= 9.0.0
- PostgreSQL database
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/viniciussvasques/fixelo.git
cd fixelo
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your database and API keys
```

4. **Set up the database**
```bash
npm run db:generate
npm run db:push
```

5. **Start development servers**
```bash
# Start all services
npm run dev

# Or start individually
npm run dev --workspace=@fixelo/api    # API server
npm run dev --workspace=@fixelo/web    # Web app
```

### Docker Setup

```bash
# Start all services with Docker
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

## 📋 Modules Documentation

### ✅ Implemented Modules

| Module | Status | Documentation | Description |
|--------|--------|---------------|-------------|
| [Authentication](./modules/auth.md) | ✅ Complete | 📖 Available | JWT auth with refresh tokens |
| [User Management](./modules/users.md) | ✅ Complete | 📖 Available | User profiles and management |
| [Services](./modules/services.md) | ✅ Complete | 📖 Available | Service CRUD and search |
| [Bookings](./modules/bookings.md) | ✅ Complete | 📖 Available | Booking management system |
| [Payments](./modules/payments.md) | ✅ Complete | 📖 Available | Stripe integration |
| [ADS System](./modules/ads.md) | ✅ Complete | 📖 Available | Service promotion campaigns |

### 🔄 In Progress

| Module | Status | Documentation | Description |
|--------|--------|---------------|-------------|
| [Chat System](./modules/chat.md) | 🔄 In Progress | 📖 Available | Real-time messaging |
| [Reviews](./modules/reviews.md) | 🔄 In Progress | 📖 Available | Rating and review system |

### 📋 Planned

| Module | Status | Documentation | Description |
|--------|--------|---------------|-------------|
| [Admin Panel](./modules/admin.md) | 📋 Planned | 📖 Available | Administrative interface |
| [Notifications](./modules/notifications.md) | 📋 Planned | 📖 Available | Push notifications |
| [Analytics](./modules/analytics.md) | 📋 Planned | 📖 Available | Business analytics |

## 🌍 Target Market

**Primary Location:** Florida, USA

**Major Cities:**
- Miami, Orlando, Tampa, Jacksonville
- Fort Lauderdale, St. Petersburg, Tallahassee
- Sarasota, Cape Coral, West Palm Beach

**Service Categories (120+):**
- 🏠 Home & Maintenance (cleaning, repairs, landscaping)
- 🚚 Moving & Delivery
- 🔧 Automotive Services
- 💄 Beauty & Wellness
- 🎉 Events & Entertainment
- 👨‍🏫 Personal Services
- 🐕 Pet Services
- 👶 Childcare & Senior Care
- 🏥 Health & Medical
- 🎓 Education & Training
- And many more...

## 💰 Business Model

### Service Provider Plans

#### FREE Plan
- Up to 10 leads/month
- Basic profile
- Customer reviews
- Extra leads: $3 each

#### PRO Plan - $34.80/month
- Unlimited leads and messages
- Verified badge
- Top search visibility
- Analytics dashboard
- ADS/boost access
- Priority support
- 7-day free trial

### Revenue Streams
- Monthly subscriptions (PRO plan)
- Lead purchases (FREE plan users)
- Service boost/ADS campaigns
- Transaction fees (5% platform fee)

## 📊 Current Development Status

### Completed (75%)
- ✅ Authentication & Authorization
- ✅ User Management System
- ✅ Service Marketplace
- ✅ Booking System
- ✅ Payment Processing (Stripe)
- ✅ ADS & Promotion System
- ✅ Database Schema & Migrations
- ✅ API Documentation
- ✅ Docker Configuration

### In Progress (15%)
- 🔄 Chat System (Socket.IO)
- 🔄 Review System
- 🔄 Frontend Applications

### Planned (10%)
- 📋 Admin Panel
- 📋 Push Notifications
- 📋 Analytics Dashboard
- 📋 Automated Testing
- 📋 CI/CD Pipeline

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev                 # Start all services
npm run build              # Build all apps
npm run test               # Run tests
npm run lint               # Lint code
npm run type-check         # Type checking

# Database
npm run db:generate        # Generate Prisma client
npm run db:push           # Push schema to database
npm run db:migrate        # Run migrations
npm run db:studio         # Open Prisma Studio

# Docker
npm run docker:up         # Start services with Docker
npm run docker:down       # Stop Docker services
npm run docker:logs       # View logs
```

### API Documentation

The API documentation is available at:
- **Development:** http://localhost:3001/api/docs
- **Swagger UI:** Interactive API documentation
- **Postman Collection:** Available in `/docs/api/`

### Database Schema

The complete database schema includes:
- **Users:** Multi-role user management
- **Services:** Service catalog with categories
- **Bookings:** Appointment scheduling
- **Payments:** Transaction processing
- **Reviews:** Rating system
- **Messages:** Chat system
- **ADS:** Promotion campaigns
- **Plans:** Subscription management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@fixelo.com
- 📱 Discord: [Fixelo Community](https://discord.gg/fixelo)
- 📖 Documentation: [docs.fixelo.com](https://docs.fixelo.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/fixelo/issues)

## 🚀 Deployment

### Production Deployment

```bash
# Build for production
npm run build

# Deploy to Railway
railway up

# Deploy to Fly.io
fly deploy
```

### Environment Variables

See [Environment Configuration](./deployment/environment.md) for detailed setup instructions.

---

**Made with ❤️ by the Fixelo Team** 