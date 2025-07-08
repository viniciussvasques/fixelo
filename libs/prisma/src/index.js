"use strict";
// Prisma client and utilities for Fixelo marketplace
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findBookingWithDetails = exports.findNearbyServices = exports.updateUserRating = exports.findUserById = exports.findUserByEmail = exports.createDefaultPlans = exports.cleanupDatabase = exports.runInTransaction = exports.checkDatabaseHealth = exports.disconnectDatabase = exports.connectDatabase = exports.PrismaService = exports.prisma = void 0;
const client_1 = require("@prisma/client");
// Environment detection
const isDevelopment = globalThis?.process?.env?.NODE_ENV === 'development';
const isTest = globalThis?.process?.env?.NODE_ENV === 'test';
// Create Prisma client instance
exports.prisma = new client_1.PrismaClient({
    log: isDevelopment ? ['query', 'info', 'warn', 'error'] : ['error'],
    errorFormat: 'pretty',
});
// Re-export Prisma types
__exportStar(require("@prisma/client"), exports);
// Export PrismaService for NestJS
var prisma_service_1 = require("./prisma.service");
Object.defineProperty(exports, "PrismaService", { enumerable: true, get: function () { return prisma_service_1.PrismaService; } });
// Database utilities
const connectDatabase = async () => {
    try {
        await exports.prisma.$connect();
        console.log('✅ Database connected successfully');
    }
    catch (error) {
        console.error('❌ Database connection failed:', error);
        throw error;
    }
};
exports.connectDatabase = connectDatabase;
const disconnectDatabase = async () => {
    try {
        await exports.prisma.$disconnect();
        console.log('✅ Database disconnected successfully');
    }
    catch (error) {
        console.error('❌ Database disconnection failed:', error);
        throw error;
    }
};
exports.disconnectDatabase = disconnectDatabase;
// Health check
const checkDatabaseHealth = async () => {
    try {
        await exports.prisma.$queryRaw `SELECT 1`;
        return true;
    }
    catch (error) {
        console.error('Database health check failed:', error);
        return false;
    }
};
exports.checkDatabaseHealth = checkDatabaseHealth;
// Transaction utilities
const runInTransaction = async (fn) => {
    return exports.prisma.$transaction(fn);
};
exports.runInTransaction = runInTransaction;
// Cleanup utilities for testing
const cleanupDatabase = async () => {
    if (!isTest) {
        throw new Error('Database cleanup is only allowed in test environment');
    }
    const tableNames = [
        'service_boosts',
        'audit_logs',
        'verifications',
        'refresh_tokens',
        'lead_purchases',
        'notifications',
        'subscriptions',
        'plans',
        'messages',
        'reviews',
        'bookings',
        'services',
        'users',
    ];
    // Disable foreign key checks
    await exports.prisma.$executeRaw `SET FOREIGN_KEY_CHECKS = 0;`;
    // Clear all tables
    for (const tableName of tableNames) {
        await exports.prisma.$executeRawUnsafe(`DELETE FROM ${tableName};`);
    }
    // Re-enable foreign key checks
    await exports.prisma.$executeRaw `SET FOREIGN_KEY_CHECKS = 1;`;
};
exports.cleanupDatabase = cleanupDatabase;
// Seed data utilities
const createDefaultPlans = async () => {
    const existingPlans = await exports.prisma.plan.findMany();
    if (existingPlans.length === 0) {
        await exports.prisma.plan.createMany({
            data: [
                {
                    type: 'FREE',
                    name: 'Free Plan',
                    price: 0,
                    currency: 'USD',
                    billingPeriod: 'monthly',
                    features: [
                        'Up to 10 leads/month',
                        'Basic profile',
                        'Can receive reviews',
                        'Can purchase extra leads ($3 each)',
                    ],
                    leadsLimit: 10,
                    isActive: true,
                },
                {
                    type: 'PRO',
                    name: 'Pro Plan',
                    price: 34.8,
                    currency: 'USD',
                    billingPeriod: 'monthly',
                    features: [
                        'Unlimited leads and messages',
                        'Verified badge',
                        'Top search visibility',
                        'Analytics dashboard',
                        'Boost access (ADS)',
                        'Priority support',
                    ],
                    trialDays: 7,
                    isActive: true,
                },
            ],
        });
        console.log('✅ Default plans created');
    }
};
exports.createDefaultPlans = createDefaultPlans;
// User utilities
const findUserByEmail = async (email) => {
    return exports.prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        include: {
            subscriptions: {
                include: { plan: true },
                where: { status: 'ACTIVE' },
            },
        },
    });
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    return exports.prisma.user.findUnique({
        where: { id },
        include: {
            subscriptions: {
                include: { plan: true },
                where: { status: 'ACTIVE' },
            },
        },
    });
};
exports.findUserById = findUserById;
const updateUserRating = async (providerId) => {
    const reviews = await exports.prisma.review.findMany({
        where: { providerId },
        select: { rating: true },
    });
    if (reviews.length > 0) {
        const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
        await exports.prisma.user.update({
            where: { id: providerId },
            data: {
                rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
                reviewCount: reviews.length,
            },
        });
    }
};
exports.updateUserRating = updateUserRating;
// Service utilities
const findNearbyServices = async (latitude, longitude, radiusMiles = 25, category) => {
    // This is a simplified distance calculation
    // In production, you might want to use PostGIS or a more sophisticated geospatial solution
    const latRange = radiusMiles / 69.0; // 1 degree lat ≈ 69 miles
    const lngRange = radiusMiles / (69.0 * Math.cos(latitude * Math.PI / 180));
    const whereClause = {
        isActive: true,
        status: 'ACTIVE',
        latitude: {
            gte: latitude - latRange,
            lte: latitude + latRange,
        },
        longitude: {
            gte: longitude - lngRange,
            lte: longitude + lngRange,
        },
    };
    if (category) {
        whereClause.category = category;
    }
    return exports.prisma.service.findMany({
        where: whereClause,
        include: {
            provider: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    rating: true,
                    reviewCount: true,
                    verified: true,
                    businessName: true,
                },
            },
        },
        orderBy: [
            { provider: { verified: 'desc' } }, // Verified providers first
            { provider: { rating: 'desc' } }, // Then by rating
            { createdAt: 'desc' }, // Then by newest
        ],
    });
};
exports.findNearbyServices = findNearbyServices;
// Booking utilities
const findBookingWithDetails = async (bookingId) => {
    return exports.prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
            service: {
                include: {
                    provider: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                            phone: true,
                            businessName: true,
                        },
                    },
                },
            },
            client: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    phone: true,
                },
            },
            messages: {
                include: {
                    sender: {
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            avatar: true,
                        },
                    },
                },
                orderBy: { createdAt: 'asc' },
            },
            reviews: true,
        },
    });
};
exports.findBookingWithDetails = findBookingWithDetails;
// Export prisma client as default
exports.default = exports.prisma;
//# sourceMappingURL=index.js.map