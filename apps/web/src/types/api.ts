// Tipos base para API
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: string[]
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Enums principais
export enum UserRole {
  CLIENT = 'CLIENT',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED'
}

export enum ServiceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
  DELETED = 'DELETED'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export enum Language {
  PT = 'PT',
  EN = 'EN',
  ES = 'ES'
}

// Tipos de entidades principais

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  status: UserStatus
  preferredLanguage: Language
  avatar?: string
  bio?: string
  location?: string
  createdAt: string
  updatedAt: string
  
  // Campos específicos do provider
  verified?: boolean
  rating?: number
  reviewCount?: number
  completedBookings?: number
  
  // Relacionamentos
  services?: Service[]
  bookings?: Booking[]
  reviews?: Review[]
}

export interface Service {
  id: string
  title: string
  description: string
  shortDescription?: string
  price: number
  duration: number // em minutos
  categoryId: string
  providerId: string
  status: ServiceStatus
  images: string[]
  tags: string[]
  rating?: number
  reviewCount?: number
  location?: string
  isOnline?: boolean
  requirements?: string[]
  createdAt: string
  updatedAt: string
  
  // Relacionamentos
  category?: Category
  provider?: User
  bookings?: Booking[]
  reviews?: Review[]
}

export interface Category {
  id: string
  name: string
  description?: string
  icon?: string
  parentId?: string
  isActive: boolean
  order: number
  createdAt: string
  updatedAt: string
  
  // Relacionamentos
  parent?: Category
  children?: Category[]
  services?: Service[]
}

export interface Booking {
  id: string
  serviceId: string
  clientId: string
  providerId: string
  status: BookingStatus
  scheduledFor: string
  duration: number
  totalAmount: number
  notes?: string
  providerNotes?: string
  location?: string
  isOnline?: boolean
  createdAt: string
  updatedAt: string
  
  // Relacionamentos
  service?: Service
  client?: User
  provider?: User
  payment?: Payment
  review?: Review
}

export interface Review {
  id: string
  serviceId: string
  clientId: string
  bookingId: string
  rating: number
  comment?: string
  response?: string // resposta do provider
  isVerified: boolean
  createdAt: string
  updatedAt: string
  
  // Relacionamentos
  service?: Service
  client?: User
  booking?: Booking
}

export interface Payment {
  id: string
  bookingId: string
  amount: number
  currency: string
  status: PaymentStatus
  stripePaymentIntentId?: string
  stripeClientSecret?: string
  paymentMethodId?: string
  metadata?: Record<string, any>
  createdAt: string
  updatedAt: string
  
  // Relacionamentos
  booking?: Booking
}

export interface PaymentMethod {
  id: string
  userId: string
  stripePaymentMethodId: string
  type: 'card' | 'bank_account' | 'other'
  last4?: string
  brand?: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  isActive: boolean
  stripeProductId?: string
  stripePriceId?: string
  createdAt: string
  updatedAt: string
}

export interface Subscription {
  id: string
  userId: string
  planId: string
  stripeSubscriptionId: string
  status: 'active' | 'inactive' | 'cancelled' | 'past_due'
  currentPeriodStart: string
  currentPeriodEnd: string
  createdAt: string
  updatedAt: string
  
  // Relacionamentos
  user?: User
  plan?: Plan
}

// Tipos para requests/forms

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  preferredLanguage?: Language
}

export interface UpdateProfileRequest {
  firstName?: string
  lastName?: string
  phone?: string
  bio?: string
  location?: string
  avatar?: string
}

export interface CreateServiceRequest {
  title: string
  description: string
  shortDescription?: string
  price: number
  duration: number
  categoryId: string
  images?: string[]
  tags?: string[]
  location?: string
  isOnline?: boolean
  requirements?: string[]
}

export interface UpdateServiceRequest extends Partial<CreateServiceRequest> {
  status?: ServiceStatus
}

export interface CreateBookingRequest {
  serviceId: string
  scheduledFor: string
  notes?: string
  location?: string
  isOnline?: boolean
}

export interface UpdateBookingRequest {
  status?: BookingStatus
  scheduledFor?: string
  notes?: string
  providerNotes?: string
  location?: string
}

export interface CreateReviewRequest {
  serviceId: string
  bookingId: string
  rating: number
  comment?: string
}

export interface ProcessPaymentRequest {
  bookingId: string
  paymentMethodId: string
  amount: number
  currency?: string
}

export interface SearchFilters {
  query?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  rating?: number
  isOnline?: boolean
  tags?: string[]
  sortBy?: 'price' | 'rating' | 'distance' | 'newest'
  sortOrder?: 'asc' | 'desc'
}

// Tipos utilitários
export type CreateEntityRequest<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateEntityRequest<T> = Partial<CreateEntityRequest<T>>

// Tipos para WebSocket/Chat
export interface ChatMessage {
  id: string
  bookingId: string
  senderId: string
  receiverId: string
  message: string
  type: 'text' | 'image' | 'file' | 'system'
  isRead: boolean
  createdAt: string
  
  // Relacionamentos
  sender?: User
  receiver?: User
  booking?: Booking
}

export interface ChatRoom {
  id: string
  bookingId: string
  clientId: string
  providerId: string
  isActive: boolean
  lastMessageAt?: string
  createdAt: string
  
  // Relacionamentos
  booking?: Booking
  client?: User
  provider?: User
  messages?: ChatMessage[]
}

// Tipos para notificações
export interface Notification {
  id: string
  userId: string
  type: 'booking' | 'payment' | 'review' | 'system'
  title: string
  message: string
  data?: Record<string, any>
  isRead: boolean
  createdAt: string
  
  // Relacionamentos
  user?: User
} 