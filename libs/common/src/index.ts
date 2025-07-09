// Main exports for @fixelo/common library

// Types and interfaces
export * from './types';

// Constants and configurations
export * from './constants';

// Validation utilities
export * from './validators';

// Re-export commonly used types for convenience
export type {
  BaseUser,
  Provider,
  Client,
  Service,
  Booking,
  Review,
  Message,
  Plan,
  Subscription,
  Notification,
  Location,
  ServiceSearchFilters,
  PaginatedResponse,
  ApiResponse,
  ApiError,
} from './types';

export type { ValidationResult } from './validators';

export {
  UserRole,
  UserStatus,
  ServiceStatus,
  BookingStatus,
  PaymentStatus,
  PlanType,
  ServiceCategory,
  Language,
  NotificationType,
  MessageType,
} from './types'; 