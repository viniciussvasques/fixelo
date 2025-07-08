# Fixelo - Service Marketplace Platform

<div align="center">
  <img src="https://via.placeholder.com/200x200?text=Fixelo" alt="Fixelo Logo" width="100" height="100">
  
  <p>
    <strong>Modern Service Marketplace for Florida, USA</strong>
  </p>
  
  <p>
    <a href="README.pt.md">🇧🇷 Português</a> |
    <a href="README.es.md">🇪🇸 Español</a> |
    <a href="#english">🇺🇸 English</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js" alt="Next.js">
    <img src="https://img.shields.io/badge/NestJS-9-red?style=flat&logo=nestjs" alt="NestJS">
    <img src="https://img.shields.io/badge/React_Native-Expo-blue?style=flat&logo=expo" alt="React Native">
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/PostgreSQL-15-blue?style=flat&logo=postgresql" alt="PostgreSQL">
  </p>
</div>

---

## 🎯 About Fixelo

Fixelo is a modern, mobile-first service marketplace designed specifically for Florida, USA. It connects clients with verified professionals for services like cleaning, repairs, beauty treatments, and personal care.

### ✨ Key Features

- 🔍 **Smart Search**: Location-based service discovery
- ✅ **Verified Professionals**: Background-checked service providers
- 💬 **Real-time Chat**: Direct communication between clients and providers
- 💳 **Secure Payments**: Integrated Stripe payment processing
- ⭐ **Review System**: Transparent rating and review system
- 📱 **Mobile Apps**: Native iOS and Android applications
- 🌐 **Multilingual**: Support for English, Portuguese, and Spanish
- 📊 **Analytics**: Comprehensive business insights

## 🏗️ Architecture

This project uses a **monorepo structure** with TurboRepo for optimal development experience:

```
fixelo/
├── apps/
│   ├── web/              # Next.js 14 web application
│   ├── api/              # NestJS API backend
│   ├── mobile-client/    # React Native client app
│   └── mobile-provider/  # React Native provider app
├── libs/
│   ├── common/           # Shared types and constants
│   ├── prisma/           # Database schema and utilities
│   └── utils/            # Shared utility functions
└── infra/                # Infrastructure and deployment
```

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis
- **Authentication**: JWT with refresh tokens
- **Payments**: Stripe integration
- **File Storage**: Supabase Storage
- **Real-time**: Socket.IO

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: React Query
- **Forms**: React Hook Form with Zod validation

### Mobile
- **Framework**: React Native with Expo
- **Navigation**: React Navigation v6
- **UI**: React Native Paper + NativeWind
- **Maps**: React Native Maps

### DevOps
- **Containerization**: Docker & Docker Compose
- **Monorepo**: TurboRepo
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry + Analytics

## 🛠️ Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### 1. Clone & Install

```bash
git clone https://github.com/your-username/fixelo.git
cd fixelo
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Development Environment

```bash
# Start databases
docker-compose up postgres redis -d

# Run database migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start all applications
npm run dev
```

### 4. Access Applications

- 🌐 **Web App**: http://localhost:3000
- 🔧 **API**: http://localhost:3001
- 📊 **API Docs**: http://localhost:3001/api/docs
- 🗄️ **Database Admin**: http://localhost:5050

## 📱 Mobile Development

### Client App
```bash
cd apps/mobile-client
npm run start
```

### Provider App
```bash
cd apps/mobile-provider
npm run start
```

## 🗄️ Database

### Migrations
```bash
npm run db:migrate      # Run migrations
npm run db:reset        # Reset database
npm run db:seed         # Seed with sample data
```

### Schema
- **Users**: Clients and service providers
- **Services**: Service categories and offerings
- **Bookings**: Service reservations and scheduling
- **Reviews**: Rating and feedback system
- **Messages**: Real-time chat system
- **Plans**: Subscription and pricing tiers

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up

# Start only databases
docker-compose up postgres redis -d

# Start with admin tools
docker-compose --profile tools up

# Build and start
docker-compose up --build

# Stop all services
docker-compose down
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov

# Run e2e tests
npm run test:e2e
```

## 📖 Documentation

- [API Documentation](http://localhost:3001/api/docs)
- [Architecture Guide](docs/architecture.md)
- [Development Guide](docs/development.md)
- [Deployment Guide](docs/deployment.md)

## 🚀 Deployment

### Production Build
```bash
npm run build
npm run start:prod
```

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up
```

## 🌍 Internationalization

Fixelo supports three languages:
- 🇺🇸 **English** (Primary)
- 🇧🇷 **Portuguese**
- 🇪🇸 **Spanish**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 **Email**: support@fixelo.com
- 📱 **Discord**: [Join our community](https://discord.gg/fixelo)
- 📚 **Docs**: [Documentation site](https://docs.fixelo.com)

---

<div align="center">
  <p>Made with ❤️ by the Fixelo Team</p>
</div> 