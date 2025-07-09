# 🌐 Web Application (Next.js)

This document covers the Next.js web application that serves as the main client interface for the Fixelo platform.

## 📋 Overview

The web application is built with Next.js 14, TypeScript, and TailwindCSS, providing a modern, responsive, and fast user experience. It serves both clients looking for services and providers offering their services.

**Status**: ✅ **Complete** - Fully implemented and ready for production

## 🏗️ Architecture

### Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── (auth)/             # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── forgot-password/
│   │   ├── dashboard/          # User dashboard
│   │   │   ├── page.tsx
│   │   │   ├── profile/
│   │   │   ├── bookings/
│   │   │   ├── services/       # For providers
│   │   │   └── payments/
│   │   ├── services/           # Service catalog
│   │   │   ├── page.tsx
│   │   │   ├── [id]/
│   │   │   └── search/
│   │   ├── providers/          # Provider profiles
│   │   │   └── [id]/
│   │   └── api/                # API routes
│   │       ├── auth/
│   │       └── webhooks/
│   ├── components/             # Reusable components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components
│   │   ├── forms/              # Form components
│   │   ├── providers/          # Context providers
│   │   └── sections/           # Page sections
│   ├── lib/                    # Utility libraries
│   │   ├── utils.ts            # General utilities
│   │   ├── api.ts              # API client
│   │   ├── auth.ts             # Authentication helpers
│   │   ├── stripe.ts           # Stripe integration
│   │   └── validations.ts      # Zod schemas
│   ├── hooks/                  # Custom React hooks
│   ├── store/                  # State management
│   ├── types/                  # TypeScript types
│   └── styles/                 # Additional styles
├── public/                     # Static assets
├── locales/                    # i18n translations
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies
```

### Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Authentication**: NextAuth.js
- **Payments**: Stripe Elements
- **Maps**: Google Maps API
- **i18n**: next-i18next
- **Icons**: Lucide React
- **Analytics**: PostHog
- **Monitoring**: Sentry

## 🚀 Features

### Core Features

1. **Landing Page**
   - Hero section with search
   - Featured services
   - How it works section
   - Testimonials
   - Call-to-action sections

2. **Authentication**
   - Email/password login
   - Social login (Google, Facebook)
   - Registration for clients and providers
   - Password reset
   - Email verification

3. **Service Discovery**
   - Service catalog with categories
   - Advanced search and filtering
   - Geolocation-based results
   - Service details pages
   - Provider profiles

4. **Booking System**
   - Service booking flow
   - Calendar integration
   - Real-time availability
   - Booking confirmation
   - Booking management

5. **User Dashboard**
   - Profile management
   - Booking history
   - Payment history
   - Settings and preferences

6. **Provider Dashboard**
   - Service management
   - Booking management
   - Analytics and insights
   - Earnings tracking
   - ADS management

7. **Payment Integration**
   - Stripe payment processing
   - Multiple payment methods
   - Subscription management
   - Invoice generation

8. **Real-time Features**
   - Live chat
   - Notifications
   - Booking updates
   - Provider status

## 🎨 UI/UX Design

### Design System

```typescript
// Theme configuration
const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    },
    secondary: {
      50: '#f0fdf4',
      500: '#22c55e',
      900: '#14532d'
    },
    accent: {
      50: '#fef3c7',
      500: '#f59e0b',
      900: '#78350f'
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['Fira Code', 'monospace']
    }
  }
};
```

### Responsive Design

```css
/* Mobile-first approach */
.container {
  @apply px-4 mx-auto;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    @apply px-6;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    @apply px-8 max-w-7xl;
  }
}
```

### Component Library

```typescript
// Button component example
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  onClick
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50'
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        { 'opacity-50 cursor-not-allowed': disabled || loading }
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && <Spinner className="mr-2" />}
      {children}
    </button>
  );
};
```

## 🔐 Authentication

### NextAuth.js Configuration

```typescript
// lib/auth.ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        });

        const user = await response.json();
        
        if (response.ok && user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            accessToken: user.accessToken
          };
        }
        
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.role = token.role;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/auth/error'
  }
};
```

### Protected Routes

```typescript
// components/auth/ProtectedRoute.tsx
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: 'CLIENT' | 'PROVIDER' | 'ADMIN';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole
}) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (requireAuth && !session) {
      router.push('/login');
      return;
    }

    if (requiredRole && session?.user?.role !== requiredRole) {
      router.push('/unauthorized');
      return;
    }
  }, [session, status, requireAuth, requiredRole, router]);

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (requireAuth && !session) {
    return null;
  }

  return <>{children}</>;
};
```

## 💳 Payment Integration

### Stripe Elements

```typescript
// components/payments/PaymentForm.tsx
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  bookingId: string;
  amount: number;
  onSuccess: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  bookingId,
  amount,
  onSuccess
}) => {
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    // Create payment intent
    fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, amount })
    })
    .then(res => res.json())
    .then(data => setClientSecret(data.clientSecret));
  }, [bookingId, amount]);

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#3b82f6'
      }
    }
  };

  return (
    <Elements options={options} stripe={stripePromise}>
      <CheckoutForm onSuccess={onSuccess} />
    </Elements>
  );
};
```

### Payment Processing

```typescript
// components/payments/CheckoutForm.tsx
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface CheckoutFormProps {
  onSuccess: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`
      }
    });

    if (error) {
      console.error('Payment failed:', error);
    } else {
      onSuccess();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isLoading}
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};
```

## 🗺️ Maps Integration

### Google Maps Implementation

```typescript
// components/maps/ServiceMap.tsx
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface ServiceMapProps {
  services: Service[];
  center: { lat: number; lng: number };
  onServiceClick: (service: Service) => void;
}

export const ServiceMap: React.FC<ServiceMapProps> = ({
  services,
  center,
  onServiceClick
}) => {
  const mapStyles = {
    width: '100%',
    height: '400px'
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        center={center}
        zoom={12}
      >
        {services.map(service => (
          <Marker
            key={service.id}
            position={{
              lat: service.location.lat,
              lng: service.location.lng
            }}
            onClick={() => onServiceClick(service)}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};
```

## 🔍 Search & Filtering

### Search Implementation

```typescript
// components/search/ServiceSearch.tsx
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchFilters {
  query: string;
  category: string;
  location: string;
  priceRange: [number, number];
  rating: number;
}

export const ServiceSearch: React.FC = () => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    priceRange: [0, 1000],
    rating: 0
  });
  const [results, setResults] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(filters.query, 300);

  useEffect(() => {
    if (debouncedQuery || filters.category || filters.location) {
      searchServices();
    }
  }, [debouncedQuery, filters]);

  const searchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/services/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filters)
      });
      const data = await response.json();
      setResults(data.services);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search services..."
          value={filters.query}
          onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
          className="px-4 py-2 border rounded-lg"
        />
        
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Categories</option>
          <option value="cleaning">Cleaning</option>
          <option value="plumbing">Plumbing</option>
          <option value="electrical">Electrical</option>
        </select>
        
        <input
          type="text"
          placeholder="Location"
          value={filters.location}
          onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          className="px-4 py-2 border rounded-lg"
        />
        
        <button
          onClick={searchServices}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {loading && <div>Loading...</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map(service => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
};
```

## 📱 Responsive Design

### Mobile-First Approach

```typescript
// components/layout/MobileNav.tsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-600"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg">
          <nav className="flex flex-col space-y-2 p-4">
            <a href="/services" className="py-2 text-gray-700">Services</a>
            <a href="/providers" className="py-2 text-gray-700">Providers</a>
            <a href="/dashboard" className="py-2 text-gray-700">Dashboard</a>
          </nav>
        </div>
      )}
    </div>
  );
};
```

## 🌍 Internationalization

### i18n Configuration

```typescript
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt', 'es'],
    localeDetection: true
  },
  react: {
    useSuspense: false
  }
};
```

### Translation Usage

```typescript
// components/common/WelcomeMessage.tsx
import { useTranslation } from 'next-i18next';

export const WelcomeMessage: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.description')}</p>
    </div>
  );
};
```

### Translation Files

```json
// locales/en/common.json
{
  "welcome": {
    "title": "Welcome to Fixelo",
    "description": "Find trusted professionals for all your service needs"
  },
  "navigation": {
    "services": "Services",
    "providers": "Providers",
    "dashboard": "Dashboard"
  }
}

// locales/pt/common.json
{
  "welcome": {
    "title": "Bem-vindo ao Fixelo",
    "description": "Encontre profissionais confiáveis para todas as suas necessidades"
  },
  "navigation": {
    "services": "Serviços",
    "providers": "Profissionais",
    "dashboard": "Painel"
  }
}
```

## 🔄 State Management

### Zustand Store

```typescript
// store/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  user: User | null;
  services: Service[];
  bookings: Booking[];
  loading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setServices: (services: Service[]) => void;
  addBooking: (booking: Booking) => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      services: [],
      bookings: [],
      loading: false,
      
      setUser: (user) => set({ user }),
      setServices: (services) => set({ services }),
      addBooking: (booking) => set((state) => ({
        bookings: [...state.bookings, booking]
      })),
      setLoading: (loading) => set({ loading })
    }),
    {
      name: 'fixelo-storage',
      partialize: (state) => ({
        user: state.user,
        bookings: state.bookings
      })
    }
  )
);
```

## 🧪 Testing

### Component Testing

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Page Testing

```typescript
// __tests__/pages/services.test.tsx
import { render, screen } from '@testing-library/react';
import ServicesPage from '@/app/services/page';

jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' })
}));

describe('Services Page', () => {
  it('renders services page', () => {
    render(<ServicesPage />);
    expect(screen.getByText('Find Services')).toBeInTheDocument();
  });
});
```

## 🚀 Performance Optimization

### Code Splitting

```typescript
// Dynamic imports for better performance
import dynamic from 'next/dynamic';

const ServiceMap = dynamic(() => import('@/components/maps/ServiceMap'), {
  loading: () => <div>Loading map...</div>,
  ssr: false
});

const ChatWidget = dynamic(() => import('@/components/chat/ChatWidget'), {
  loading: () => <div>Loading chat...</div>
});
```

### Image Optimization

```typescript
// components/common/OptimizedImage.tsx
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className="object-cover rounded-lg"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  );
};
```

## 📊 Analytics & Monitoring

### PostHog Integration

```typescript
// lib/analytics.ts
import posthog from 'posthog-js';

export const initAnalytics = () => {
  if (typeof window !== 'undefined') {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST
    });
  }
};

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  posthog.capture(event, properties);
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  posthog.identify(userId, traits);
};
```

### Error Monitoring

```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
});
```

## 🔧 Development

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-maps-api-key
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Development Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

## 🚀 Deployment

### Vercel Deployment

```json
// vercel.json
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

### Build Optimization

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['prisma']
  },
  images: {
    domains: ['your-supabase-url.supabase.co'],
    formats: ['image/webp', 'image/avif']
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`
      }
    ];
  }
};

