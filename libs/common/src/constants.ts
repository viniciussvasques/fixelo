// Global constants for Fixelo marketplace

// Florida cities (main target locations)
export const FLORIDA_CITIES = [
  'Miami',
  'Orlando',
  'Tampa',
  'Jacksonville',
  'Fort Lauderdale',
  'St. Petersburg',
  'Tallahassee',
  'Sarasota',
  'Cape Coral',
  'West Palm Beach',
  'Hialeah',
  'Port St. Lucie',
  'Pembroke Pines',
  'Hollywood',
  'Miramar',
  'Coral Springs',
  'Clearwater',
  'Brandon',
  'West Palm Beach',
  'Pompano Beach',
] as const;

// Service categories with display names (multilingual)
export const SERVICE_CATEGORIES = {
  CLEANING: {
    en: 'Cleaning Services',
    pt: 'Serviços de Limpeza',
    es: 'Servicios de Limpieza',
  },
  REPAIRS: {
    en: 'Home Repairs',
    pt: 'Reparos Domésticos',
    es: 'Reparaciones del Hogar',
  },
  BEAUTY: {
    en: 'Beauty & Wellness',
    pt: 'Beleza e Bem-estar',
    es: 'Belleza y Bienestar',
  },
  GARDENING: {
    en: 'Gardening & Landscaping',
    pt: 'Jardinagem e Paisagismo',
    es: 'Jardinería y Paisajismo',
  },
  PLUMBING: {
    en: 'Plumbing Services',
    pt: 'Serviços de Encanamento',
    es: 'Servicios de Plomería',
  },
  ELECTRICAL: {
    en: 'Electrical Services',
    pt: 'Serviços Elétricos',
    es: 'Servicios Eléctricos',
  },
  PAINTING: {
    en: 'Painting Services',
    pt: 'Serviços de Pintura',
    es: 'Servicios de Pintura',
  },
  MOVING: {
    en: 'Moving & Storage',
    pt: 'Mudança e Armazenamento',
    es: 'Mudanza y Almacenamiento',
  },
  TUTORING: {
    en: 'Tutoring & Education',
    pt: 'Tutoria e Educação',
    es: 'Tutoría y Educación',
  },
  PHOTOGRAPHY: {
    en: 'Photography & Video',
    pt: 'Fotografia e Vídeo',
    es: 'Fotografía y Video',
  },
  EVENT_PLANNING: {
    en: 'Event Planning',
    pt: 'Planejamento de Eventos',
    es: 'Planificación de Eventos',
  },
  PET_CARE: {
    en: 'Pet Care',
    pt: 'Cuidados com Animais',
    es: 'Cuidado de Mascotas',
  },
  OTHER: {
    en: 'Other Services',
    pt: 'Outros Serviços',
    es: 'Otros Servicios',
  },
} as const;

// Plan configurations
export const PLANS = {
  FREE: {
    type: 'FREE',
    name: {
      en: 'Free Plan',
      pt: 'Plano Gratuito',
      es: 'Plan Gratuito',
    },
    price: 0,
    leadsLimit: 10,
    features: {
      en: [
        'Up to 10 leads/month',
        'Basic profile',
        'Can receive reviews',
        'Can purchase extra leads ($3 each)',
      ],
      pt: [
        'Até 10 leads/mês',
        'Perfil básico',
        'Pode receber avaliações',
        'Pode comprar leads extras ($3 cada)',
      ],
      es: [
        'Hasta 10 contactos al mes',
        'Perfil básico',
        'Puede recibir reseñas',
        'Puede comprar leads extra ($3 cada uno)',
      ],
    },
  },
  PRO: {
    type: 'PRO',
    name: {
      en: 'Pro Plan',
      pt: 'Plano Pro',
      es: 'Plan Pro',
    },
    price: 34.8,
    billing: 'monthly',
    trialDays: 7,
    features: {
      en: [
        'Unlimited leads and messages',
        'Verified badge',
        'Top search visibility',
        'Analytics dashboard',
        'Boost access (ADS)',
        'Priority support',
      ],
      pt: [
        'Leads ilimitados',
        'Selo verificado',
        'Maior visibilidade nas buscas',
        'Dashboard de analytics',
        'Impulsionamento (ADS)',
        'Suporte prioritário',
      ],
      es: [
        'Contactos ilimitados',
        'Insignia verificada',
        'Máxima visibilidad',
        'Panel de analytics',
        'Impulsos (ADS)',
        'Soporte prioritario',
      ],
    },
  },
} as const;

