// Validation utilities for Fixelo marketplace

import { REGEX, LIMITS } from './constants';
import { ServiceCategory, UserRole, Language } from './types';

// Basic validation functions
export const isValidEmail = (email: string): boolean => {
  return REGEX.EMAIL.test(email.trim());
};

export const isValidPhone = (phone: string): boolean => {
  return REGEX.PHONE.test(phone.trim());
};

export const isValidZipCode = (zipCode: string): boolean => {
  return REGEX.ZIP_CODE.test(zipCode.trim());
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= LIMITS.PASSWORD_MIN_LENGTH && REGEX.PASSWORD.test(password);
};

export const isValidSlug = (slug: string): boolean => {
  return REGEX.SLUG.test(slug);
};

// Content validation
export const isValidServiceTitle = (title: string): boolean => {
  const trimmed = title.trim();
  return trimmed.length > 0 && trimmed.length <= LIMITS.MAX_SERVICE_TITLE_LENGTH;
};

export const isValidServiceDescription = (description: string): boolean => {
  const trimmed = description.trim();
  return trimmed.length > 0 && trimmed.length <= LIMITS.MAX_SERVICE_DESCRIPTION_LENGTH;
};

export const isValidReviewComment = (comment: string): boolean => {
  return comment.trim().length <= LIMITS.MAX_REVIEW_LENGTH;
};

export const isValidMessageContent = (content: string): boolean => {
  const trimmed = content.trim();
  return trimmed.length > 0 && trimmed.length <= LIMITS.MAX_MESSAGE_LENGTH;
};

export const isValidBio = (bio: string): boolean => {
  return bio.trim().length <= LIMITS.MAX_BIO_LENGTH;
};

// Enum validation
export const isValidUserRole = (role: string): role is UserRole => {
  return Object.values(UserRole).includes(role as UserRole);
};

export const isValidServiceCategory = (category: string): category is ServiceCategory => {
  return Object.values(ServiceCategory).includes(category as ServiceCategory);
};

export const isValidLanguage = (language: string): language is Language => {
  return Object.values(Language).includes(language as Language);
};

// Pricing validation
export const isValidServicePrice = (price: number): boolean => {
  return price >= 10 && price <= 10000 && price % 0.01 === 0; // Valid currency amount
};

export const isValidRating = (rating: number): boolean => {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
};

// Date validation
export const isValidFutureDate = (date: Date): boolean => {
  return date > new Date();
};

export const isValidBookingDate = (date: Date): boolean => {
  const now = new Date();
  const minAdvanceMs = 2 * 60 * 60 * 1000; // 2 hours
  const maxAdvanceMs = 90 * 24 * 60 * 60 * 1000; // 90 days
  
  const timeDiff = date.getTime() - now.getTime();
  return timeDiff >= minAdvanceMs && timeDiff <= maxAdvanceMs;
};

// Location validation for Florida
export const isValidFloridaZipCode = (zipCode: string): boolean => {
  if (!isValidZipCode(zipCode)) return false;
  
  // Florida ZIP codes typically start with 3, with some exceptions
  const zip5 = zipCode.split('-')[0];
  const firstDigit = parseInt(zip5[0]);
  return firstDigit === 3;
};

export const isValidLatitude = (lat: number): boolean => {
  return lat >= -90 && lat <= 90;
};

export const isValidLongitude = (lng: number): boolean => {
  return lng >= -180 && lng <= 180;
};

// Florida approximate bounds for basic validation
export const isValidFloridaLocation = (lat: number, lng: number): boolean => {
  const floridaBounds = {
    north: 31.0,
    south: 24.4,
    east: -79.8,
    west: -87.6
  };
  
  return lat >= floridaBounds.south && 
         lat <= floridaBounds.north && 
         lng >= floridaBounds.west && 
         lng <= floridaBounds.east;
};

// File validation
export const isValidImageType = (mimeType: string): boolean => {
  return ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType);
};

export const isValidFileSize = (sizeInBytes: number, maxSizeMB: number): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return sizeInBytes <= maxSizeBytes;
};

// Search validation
export const isValidSearchQuery = (query: string): boolean => {
  const trimmed = query.trim();
  return trimmed.length >= LIMITS.SEARCH_MIN_QUERY_LENGTH;
};

export const isValidSearchRadius = (radius: number): boolean => {
  return radius > 0 && radius <= 100; // max 100 miles
};

// Pagination validation
export const isValidPaginationLimit = (limit: number): boolean => {
  return limit > 0 && limit <= LIMITS.PAGINATION_MAX_LIMIT;
};

export const isValidPaginationPage = (page: number): boolean => {
  return page > 0 && Number.isInteger(page);
};

// Complex validation functions
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateUserRegistration = (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!isValidEmail(userData.email)) {
    errors.push('Invalid email format');
  }

  if (!isValidPassword(userData.password)) {
    errors.push('Password must be at least 8 characters with uppercase, lowercase, number and special character');
  }

  if (!userData.firstName.trim()) {
    errors.push('First name is required');
  }

  if (!userData.lastName.trim()) {
    errors.push('Last name is required');
  }

  if (userData.phone && !isValidPhone(userData.phone)) {
    errors.push('Invalid phone number format');
  }

  if (!isValidUserRole(userData.role)) {
    errors.push('Invalid user role');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateServiceCreation = (serviceData: {
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
}): ValidationResult => {
  const errors: string[] = [];

  if (!isValidServiceTitle(serviceData.title)) {
    errors.push(`Title must be 1-${LIMITS.MAX_SERVICE_TITLE_LENGTH} characters`);
  }

  if (!isValidServiceDescription(serviceData.description)) {
    errors.push(`Description must be 1-${LIMITS.MAX_SERVICE_DESCRIPTION_LENGTH} characters`);
  }

  if (!isValidServiceCategory(serviceData.category)) {
    errors.push('Invalid service category');
  }

  if (!isValidServicePrice(serviceData.price)) {
    errors.push('Price must be between $10 and $10,000');
  }

  if (serviceData.duration <= 0 || serviceData.duration > 480) { // max 8 hours
    errors.push('Duration must be between 1 and 480 minutes');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateBookingCreation = (bookingData: {
  scheduledAt: Date;
  notes?: string;
}): ValidationResult => {
  const errors: string[] = [];

  if (!isValidBookingDate(bookingData.scheduledAt)) {
    errors.push('Booking must be scheduled at least 2 hours in advance and within 90 days');
  }

  if (bookingData.notes && bookingData.notes.length > 500) {
    errors.push('Notes must be less than 500 characters');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitization functions
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/\s+/g, ' ');
};

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d+\-\(\)\s]/g, '').trim();
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}min`;
}; 