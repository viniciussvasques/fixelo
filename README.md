# 🏠 Fixelo - Modern Services Marketplace

> **Professional services marketplace focused on Florida, USA. Connect with verified service providers for cleaning, repairs, beauty, and more.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.17.0-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue.svg)
![NestJS](https://img.shields.io/badge/NestJS-10.3.3-red.svg)
![Next.js](https://img.shields.io/badge/Next.js-14.2.30-black.svg)

## 🌟 Features

- 🔐 **Complete Authentication System** - JWT + Refresh tokens with role-based access
- 👥 **Multi-role Support** - Clients, Service Providers, and Admins
- 🛍️ **Service Marketplace** - Browse, book, and pay for services
- 💬 **Real-time Chat** - Direct communication between clients and providers
- 💳 **Stripe Integration** - Secure payments and subscription management
- ⭐ **Review System** - Rate and review service providers
- 📱 **Mobile Apps** - React Native apps for clients and providers
- 🌐 **Multi-language** - English, Portuguese, and Spanish support
- 📍 **Location-based** - Find services in Florida cities
- 📊 **Analytics Dashboard** - Performance metrics and insights

## 🏗️ Architecture

### **Monorepo Structure**
```
fixelo/
├── apps/
│   ├── api/           # NestJS API server
│   ├── web/           # Next.js web application
│   ├── mobile-client/ # React Native client app
│   └── mobile-provider/ # React Native provider app
├── libs/
│   ├── common/        # Shared types and utilities
│   ├── prisma/        # Database schema and client
│   └── utils/         # Utility functions
└── infra/             # Infrastructure and deployment
```

### **Tech Stack**

#### **Backend**
- **Framework:** NestJS with TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT + Refresh tokens
- **Real-time:** Socket.IO
- **Payments:** Stripe
- **File Storage:** Supabase Storage
- **Documentation:** Swagger/OpenAPI

#### **Frontend**
- **Web:** Next.js 14 with TailwindCSS
- **Mobile:** React Native with Expo
- **UI Components:** shadcn/ui
- **State Management:** React Query + Zustand

#### **Infrastructure**
- **Monorepo:** Turbo + npm workspaces
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Hosting:** Railway/Fly.io
- **Monitoring:** Sentry + PostHog

## 🚀 Quick Start

### **Prerequisites**
- Node.js >= 18.17.0
- npm >= 9.0.0
- PostgreSQL database
- Redis (optional, for caching)

### **Installation**

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

### **API Endpoints**

The API will be available at `http://localhost:3001/api/v1`

#### **Authentication**
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - User logout

#### **Health Check**
- `GET /health` - API health status

📖 **Full API documentation:** http://localhost:3001/api/docs

## 🌍 Target Market

**Primary Location:** Florida, USA
- Miami, Orlando, Tampa, Jacksonville
- Fort Lauderdale, St. Petersburg, Tallahassee
- And more Florida cities

**Service Categories:**
- 🧹 Cleaning Services
- 🔧 Home Repairs
- 💄 Beauty & Wellness
- 🌱 Gardening & Landscaping
- 🔌 Electrical Services
- 🚰 Plumbing Services
- 🎨 Painting Services
- 📦 Moving & Storage
- 📚 Tutoring & Education
- 📸 Photography & Video
- 🎉 Event Planning
- 🐕 Pet Care

## 💰 Business Model

### **For Service Providers**

#### **Free Plan**
- Up to 10 leads/month
- Basic profile
- Customer reviews
- Extra leads: $3 each

#### **Pro Plan - $34.80/month**
- Unlimited leads and messages
- Verified badge
- Top search visibility
- Analytics dashboard
- Boost/ads access
- Priority support
- 7-day free trial

### **Revenue Streams**
- Monthly subscriptions (Pro plan)
- Lead purchases (Free plan users)
- Service boost/ads
- Transaction fees (5% platform fee)

## 🛠️ Development

### **Available Scripts**

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
```

### **Project Status**

#### ✅ **Completed**
- [x] Monorepo setup with Turbo
- [x] Authentication system (JWT + Refresh tokens)
- [x] Database schema with Prisma
- [x] API foundation with NestJS
- [x] Health check endpoint
- [x] Role-based access control
- [x] Web app foundation with Next.js

#### 🔄 **In Progress**
- [ ] User management system
- [ ] Service CRUD operations
- [ ] Booking system

#### 📋 **Planned**
- [ ] Stripe payment integration
- [ ] Real-time chat system
- [ ] Review and rating system
- [ ] Mobile applications
- [ ] Push notifications
- [ ] Analytics dashboard

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Guidelines**
1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Repository:** https://github.com/viniciussvasques/fixelo
- **API Documentation:** http://localhost:3001/api/docs (when running locally)
- **Issues:** https://github.com/viniciussvasques/fixelo/issues

## 📞 Support

For support, email support@fixelo.com or create an issue on GitHub.

---

**Made with ❤️ for the Florida community** 