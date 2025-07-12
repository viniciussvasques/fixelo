// Re-exportar todos os tipos da API
export * from './api'

// Tipos específicos do frontend
export interface NavItem {
  title: string
  href: string
  icon?: string
  badge?: string
  children?: NavItem[]
}

export interface BreadcrumbItem {
  title: string
  href?: string
}

export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file' | 'date' | 'time'
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  validation?: {
    min?: number
    max?: number
    pattern?: string
    message?: string
  }
}

export interface TableColumn<T = any> {
  key: keyof T
  title: string
  sortable?: boolean
  width?: string
  render?: (value: any, record: T) => React.ReactNode
}

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ToastOptions {
  title?: string
  description?: string
  type?: 'default' | 'success' | 'error' | 'warning'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

export interface StepperStep {
  title: string
  description?: string
  isCompleted?: boolean
  isActive?: boolean
}

export interface FileUploadProps {
  accept?: string
  multiple?: boolean
  maxSize?: number
  onUpload: (files: File[]) => void
  onError?: (error: string) => void
}

// Tipos para formulários específicos
export interface LoginFormData {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterFormData {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phone?: string
  role: 'CLIENT' | 'PROVIDER'
  agreeToTerms: boolean
}

export interface ProfileFormData {
  firstName: string
  lastName: string
  phone?: string
  bio?: string
  location?: string
  avatar?: string
}

export interface ServiceFormData {
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

export interface BookingFormData {
  serviceId: string
  scheduledFor: string
  notes?: string
  location?: string
  isOnline?: boolean
}

export interface ReviewFormData {
  rating: number
  comment?: string
}

export interface PaymentFormData {
  paymentMethodId: string
  cardNumber?: string
  expiryMonth?: string
  expiryYear?: string
  cvc?: string
  cardholderName?: string
  saveCard?: boolean
}

// Tipos para estados de carregamento
export interface LoadingState {
  isLoading: boolean
  error: string | null
  data: any
}

export interface AsyncState<T = any> {
  data: T | null
  loading: boolean
  error: string | null
  success: boolean
}

// Tipos para filtros e paginação
export interface FilterState {
  search: string
  category: string
  priceRange: [number, number]
  rating: number
  location: string
  isOnline: boolean
  tags: string[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

export interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
}

// Tipos para WebSocket
export interface WebSocketMessage {
  type: string
  payload: any
  timestamp: string
}

export interface WebSocketState {
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  lastMessage: WebSocketMessage | null
}

// Tipos para notificações
export interface NotificationState {
  notifications: Notification[]
  unreadCount: number
}

// Tipos para tema
export interface ThemeConfig {
  mode: 'light' | 'dark'
  primaryColor: string
  secondaryColor: string
  borderRadius: string
  fontFamily: string
}

// Tipos para configurações do usuário
export interface UserSettings {
  theme: ThemeConfig
  language: 'PT' | 'EN' | 'ES'
  notifications: {
    email: boolean
    push: boolean
    sms: boolean
  }
  privacy: {
    profileVisibility: 'public' | 'private'
    showPhone: boolean
    showEmail: boolean
  }
}

// Tipos para analytics
export interface AnalyticsEvent {
  name: string
  properties: Record<string, any>
  timestamp: string
}

export interface AnalyticsData {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: number
  topPages: Array<{ page: string; views: number }>
  topSources: Array<{ source: string; visits: number }>
}

// Tipos para SEO
export interface SEOMetadata {
  title: string
  description: string
  keywords: string[]
  ogImage?: string
  ogType?: string
  canonical?: string
}

// Tipos para geolocalização
export interface Location {
  lat: number
  lng: number
  address: string
  city: string
  state: string
  country: string
  zipCode: string
}

// Tipos para cache
export interface CacheEntry<T = any> {
  data: T
  timestamp: number
  expiresAt: number
} 