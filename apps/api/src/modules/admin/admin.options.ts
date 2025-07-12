import { PrismaClient } from '@prisma/client';

// Build AdminJS/Express options using Prisma client
export const buildAdminOptions = async (
  prisma: PrismaClient,
) => {
  // AdminJS & adapter loaded dynamically to avoid ESM/CJS conflicts
  const AdminJS = (await import('adminjs')).default;
  const { Database, Resource } = await import('@adminjs/prisma');

  // Register Prisma adapter only once
  AdminJS.registerAdapter({ Database, Resource });

  // -------------------------------------------------------------
  // Authentication – very simple for now (hard-coded credentials)
  // TODO: replace with JWT / Nest Auth integration
  // -------------------------------------------------------------
  const authenticate = async (email: string, password: string) => {
    const valid = [
      { email: 'admin@fixelo.com', password: 'admin123' },
      { email: 'super@fixelo.com', password: 'super123' },
    ].find((u) => u.email === email && u.password === password);
    return valid ? { email: valid.email, role: 'admin' } : null;
  };

  // -------------------------------------------------------------
  // Branding & locale
  // -------------------------------------------------------------
  const branding = {
    companyName: 'Fixelo Admin Panel',
    withMadeWithLove: false,
    favicon: 'https://fixelo.com/favicon.ico',
    theme: {
      colors: {
        primary100: '#2563eb',
        primary80: '#3b82f6',
        primary60: '#60a5fa',
        primary40: '#93c5fd',
        primary20: '#dbeafe',
        grey100: '#1f2937',
        grey80: '#374151',
        grey60: '#6b7280',
        grey40: '#9ca3af',
        grey20: '#e5e7eb',
        accent: '#10b981',
        hoverBg: '#f3f4f6',
      },
    },
  } as const;

  // -------------------------------------------------------------
  // Dashboard handler with quick stats
  // -------------------------------------------------------------
  const dashboard = {
    handler: async () => {
      const [totalUsers, totalServices, totalBookings, revenueAgg] = await Promise.all([
        prisma.user.count(),
        prisma.service.count(),
        prisma.booking.count(),
        prisma.transaction.aggregate({
          _sum: { amount: true },
          where: { status: 'COMPLETED' },
        }),
      ]);

      return {
        totalUsers,
        totalServices,
        totalBookings,
        totalRevenue: revenueAgg._sum.amount || 0,
        message: 'Welcome to Fixelo Admin Panel – manage the entire marketplace here!',
      };
    },
  };

  // -------------------------------------------------------------
  // Resources – Users, Services, Bookings, Reviews, Plans, Transactions
  // -------------------------------------------------------------
  const resources = [
    {
      resource: { model: prisma.user, client: prisma },
      options: {
        navigation: { name: 'Users', icon: 'User' },
        listProperties: ['id', 'email', 'role', 'status', 'createdAt'],
        properties: {
          password: { isVisible: false },
          refreshTokens: { isVisible: false },
          email: { isTitle: true, type: 'email' },
        },
      },
    },
    {
      resource: { model: prisma.service, client: prisma },
      options: {
        navigation: { name: 'Services', icon: 'Settings' },
        listProperties: ['id', 'title', 'category', 'price', 'status', 'createdAt'],
        properties: {
          description: { type: 'textarea' },
          title: { isTitle: true },
        },
      },
    },
    {
      resource: { model: prisma.booking, client: prisma },
      options: {
        navigation: { name: 'Bookings', icon: 'Calendar' },
        listProperties: ['id', 'status', 'scheduledAt', 'totalAmount', 'createdAt'],
      },
    },
    {
      resource: { model: prisma.review, client: prisma },
      options: {
        navigation: { name: 'Reviews', icon: 'Star' },
        listProperties: ['id', 'rating', 'comment', 'createdAt'],
        properties: { comment: { type: 'textarea' } },
      },
    },
    {
      resource: { model: prisma.plan, client: prisma },
      options: {
        navigation: { name: 'Plans', icon: 'CreditCard' },
        listProperties: ['id', 'name', 'price', 'billingPeriod', 'isActive'],
        properties: { name: { isTitle: true } },
      },
    },
    {
      resource: { model: prisma.transaction, client: prisma },
      options: {
        navigation: { name: 'Transactions', icon: 'DollarSign' },
        listProperties: ['id', 'type', 'amount', 'currency', 'status', 'createdAt'],
      },
    },
  ];

  // -------------------------------------------------------------
  // Final AdminJS options
  // -------------------------------------------------------------
  const adminJsOptions = {
    rootPath: '/admin',
    branding,
    dashboard,
    resources,
  } satisfies import('adminjs').AdminJSOptions;

  return {
    adminJsOptions,
    auth: {
      authenticate,
      cookieName: 'adminjs',
      cookiePassword: process.env.ADMIN_COOKIE_SECRET || 'fixelo-admin-cookie-secret-2024',
    },
  };
};

// Export para CommonJS também
module.exports = { buildAdminOptions }; 