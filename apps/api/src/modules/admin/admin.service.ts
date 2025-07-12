import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole, UserStatus, ServiceStatus, BookingStatus, SubscriptionStatus, TransactionType, AdStatus, NotificationType } from '@prisma/client';
import { buildAdminOptions } from './admin.options';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // AdminJS Configuration
  async getAdminJSConfig() {
    return buildAdminOptions(this.prisma);
  }

  // Dashboard Statistics
  async getDashboardStats() {
    const [
      totalUsers,
      totalProviders,
      totalClients,
      totalServices,
      totalBookings,
      totalRevenue,
      activeSubscriptions,
      totalReviews,
      averageRating,
      recentBookings,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.PROVIDER } }),
      this.prisma.user.count({ where: { role: UserRole.CLIENT } }),
      this.prisma.service.count(),
      this.prisma.booking.count(),
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      }),
      this.prisma.subscription.count({
        where: { status: SubscriptionStatus.ACTIVE },
      }),
      this.prisma.review.count(),
      this.prisma.review.aggregate({ _avg: { rating: true } }),
      this.prisma.booking.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          service: { select: { title: true } },
          client: { select: { firstName: true, lastName: true } },
          provider: { select: { firstName: true, lastName: true } },
        },
      }),
    ]);

    return {
      totalUsers,
      totalProviders,
      totalClients,
      totalServices,
      totalBookings,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeSubscriptions,
      totalReviews,
      averageRating: averageRating._avg.rating || 0,
      recentBookings,
    };
  }

  async getDashboardMetrics(period: string = '30d') {
    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [userGrowth, bookingGrowth, revenueGrowth] = await Promise.all([
      this.prisma.user.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: startDate } },
        _count: { id: true },
      }),
      this.prisma.booking.groupBy({
        by: ['createdAt'],
        where: { createdAt: { gte: startDate } },
        _count: { id: true },
      }),
      this.prisma.transaction.groupBy({
        by: ['createdAt'],
        where: { 
          createdAt: { gte: startDate },
          status: 'COMPLETED',
        },
        _sum: { amount: true },
      }),
    ]);

    return {
      userGrowth,
      bookingGrowth,
      revenueGrowth,
    };
  }

  async getRevenueStats(period: string = '30d') {
    const days = parseInt(period.replace('d', ''));
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalRevenue, subscriptionRevenue, leadRevenue, adRevenue] = await Promise.all([
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { 
          createdAt: { gte: startDate },
          status: 'COMPLETED',
        },
      }),
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { 
          createdAt: { gte: startDate },
          status: 'COMPLETED',
          type: TransactionType.SUBSCRIPTION,
        },
      }),
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { 
          createdAt: { gte: startDate },
          status: 'COMPLETED',
          type: TransactionType.LEAD_PURCHASE,
        },
      }),
      this.prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { 
          createdAt: { gte: startDate },
          status: 'COMPLETED',
          type: TransactionType.AD_CAMPAIGN,
        },
      }),
    ]);

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      subscriptionRevenue: subscriptionRevenue._sum.amount || 0,
      leadRevenue: leadRevenue._sum.amount || 0,
      adRevenue: adRevenue._sum.amount || 0,
    };
  }

  // User Management
  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          status: true,
          verified: true,
          planType: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          lastLogin: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        providedServices: true,
        clientBookings: true,
        providerBookings: true,
        subscriptions: true,
        transactions: true,
        receivedReviews: true,
        givenReviews: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, updateData: any) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async suspendUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.SUSPENDED },
    });
  }

  async activateUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.ACTIVE },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.DELETED },
    });
  }

  // Service Management
  async getAllServices(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          provider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              bookings: true,
              reviews: true,
            },
          },
        },
      }),
      this.prisma.service.count(),
    ]);

    return {
      services,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getServiceById(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
      include: {
        provider: true,
        bookings: true,
        reviews: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async updateService(id: string, updateData: any) {
    return this.prisma.service.update({
      where: { id },
      data: updateData,
    });
  }

  async approveService(id: string) {
    return this.prisma.service.update({
      where: { id },
      data: { status: ServiceStatus.ACTIVE },
    });
  }

  async suspendService(id: string) {
    return this.prisma.service.update({
      where: { id },
      data: { status: ServiceStatus.SUSPENDED },
    });
  }

  async deleteService(id: string) {
    return this.prisma.service.delete({
      where: { id },
    });
  }

  // Booking Management
  async getAllBookings(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          service: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          provider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.booking.count(),
    ]);

    return {
      bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getBookingById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        client: true,
        provider: true,
        messages: true,
        reviews: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async resolveDispute(id: string, resolution: any) {
    return this.prisma.booking.update({
      where: { id },
      data: { 
        status: BookingStatus.COMPLETED,
        notes: resolution.notes,
      },
    });
  }

  async updateBookingStatus(id: string, statusData: any) {
    return this.prisma.booking.update({
      where: { id },
      data: { status: statusData.status },
    });
  }

  // Review Management
  async getAllReviews(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          provider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          service: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      this.prisma.review.count(),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getReviewById(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        client: true,
        provider: true,
        service: true,
        booking: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async moderateReview(id: string, moderationData: any) {
    return this.prisma.review.update({
      where: { id },
      data: {
        comment: moderationData.moderatedComment,
        response: moderationData.moderatorNote,
      },
    });
  }

  async deleteReview(id: string) {
    return this.prisma.review.delete({
      where: { id },
    });
  }

  // Plan Management
  async getAllPlans() {
    return this.prisma.plan.findMany({
      orderBy: { price: 'asc' },
      include: {
        subscriptions: {
          where: { status: SubscriptionStatus.ACTIVE },
        },
      },
    });
  }

  async getPlanById(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: {
        subscriptions: true,
      },
    });

    if (!plan) {
      throw new NotFoundException('Plan not found');
    }

    return plan;
  }

  async createPlan(planData: any) {
    return this.prisma.plan.create({
      data: planData,
    });
  }

  async updatePlan(id: string, updateData: any) {
    return this.prisma.plan.update({
      where: { id },
      data: updateData,
    });
  }

  async deletePlan(id: string) {
    return this.prisma.plan.delete({
      where: { id },
    });
  }

  // Subscription Management
  async getAllSubscriptions(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [subscriptions, total] = await Promise.all([
      this.prisma.subscription.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          plan: {
            select: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      }),
      this.prisma.subscription.count(),
    ]);

    return {
      subscriptions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSubscriptionById(id: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id },
      include: {
        user: true,
        plan: true,
      },
    });

    if (!subscription) {
      throw new NotFoundException('Subscription not found');
    }

    return subscription;
  }

  async cancelSubscription(id: string) {
    return this.prisma.subscription.update({
      where: { id },
      data: { 
        status: SubscriptionStatus.CANCELLED,
        cancelAtPeriodEnd: true,
      },
    });
  }

  async reactivateSubscription(id: string) {
    return this.prisma.subscription.update({
      where: { id },
      data: { 
        status: SubscriptionStatus.ACTIVE,
        cancelAtPeriodEnd: false,
      },
    });
  }

  // Transaction Management
  async getAllTransactions(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.transaction.count(),
    ]);

    return {
      transactions,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTransactionById(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async refundTransaction(id: string, refundData: any) {
    return this.prisma.transaction.update({
      where: { id },
      data: { 
        status: 'REFUNDED',
        description: `Refunded: ${refundData.reason}`,
      },
    });
  }

  // Ad Campaign Management
  async getAllCampaigns(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [campaigns, total] = await Promise.all([
      this.prisma.adCampaign.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          provider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          service: {
            select: {
              id: true,
              title: true,
              category: true,
            },
          },
        },
      }),
      this.prisma.adCampaign.count(),
    ]);

    return {
      campaigns,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getCampaignById(id: string) {
    const campaign = await this.prisma.adCampaign.findUnique({
      where: { id },
      include: {
        provider: true,
        service: true,
        bids: true,
      },
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return campaign;
  }

  async approveCampaign(id: string) {
    return this.prisma.adCampaign.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async suspendCampaign(id: string) {
    return this.prisma.adCampaign.update({
      where: { id },
      data: { status: AdStatus.PAUSED },
    });
  }

  // Notification Management
  async getAllNotifications(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.notification.count(),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async broadcastNotification(notificationData: any) {
    // Get all users based on criteria
    const users = await this.prisma.user.findMany({
      where: notificationData.criteria || {},
      select: { id: true },
    });

    // Create notifications for all users
    const notifications = users.map(user => ({
      userId: user.id,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      data: notificationData.data,
    }));

    return this.prisma.notification.createMany({
      data: notifications,
    });
  }

  // Audit Logs
  async getAuditLogs(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      logs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  // System Health
  async getSystemHealth() {
    const [
      databaseStatus,
      totalUsers,
      totalBookings,
      errorLogs,
    ] = await Promise.all([
      this.prisma.$queryRaw`SELECT 1 as status`,
      this.prisma.user.count(),
      this.prisma.booking.count(),
      this.prisma.auditLog.count({
        where: {
          action: 'ERROR',
          createdAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ]);

    return {
      database: databaseStatus ? 'healthy' : 'error',
      users: totalUsers,
      bookings: totalBookings,
      errors24h: errorLogs,
      timestamp: new Date(),
    };
  }

  // Reports
  async getUserReport(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const [totalUsers, newUsers, activeUsers, providerUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      this.prisma.user.count({
        where: {
          status: UserStatus.ACTIVE,
          lastLogin: {
            gte: start,
            lte: end,
          },
        },
      }),
      this.prisma.user.count({
        where: {
          role: UserRole.PROVIDER,
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
    ]);

    return {
      totalUsers,
      newUsers,
      activeUsers,
      providerUsers,
      period: { startDate, endDate },
    };
  }

  async getRevenueReport(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const revenue = await this.prisma.transaction.aggregate({
      _sum: { amount: true },
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    const revenueByType = await this.prisma.transaction.groupBy({
      by: ['type'],
      _sum: { amount: true },
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    return {
      totalRevenue: revenue._sum.amount || 0,
      revenueByType,
      period: { startDate, endDate },
    };
  }

  async getBookingReport(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const [totalBookings, completedBookings, cancelledBookings] = await Promise.all([
      this.prisma.booking.count({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      this.prisma.booking.count({
        where: {
          status: BookingStatus.COMPLETED,
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
      this.prisma.booking.count({
        where: {
          status: BookingStatus.CANCELLED,
          createdAt: {
            gte: start,
            lte: end,
          },
        },
      }),
    ]);

    return {
      totalBookings,
      completedBookings,
      cancelledBookings,
      completionRate: totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0,
      period: { startDate, endDate },
    };
  }

  // Support Tools
  async getUserActivity(userId: string) {
    const [user, bookings, reviews, transactions] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        include: {
          providedServices: true,
        },
      }),
      this.prisma.booking.findMany({
        where: {
          OR: [
            { clientId: userId },
            { providerId: userId },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.review.findMany({
        where: {
          OR: [
            { clientId: userId },
            { providerId: userId },
          ],
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return {
      user,
      recentBookings: bookings,
      recentReviews: reviews,
      recentTransactions: transactions,
    };
  }

  async impersonateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // In a real implementation, you would generate a special token
    // that allows admin to act as this user
    return {
      message: `Impersonating user ${user.email}`,
      userId: user.id,
      // token: generateImpersonationToken(user.id),
    };
  }

  async sendSupportMessage(messageData: any) {
    return this.prisma.notification.create({
      data: {
        userId: messageData.userId,
        type: NotificationType.MESSAGE_RECEIVED,
        title: 'Support Message',
        message: messageData.message,
        data: JSON.stringify({
          from: 'admin',
          priority: messageData.priority || 'normal',
        }),
      },
    });
  }
} 