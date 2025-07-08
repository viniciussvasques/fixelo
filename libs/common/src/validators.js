"use strict";
// Validation utilities for Fixelo marketplace
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDuration = exports.formatPrice = exports.sanitizePhone = exports.sanitizeEmail = exports.sanitizeString = exports.validateBookingCreation = exports.validateServiceCreation = exports.validateUserRegistration = exports.isValidPaginationPage = exports.isValidPaginationLimit = exports.isValidSearchRadius = exports.isValidSearchQuery = exports.isValidFileSize = exports.isValidImageType = exports.isValidFloridaLocation = exports.isValidLongitude = exports.isValidLatitude = exports.isValidFloridaZipCode = exports.isValidBookingDate = exports.isValidFutureDate = exports.isValidRating = exports.isValidServicePrice = exports.isValidLanguage = exports.isValidServiceCategory = exports.isValidUserRole = exports.isValidBio = exports.isValidMessageContent = exports.isValidReviewComment = exports.isValidServiceDescription = exports.isValidServiceTitle = exports.isValidSlug = exports.isValidPassword = exports.isValidZipCode = exports.isValidPhone = exports.isValidEmail = void 0;
const constants_1 = require("./constants");
const types_1 = require("./types");
// Basic validation functions
const isValidEmail = (email) => {
    return constants_1.REGEX.EMAIL.test(email.trim());
};
exports.isValidEmail = isValidEmail;
const isValidPhone = (phone) => {
    return constants_1.REGEX.PHONE.test(phone.trim());
};
exports.isValidPhone = isValidPhone;
const isValidZipCode = (zipCode) => {
    return constants_1.REGEX.ZIP_CODE.test(zipCode.trim());
};
exports.isValidZipCode = isValidZipCode;
const isValidPassword = (password) => {
    return password.length >= constants_1.LIMITS.PASSWORD_MIN_LENGTH && constants_1.REGEX.PASSWORD.test(password);
};
exports.isValidPassword = isValidPassword;
const isValidSlug = (slug) => {
    return constants_1.REGEX.SLUG.test(slug);
};
exports.isValidSlug = isValidSlug;
// Content validation
const isValidServiceTitle = (title) => {
    const trimmed = title.trim();
    return trimmed.length > 0 && trimmed.length <= constants_1.LIMITS.MAX_SERVICE_TITLE_LENGTH;
};
exports.isValidServiceTitle = isValidServiceTitle;
const isValidServiceDescription = (description) => {
    const trimmed = description.trim();
    return trimmed.length > 0 && trimmed.length <= constants_1.LIMITS.MAX_SERVICE_DESCRIPTION_LENGTH;
};
exports.isValidServiceDescription = isValidServiceDescription;
const isValidReviewComment = (comment) => {
    return comment.trim().length <= constants_1.LIMITS.MAX_REVIEW_LENGTH;
};
exports.isValidReviewComment = isValidReviewComment;
const isValidMessageContent = (content) => {
    const trimmed = content.trim();
    return trimmed.length > 0 && trimmed.length <= constants_1.LIMITS.MAX_MESSAGE_LENGTH;
};
exports.isValidMessageContent = isValidMessageContent;
const isValidBio = (bio) => {
    return bio.trim().length <= constants_1.LIMITS.MAX_BIO_LENGTH;
};
exports.isValidBio = isValidBio;
// Enum validation
const isValidUserRole = (role) => {
    return Object.values(types_1.UserRole).includes(role);
};
exports.isValidUserRole = isValidUserRole;
const isValidServiceCategory = (category) => {
    return Object.values(types_1.ServiceCategory).includes(category);
};
exports.isValidServiceCategory = isValidServiceCategory;
const isValidLanguage = (language) => {
    return Object.values(types_1.Language).includes(language);
};
exports.isValidLanguage = isValidLanguage;
// Pricing validation
const isValidServicePrice = (price) => {
    return price >= 10 && price <= 10000 && price % 0.01 === 0; // Valid currency amount
};
exports.isValidServicePrice = isValidServicePrice;
const isValidRating = (rating) => {
    return rating >= 1 && rating <= 5 && Number.isInteger(rating);
};
exports.isValidRating = isValidRating;
// Date validation
const isValidFutureDate = (date) => {
    return date > new Date();
};
exports.isValidFutureDate = isValidFutureDate;
const isValidBookingDate = (date) => {
    const now = new Date();
    const minAdvanceMs = 2 * 60 * 60 * 1000; // 2 hours
    const maxAdvanceMs = 90 * 24 * 60 * 60 * 1000; // 90 days
    const timeDiff = date.getTime() - now.getTime();
    return timeDiff >= minAdvanceMs && timeDiff <= maxAdvanceMs;
};
exports.isValidBookingDate = isValidBookingDate;
// Location validation for Florida
const isValidFloridaZipCode = (zipCode) => {
    if (!(0, exports.isValidZipCode)(zipCode))
        return false;
    // Florida ZIP codes typically start with 3, with some exceptions
    const zip5 = zipCode.split('-')[0];
    const firstDigit = parseInt(zip5[0]);
    return firstDigit === 3;
};
exports.isValidFloridaZipCode = isValidFloridaZipCode;
const isValidLatitude = (lat) => {
    return lat >= -90 && lat <= 90;
};
exports.isValidLatitude = isValidLatitude;
const isValidLongitude = (lng) => {
    return lng >= -180 && lng <= 180;
};
exports.isValidLongitude = isValidLongitude;
// Florida approximate bounds for basic validation
const isValidFloridaLocation = (lat, lng) => {
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
exports.isValidFloridaLocation = isValidFloridaLocation;
// File validation
const isValidImageType = (mimeType) => {
    return ['image/jpeg', 'image/png', 'image/webp'].includes(mimeType);
};
exports.isValidImageType = isValidImageType;
const isValidFileSize = (sizeInBytes, maxSizeMB) => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return sizeInBytes <= maxSizeBytes;
};
exports.isValidFileSize = isValidFileSize;
// Search validation
const isValidSearchQuery = (query) => {
    const trimmed = query.trim();
    return trimmed.length >= constants_1.LIMITS.SEARCH_MIN_QUERY_LENGTH;
};
exports.isValidSearchQuery = isValidSearchQuery;
const isValidSearchRadius = (radius) => {
    return radius > 0 && radius <= 100; // max 100 miles
};
exports.isValidSearchRadius = isValidSearchRadius;
// Pagination validation
const isValidPaginationLimit = (limit) => {
    return limit > 0 && limit <= constants_1.LIMITS.PAGINATION_MAX_LIMIT;
};
exports.isValidPaginationLimit = isValidPaginationLimit;
const isValidPaginationPage = (page) => {
    return page > 0 && Number.isInteger(page);
};
exports.isValidPaginationPage = isValidPaginationPage;
const validateUserRegistration = (userData) => {
    const errors = [];
    if (!(0, exports.isValidEmail)(userData.email)) {
        errors.push('Invalid email format');
    }
    if (!(0, exports.isValidPassword)(userData.password)) {
        errors.push('Password must be at least 8 characters with uppercase, lowercase, number and special character');
    }
    if (!userData.firstName.trim()) {
        errors.push('First name is required');
    }
    if (!userData.lastName.trim()) {
        errors.push('Last name is required');
    }
    if (userData.phone && !(0, exports.isValidPhone)(userData.phone)) {
        errors.push('Invalid phone number format');
    }
    if (!(0, exports.isValidUserRole)(userData.role)) {
        errors.push('Invalid user role');
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
exports.validateUserRegistration = validateUserRegistration;
const validateServiceCreation = (serviceData) => {
    const errors = [];
    if (!(0, exports.isValidServiceTitle)(serviceData.title)) {
        errors.push(`Title must be 1-${constants_1.LIMITS.MAX_SERVICE_TITLE_LENGTH} characters`);
    }
    if (!(0, exports.isValidServiceDescription)(serviceData.description)) {
        errors.push(`Description must be 1-${constants_1.LIMITS.MAX_SERVICE_DESCRIPTION_LENGTH} characters`);
    }
    if (!(0, exports.isValidServiceCategory)(serviceData.category)) {
        errors.push('Invalid service category');
    }
    if (!(0, exports.isValidServicePrice)(serviceData.price)) {
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
exports.validateServiceCreation = validateServiceCreation;
const validateBookingCreation = (bookingData) => {
    const errors = [];
    if (!(0, exports.isValidBookingDate)(bookingData.scheduledAt)) {
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
exports.validateBookingCreation = validateBookingCreation;
// Sanitization functions
const sanitizeString = (input) => {
    return input.trim().replace(/\s+/g, ' ');
};
exports.sanitizeString = sanitizeString;
const sanitizeEmail = (email) => {
    return email.trim().toLowerCase();
};
exports.sanitizeEmail = sanitizeEmail;
const sanitizePhone = (phone) => {
    return phone.replace(/[^\d+\-\(\)\s]/g, '').trim();
};
exports.sanitizePhone = sanitizePhone;
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
};
exports.formatPrice = formatPrice;
const formatDuration = (minutes) => {
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
exports.formatDuration = formatDuration;
//# sourceMappingURL=validators.js.map