// Payment and pricing
export const PRICING = {
  CURRENCY: 'USD',
  EXTRA_LEAD_PRICE: 3.0,
  PLATFORM_FEE_PERCENTAGE: 5, // 5% platform fee
  STRIPE_FEE_PERCENTAGE: 2.9, // Stripe fee
  STRIPE_FIXED_FEE: 0.3, // Stripe fixed fee in USD
  MIN_SERVICE_PRICE: 10,
  MAX_SERVICE_PRICE: 10000,
  DEFAULT_SEARCH_RADIUS: 25, // miles
  MAX_SEARCH_RADIUS: 100, // miles
} as const;

// System limits and defaults
export const LIMITS = {
  MAX_IMAGES_PER_SERVICE: 10,
  MAX_FILE_SIZE_MB: 10,
  MAX_MESSAGE_LENGTH: 1000,
  MAX_REVIEW_LENGTH: 500,
  MAX_SERVICE_TITLE_LENGTH: 100,
  MAX_SERVICE_DESCRIPTION_LENGTH: 2000,
  MAX_BIO_LENGTH: 500,
  PAGINATION_DEFAULT_LIMIT: 20,
  PAGINATION_MAX_LIMIT: 100,
  SEARCH_MIN_QUERY_LENGTH: 2,
  PASSWORD_MIN_LENGTH: 8,
} as const;

// Time and date constants
export const TIME = {
  BOOKING_MINIMUM_ADVANCE_HOURS: 2,
  BOOKING_MAXIMUM_ADVANCE_DAYS: 90,
  MESSAGE_READ_TIMEOUT_MS: 30000,
  SESSION_TIMEOUT_HOURS: 24,
  REFRESH_TOKEN_EXPIRY_DAYS: 30,
  ACCESS_TOKEN_EXPIRY_MINUTES: 15,
  VERIFICATION_CODE_EXPIRY_MINUTES: 10,
} as const;

// Notification settings
export const NOTIFICATIONS = {
  DEFAULT_ENABLED: true,
  EMAIL_ENABLED: true,
  PUSH_ENABLED: true,
  SMS_ENABLED: false, // Premium feature
} as const;

// File upload settings
export const UPLOAD = {
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_FILE_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  AVATAR_MAX_SIZE_MB: 5,
  SERVICE_IMAGE_MAX_SIZE_MB: 10,
  FILE_MAX_SIZE_MB: 25,
} as const;

// External service configurations
export const EXTERNAL_SERVICES = {
  GOOGLE_MAPS: {
    DEFAULT_ZOOM: 12,
    MARKER_CLUSTER_MAX_ZOOM: 15,
  },
  STRIPE: {
    CONNECT_REFRESH_URL: '/dashboard/settings/payments',
    CONNECT_RETURN_URL: '/dashboard/settings/payments/success',
  },
  FIREBASE: {
    // Configuration will be handled at runtime in each app
  },
} as const;

// Error codes
export const ERROR_CODES = {
  // Authentication
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  ACCOUNT_SUSPENDED: 'ACCOUNT_SUSPENDED',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  
  // Business logic
  INSUFFICIENT_LEADS: 'INSUFFICIENT_LEADS',
  BOOKING_CONFLICT: 'BOOKING_CONFLICT',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  
  // Resources
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
  
  // System
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE_ERROR: 'SERVICE_UNAVAILABLE_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
} as const;

// Success messages (multilingual)
export const SUCCESS_MESSAGES = {
  ACCOUNT_CREATED: {
    en: 'Account created successfully',
    pt: 'Conta criada com sucesso',
    es: 'Cuenta creada exitosamente',
  },
  LOGIN_SUCCESS: {
    en: 'Login successful',
    pt: 'Login realizado com sucesso',
    es: 'Inicio de sesión exitoso',
  },
  BOOKING_CREATED: {
    en: 'Booking created successfully',
    pt: 'Reserva criada com sucesso',
    es: 'Reserva creada exitosamente',
  },
  PAYMENT_SUCCESS: {
    en: 'Payment processed successfully',
    pt: 'Pagamento processado com sucesso',
    es: 'Pago procesado exitosamente',
  },
  PROFILE_UPDATED: {
    en: 'Profile updated successfully',
    pt: 'Perfil atualizado com sucesso',
    es: 'Perfil actualizado exitosamente',
  },
} as const;

// Regular expressions for validation
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s\-\(\)]{10,}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;

// API endpoints base paths
export const API_ROUTES = {
  AUTH: '/auth',
  USERS: '/users',
  SERVICES: '/services',
  BOOKINGS: '/bookings',
  REVIEWS: '/reviews',
  MESSAGES: '/messages',
  PAYMENTS: '/payments',
  PLANS: '/plans',
  NOTIFICATIONS: '/notifications',
  ADMIN: '/admin',
} as const; 