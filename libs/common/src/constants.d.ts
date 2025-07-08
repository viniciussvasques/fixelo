export declare const FLORIDA_CITIES: readonly ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "St. Petersburg", "Tallahassee", "Sarasota", "Cape Coral", "West Palm Beach", "Hialeah", "Port St. Lucie", "Pembroke Pines", "Hollywood", "Miramar", "Coral Springs", "Clearwater", "Brandon", "West Palm Beach", "Pompano Beach"];
export declare const SERVICE_CATEGORIES: {
    readonly CLEANING: {
        readonly en: "Cleaning Services";
        readonly pt: "Serviços de Limpeza";
        readonly es: "Servicios de Limpieza";
    };
    readonly REPAIRS: {
        readonly en: "Home Repairs";
        readonly pt: "Reparos Domésticos";
        readonly es: "Reparaciones del Hogar";
    };
    readonly BEAUTY: {
        readonly en: "Beauty & Wellness";
        readonly pt: "Beleza e Bem-estar";
        readonly es: "Belleza y Bienestar";
    };
    readonly GARDENING: {
        readonly en: "Gardening & Landscaping";
        readonly pt: "Jardinagem e Paisagismo";
        readonly es: "Jardinería y Paisajismo";
    };
    readonly PLUMBING: {
        readonly en: "Plumbing Services";
        readonly pt: "Serviços de Encanamento";
        readonly es: "Servicios de Plomería";
    };
    readonly ELECTRICAL: {
        readonly en: "Electrical Services";
        readonly pt: "Serviços Elétricos";
        readonly es: "Servicios Eléctricos";
    };
    readonly PAINTING: {
        readonly en: "Painting Services";
        readonly pt: "Serviços de Pintura";
        readonly es: "Servicios de Pintura";
    };
    readonly MOVING: {
        readonly en: "Moving & Storage";
        readonly pt: "Mudança e Armazenamento";
        readonly es: "Mudanza y Almacenamiento";
    };
    readonly TUTORING: {
        readonly en: "Tutoring & Education";
        readonly pt: "Tutoria e Educação";
        readonly es: "Tutoría y Educación";
    };
    readonly PHOTOGRAPHY: {
        readonly en: "Photography & Video";
        readonly pt: "Fotografia e Vídeo";
        readonly es: "Fotografía y Video";
    };
    readonly EVENT_PLANNING: {
        readonly en: "Event Planning";
        readonly pt: "Planejamento de Eventos";
        readonly es: "Planificación de Eventos";
    };
    readonly PET_CARE: {
        readonly en: "Pet Care";
        readonly pt: "Cuidados com Animais";
        readonly es: "Cuidado de Mascotas";
    };
    readonly OTHER: {
        readonly en: "Other Services";
        readonly pt: "Outros Serviços";
        readonly es: "Otros Servicios";
    };
};
export declare const PLANS: {
    readonly FREE: {
        readonly type: "FREE";
        readonly name: {
            readonly en: "Free Plan";
            readonly pt: "Plano Gratuito";
            readonly es: "Plan Gratuito";
        };
        readonly price: 0;
        readonly leadsLimit: 10;
        readonly features: {
            readonly en: readonly ["Up to 10 leads/month", "Basic profile", "Can receive reviews", "Can purchase extra leads ($3 each)"];
            readonly pt: readonly ["Até 10 leads/mês", "Perfil básico", "Pode receber avaliações", "Pode comprar leads extras ($3 cada)"];
            readonly es: readonly ["Hasta 10 contactos al mes", "Perfil básico", "Puede recibir reseñas", "Puede comprar leads extra ($3 cada uno)"];
        };
    };
    readonly PRO: {
        readonly type: "PRO";
        readonly name: {
            readonly en: "Pro Plan";
            readonly pt: "Plano Pro";
            readonly es: "Plan Pro";
        };
        readonly price: 34.8;
        readonly billing: "monthly";
        readonly trialDays: 7;
        readonly features: {
            readonly en: readonly ["Unlimited leads and messages", "Verified badge", "Top search visibility", "Analytics dashboard", "Boost access (ADS)", "Priority support"];
            readonly pt: readonly ["Leads ilimitados", "Selo verificado", "Maior visibilidade nas buscas", "Dashboard de analytics", "Impulsionamento (ADS)", "Suporte prioritário"];
            readonly es: readonly ["Contactos ilimitados", "Insignia verificada", "Máxima visibilidad", "Panel de analytics", "Impulsos (ADS)", "Soporte prioritario"];
        };
    };
};
export declare const PRICING: {
    readonly CURRENCY: "USD";
    readonly EXTRA_LEAD_PRICE: 3;
    readonly PLATFORM_FEE_PERCENTAGE: 5;
    readonly STRIPE_FEE_PERCENTAGE: 2.9;
    readonly STRIPE_FIXED_FEE: 0.3;
    readonly MIN_SERVICE_PRICE: 10;
    readonly MAX_SERVICE_PRICE: 10000;
    readonly DEFAULT_SEARCH_RADIUS: 25;
    readonly MAX_SEARCH_RADIUS: 100;
};
export declare const LIMITS: {
    readonly MAX_IMAGES_PER_SERVICE: 10;
    readonly MAX_FILE_SIZE_MB: 10;
    readonly MAX_MESSAGE_LENGTH: 1000;
    readonly MAX_REVIEW_LENGTH: 500;
    readonly MAX_SERVICE_TITLE_LENGTH: 100;
    readonly MAX_SERVICE_DESCRIPTION_LENGTH: 2000;
    readonly MAX_BIO_LENGTH: 500;
    readonly PAGINATION_DEFAULT_LIMIT: 20;
    readonly PAGINATION_MAX_LIMIT: 100;
    readonly SEARCH_MIN_QUERY_LENGTH: 2;
    readonly PASSWORD_MIN_LENGTH: 8;
};
export declare const TIME: {
    readonly BOOKING_MINIMUM_ADVANCE_HOURS: 2;
    readonly BOOKING_MAXIMUM_ADVANCE_DAYS: 90;
    readonly MESSAGE_READ_TIMEOUT_MS: 30000;
    readonly SESSION_TIMEOUT_HOURS: 24;
    readonly REFRESH_TOKEN_EXPIRY_DAYS: 30;
    readonly ACCESS_TOKEN_EXPIRY_MINUTES: 15;
    readonly VERIFICATION_CODE_EXPIRY_MINUTES: 10;
};
export declare const NOTIFICATIONS: {
    readonly DEFAULT_ENABLED: true;
    readonly EMAIL_ENABLED: true;
    readonly PUSH_ENABLED: true;
    readonly SMS_ENABLED: false;
};
export declare const UPLOAD: {
    readonly ALLOWED_IMAGE_TYPES: readonly ["image/jpeg", "image/png", "image/webp"];
    readonly ALLOWED_FILE_TYPES: readonly ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    readonly AVATAR_MAX_SIZE_MB: 5;
    readonly SERVICE_IMAGE_MAX_SIZE_MB: 10;
    readonly FILE_MAX_SIZE_MB: 25;
};
export declare const EXTERNAL_SERVICES: {
    readonly GOOGLE_MAPS: {
        readonly DEFAULT_ZOOM: 12;
        readonly MARKER_CLUSTER_MAX_ZOOM: 15;
    };
    readonly STRIPE: {
        readonly CONNECT_REFRESH_URL: "/dashboard/settings/payments";
        readonly CONNECT_RETURN_URL: "/dashboard/settings/payments/success";
    };
    readonly FIREBASE: {};
};
export declare const ERROR_CODES: {
    readonly INVALID_CREDENTIALS: "INVALID_CREDENTIALS";
    readonly TOKEN_EXPIRED: "TOKEN_EXPIRED";
    readonly UNAUTHORIZED: "UNAUTHORIZED";
    readonly ACCOUNT_SUSPENDED: "ACCOUNT_SUSPENDED";
    readonly VALIDATION_ERROR: "VALIDATION_ERROR";
    readonly INVALID_INPUT: "INVALID_INPUT";
    readonly REQUIRED_FIELD: "REQUIRED_FIELD";
    readonly INSUFFICIENT_LEADS: "INSUFFICIENT_LEADS";
    readonly BOOKING_CONFLICT: "BOOKING_CONFLICT";
    readonly SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE";
    readonly PAYMENT_FAILED: "PAYMENT_FAILED";
    readonly NOT_FOUND: "NOT_FOUND";
    readonly ALREADY_EXISTS: "ALREADY_EXISTS";
    readonly PERMISSION_DENIED: "PERMISSION_DENIED";
    readonly INTERNAL_ERROR: "INTERNAL_ERROR";
    readonly SERVICE_UNAVAILABLE_ERROR: "SERVICE_UNAVAILABLE_ERROR";
    readonly RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED";
};
export declare const SUCCESS_MESSAGES: {
    readonly ACCOUNT_CREATED: {
        readonly en: "Account created successfully";
        readonly pt: "Conta criada com sucesso";
        readonly es: "Cuenta creada exitosamente";
    };
    readonly LOGIN_SUCCESS: {
        readonly en: "Login successful";
        readonly pt: "Login realizado com sucesso";
        readonly es: "Inicio de sesión exitoso";
    };
    readonly BOOKING_CREATED: {
        readonly en: "Booking created successfully";
        readonly pt: "Reserva criada com sucesso";
        readonly es: "Reserva creada exitosamente";
    };
    readonly PAYMENT_SUCCESS: {
        readonly en: "Payment processed successfully";
        readonly pt: "Pagamento processado com sucesso";
        readonly es: "Pago procesado exitosamente";
    };
    readonly PROFILE_UPDATED: {
        readonly en: "Profile updated successfully";
        readonly pt: "Perfil atualizado com sucesso";
        readonly es: "Perfil actualizado exitosamente";
    };
};
export declare const REGEX: {
    readonly EMAIL: RegExp;
    readonly PHONE: RegExp;
    readonly ZIP_CODE: RegExp;
    readonly PASSWORD: RegExp;
    readonly SLUG: RegExp;
};
export declare const API_ROUTES: {
    readonly AUTH: "/auth";
    readonly USERS: "/users";
    readonly SERVICES: "/services";
    readonly BOOKINGS: "/bookings";
    readonly REVIEWS: "/reviews";
    readonly MESSAGES: "/messages";
    readonly PAYMENTS: "/payments";
    readonly PLANS: "/plans";
    readonly NOTIFICATIONS: "/notifications";
    readonly ADMIN: "/admin";
};