module.exports = nextConfig;
```

## 🎯 Key Features Implementation

### 1. Service Booking Flow

```typescript
// components/booking/BookingFlow.tsx
export const BookingFlow: React.FC<{ serviceId: string }> = ({ serviceId }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({});

  const steps = [
    { id: 1, title: 'Service Details', component: ServiceDetails },
    { id: 2, title: 'Date & Time', component: DateTimeSelection },
    { id: 3, title: 'Address', component: AddressForm },
    { id: 4, title: 'Payment', component: PaymentForm },
    { id: 5, title: 'Confirmation', component: BookingConfirmation }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <StepIndicator currentStep={step} totalSteps={steps.length} />
      </div>
      
      {steps.map(stepConfig => (
        <div key={stepConfig.id} className={step === stepConfig.id ? 'block' : 'hidden'}>
          <stepConfig.component
            data={bookingData}
            onNext={(data) => {
              setBookingData(prev => ({ ...prev, ...data }));
              setStep(prev => prev + 1);
            }}
            onBack={() => setStep(prev => prev - 1)}
          />
        </div>
      ))}
    </div>
  );
};
```

### 2. Real-time Chat

```typescript
// components/chat/ChatWidget.tsx
import { useSocket } from '@/hooks/useSocket';

export const ChatWidget: React.FC<{ bookingId: string }> = ({ bookingId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      socket.emit('join-conversation', { bookingId });
      
      socket.on('message-received', (message) => {
        setMessages(prev => [...prev, message]);
      });
    }
  }, [socket, bookingId]);

  const sendMessage = () => {
    if (socket && newMessage.trim()) {
      socket.emit('send-message', {
        bookingId,
        message: newMessage
      });
      setNewMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl">
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Chat</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map(message => (
            <div key={message.id} className="flex">
              <div className="bg-gray-100 rounded-lg p-2 max-w-xs">
                {message.content}
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="Type a message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 📋 API Integration

### API Client

```typescript
// lib/api.ts
import { getSession } from 'next-auth/react';

class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL!;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const session = await getSession();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(session?.accessToken && {
          Authorization: `Bearer ${session.accessToken}`
        }),
        ...options.headers
      },
      ...options
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Services
  async getServices(params?: SearchParams) {
    const query = new URLSearchParams(params as any).toString();
    return this.request<{ services: Service[] }>(`/services?${query}`);
  }

  async getService(id: string) {
    return this.request<Service>(`/services/${id}`);
  }

  // Bookings
  async createBooking(data: CreateBookingDto) {
    return this.request<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getBookings() {
    return this.request<{ bookings: Booking[] }>('/bookings');
  }

  // Payments
  async createPaymentIntent(data: { bookingId: string; amount: number }) {
    return this.request<{ clientSecret: string }>('/payments/intent', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

export const apiClient = new ApiClient();
```

## 🔍 SEO Optimization

### Metadata Configuration

```typescript
// app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Fixelo - Find Trusted Service Professionals',
    template: '%s | Fixelo'
  },
  description: 'Find and book trusted professionals for all your service needs in Florida. From cleaning to repairs, Fixelo connects you with verified providers.',
  keywords: ['services', 'professionals', 'Florida', 'booking', 'home services'],
  authors: [{ name: 'Fixelo Team' }],
  creator: 'Fixelo',
  publisher: 'Fixelo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL('https://fixelo.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en',
      'pt-BR': '/pt',
      'es-ES': '/es'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://fixelo.com',
    title: 'Fixelo - Find Trusted Service Professionals',
    description: 'Find and book trusted professionals for all your service needs in Florida.',
    siteName: 'Fixelo'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fixelo - Find Trusted Service Professionals',
    description: 'Find and book trusted professionals for all your service needs in Florida.',
    creator: '@fixelo'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
};
```

## 🎨 Accessibility

### WCAG Compliance

```typescript
// components/ui/AccessibleButton.tsx
import { forwardRef } from 'react';

interface AccessibleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({ children, onClick, disabled, ariaLabel, ariaDescribedBy, type = 'button' }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        {children}
      </button>
    );
  }
);
```

---

The web application provides a comprehensive, modern, and user-friendly interface for the Fixelo platform, supporting all core features including service discovery, booking, payments, and real-time communication. The application is fully responsive, accessible, and optimized for performance and SEO.

For more details on specific features, refer to the corresponding module documentation in the `/docs/modules/` directory. 