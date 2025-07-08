import { ServiceCategory, UserRole, Language } from './types';
export declare const isValidEmail: (email: string) => boolean;
export declare const isValidPhone: (phone: string) => boolean;
export declare const isValidZipCode: (zipCode: string) => boolean;
export declare const isValidPassword: (password: string) => boolean;
export declare const isValidSlug: (slug: string) => boolean;
export declare const isValidServiceTitle: (title: string) => boolean;
export declare const isValidServiceDescription: (description: string) => boolean;
export declare const isValidReviewComment: (comment: string) => boolean;
export declare const isValidMessageContent: (content: string) => boolean;
export declare const isValidBio: (bio: string) => boolean;
export declare const isValidUserRole: (role: string) => role is UserRole;
export declare const isValidServiceCategory: (category: string) => category is ServiceCategory;
export declare const isValidLanguage: (language: string) => language is Language;
export declare const isValidServicePrice: (price: number) => boolean;
export declare const isValidRating: (rating: number) => boolean;
export declare const isValidFutureDate: (date: Date) => boolean;
export declare const isValidBookingDate: (date: Date) => boolean;
export declare const isValidFloridaZipCode: (zipCode: string) => boolean;
export declare const isValidLatitude: (lat: number) => boolean;
export declare const isValidLongitude: (lng: number) => boolean;
export declare const isValidFloridaLocation: (lat: number, lng: number) => boolean;
export declare const isValidImageType: (mimeType: string) => boolean;
export declare const isValidFileSize: (sizeInBytes: number, maxSizeMB: number) => boolean;
export declare const isValidSearchQuery: (query: string) => boolean;
export declare const isValidSearchRadius: (radius: number) => boolean;
export declare const isValidPaginationLimit: (limit: number) => boolean;
export declare const isValidPaginationPage: (page: number) => boolean;
export interface ValidationResult {
    isValid: boolean;
    errors: string[];
}
export declare const validateUserRegistration: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: string;
}) => ValidationResult;
export declare const validateServiceCreation: (serviceData: {
    title: string;
    description: string;
    category: string;
    price: number;
    duration: number;
}) => ValidationResult;
export declare const validateBookingCreation: (bookingData: {
    scheduledAt: Date;
    notes?: string;
}) => ValidationResult;
export declare const sanitizeString: (input: string) => string;
export declare const sanitizeEmail: (email: string) => string;
export declare const sanitizePhone: (phone: string) => string;
export declare const formatPrice: (price: number) => string;
export declare const formatDuration: (minutes: number) => string;
