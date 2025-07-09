// Base types for Fixelo marketplace system

export enum UserRole {
  CLIENT = 'CLIENT',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
}

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DRAFT = 'DRAFT',
  SUSPENDED = 'SUSPENDED',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED',
}

export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO',
}

export enum ServiceCategory {
  CLEANING = 'CLEANING',
  REPAIRS = 'REPAIRS',
  BEAUTY = 'BEAUTY',
  GARDENING = 'GARDENING',
  PLUMBING = 'PLUMBING',
  ELECTRICAL = 'ELECTRICAL',
  PAINTING = 'PAINTING',
  MOVING = 'MOVING',
  TUTORING = 'TUTORING',
  PHOTOGRAPHY = 'PHOTOGRAPHY',
  EVENT_PLANNING = 'EVENT_PLANNING',
  PET_CARE = 'PET_CARE',
  OTHER = 'OTHER',
}

export enum Language {
  EN = 'en',
  PT = 'pt',
  ES = 'es',
}

export enum NotificationType {
  BOOKING_REQUEST = 'BOOKING_REQUEST',
  BOOKING_CONFIRMED = 'BOOKING_CONFIRMED',
  BOOKING_CANCELLED = 'BOOKING_CANCELLED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  REVIEW_RECEIVED = 'REVIEW_RECEIVED',
  PLAN_UPGRADED = 'PLAN_UPGRADED',
  VERIFICATION_APPROVED = 'VERIFICATION_APPROVED',
  VERIFICATION_REJECTED = 'VERIFICATION_REJECTED',
}

export enum MessageType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  SYSTEM = 'SYSTEM',
}

// Location types for Florida targeting
export interface Location {
  id: string;
  address: string;
  city: string;
  state: string; // Always 'FL' for Florida
  zipCode: string;
  latitude: number;
  longitude: number;
  country: string; // Always 'USA'
}

// Base user interface
export interface BaseUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  language: Language;
  location?: Location;
  createdAt: Date;
  updatedAt: Date;
}

// Provider-specific fields
export interface Provider extends BaseUser {
  role: UserRole.PROVIDER;
  businessName?: string;
  bio?: string;
  verified: boolean;
  planType: PlanType;
  planExpiresAt?: Date;
  leadsUsed: number;
  leadsLimit: number;
  rating: number;
  reviewCount: number;
  completedBookings: number;
}

// Client-specific fields  
export interface Client extends BaseUser {
  role: UserRole.CLIENT;
  preferredLanguage: Language;
}

// Service interface
export interface Service {
  id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  currency: string; // Always 'USD'
  duration: number; // in minutes
  images: string[];
  providerId: string;
  provider?: Provider;
  status: ServiceStatus;
  isActive: boolean;
  tags: string[];
  location?: Location;
  createdAt: Date;
  updatedAt: Date;
}

// Booking interface
export interface Booking {
  id: string;
  serviceId: string;
  service?: Service;
  clientId: string;
  client?: Client;
  providerId: string;
  provider?: Provider;
  status: BookingStatus;
  scheduledAt: Date;
  duration: number;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  location?: Location;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review interface
export interface Review {
  id: string;
  bookingId: string;
  booking?: Booking;
  clientId: string;
  client?: Client;
  providerId: string;
  provider?: Provider;
  rating: number; // 1-5
  comment?: string;
  response?: string; // Provider response
  createdAt: Date;
  updatedAt: Date;
}

// Chat message interface
export interface Message {
  id: string;
  bookingId: string;
  booking?: Booking;
  senderId: string;
  sender?: BaseUser;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  readAt?: Date;
  createdAt: Date;
}

// Plan interface
export interface Plan {
  id: string;
  type: PlanType;
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'MONTHLY' | 'YEARLY';
  features: string[];
  leadsLimit?: number;
  trialDays?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Subscription interface
export interface Subscription {
  id: string;
  userId: string;
  user?: Provider;
  planId: string;
  plan?: Plan;
  stripeSubscriptionId: string;
  status: 'ACTIVE' | 'CANCELLED' | 'PAST_DUE' | 'TRIALING';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Notification interface
export interface Notification {
  id: string;
  userId: string;
  user?: BaseUser;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  readAt?: Date;
  createdAt: Date;
}

// Search and filter types
export interface ServiceSearchFilters {
  query?: string;
  category?: ServiceCategory;
  minPrice?: number;
  maxPrice?: number;
  location?: {
    latitude: number;
    longitude: number;
    radius: number; // in miles
  };
  city?: string;
  sortBy?: 'price' | 'rating' | 'distance' | 'created_at';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
} 