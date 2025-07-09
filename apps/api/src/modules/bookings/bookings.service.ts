import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto, UpdateBookingDto, BookingFilterDto, BookingStatus, PaymentStatus } from './dto/booking.dto';

enum UserRole {
  CLIENT = 'CLIENT',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new booking
   */
  async create(createBookingDto: CreateBookingDto, clientId: string) {
    const { serviceId, scheduledAt, duration, notes, address, city, state, zipCode, latitude, longitude } = createBookingDto;

    // Validate service exists and is active
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, status: 'ACTIVE', isActive: true },
      include: { provider: true }
    });

    if (!service) {
      throw new NotFoundException('Service not found or inactive');
    }

    // Validate client exists and is active
    const client = await this.prisma.user.findFirst({
      where: { id: clientId, role: 'CLIENT', status: 'ACTIVE' }
    });

    if (!client) {
      throw new NotFoundException('Client not found or inactive');
    }

    // Validate scheduled time is in the future
    const scheduledTime = new Date(scheduledAt);
    if (scheduledTime <= new Date()) {
      throw new BadRequestException('Scheduled time must be in the future');
    }

    // Check provider availability (simplified - could be enhanced with availability slots)
    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        providerId: service.providerId,
        scheduledAt: {
          gte: new Date(scheduledTime.getTime() - (duration || service.duration) * 60000),
          lte: new Date(scheduledTime.getTime() + (duration || service.duration) * 60000)
        },
        status: {
          in: ['CONFIRMED', 'IN_PROGRESS']
        }
      }
    });

    if (conflictingBooking) {
      throw new BadRequestException('Provider is not available at the requested time');
    }

    // Calculate total amount
    const bookingDuration = duration || service.duration;
    const totalAmount = service.price;

    // Create booking
    const booking = await this.prisma.booking.create({
      data: {
        serviceId,
        clientId,
        providerId: service.providerId,
        scheduledAt: scheduledTime,
        duration: bookingDuration,
        totalAmount,
        currency: service.currency,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        notes,
        address,
        city,
        state,
        zipCode,
        latitude,
        longitude
      },
      include: {
        service: {
          include: {
            provider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                businessName: true,
                avatar: true,
                rating: true,
                reviewCount: true,
                verified: true
              }
            }
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
            email: true
          }
        }
      }
    });

    // TODO: Send notification to provider
    // TODO: Create Stripe payment intent

    return booking;
  }

  /**
   * Get all bookings with filters
   */
  async findAll(filters: BookingFilterDto, userId: string, userRole: UserRole) {
    const {
      status,
      paymentStatus,
      startDate,
      endDate,
      serviceId,
      providerId,
      clientId,
      page = 1,
      limit = 10,
      sortBy = 'scheduledAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;

    // Build where clause based on user role
    const where: any = {};

    if (userRole === UserRole.CLIENT) {
      where.clientId = userId;
    } else if (userRole === UserRole.PROVIDER) {
      where.providerId = userId;
    }
    // ADMIN can see all bookings

    // Apply filters
    if (status) where.status = status;
    if (paymentStatus) where.paymentStatus = paymentStatus;
    if (serviceId) where.serviceId = serviceId;
    if (providerId) where.providerId = providerId;
    if (clientId) where.clientId = clientId;

    if (startDate || endDate) {
      where.scheduledAt = {};
      if (startDate) where.scheduledAt.gte = new Date(startDate);
      if (endDate) where.scheduledAt.lte = new Date(endDate);
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        include: {
          service: {
            select: {
              id: true,
              title: true,
              category: true,
              price: true,
              duration: true,
              images: true
            }
          },
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              phone: true,
              email: true
            }
          },
          provider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              businessName: true,
              avatar: true,
              rating: true,
              reviewCount: true,
              verified: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      this.prisma.booking.count({ where })
    ]);

    return {
      bookings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get booking by ID
   */
  async findOne(id: string, userId: string, userRole: UserRole) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: {
        service: {
          include: {
            provider: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                businessName: true,
                avatar: true,
                rating: true,
                reviewCount: true,
                verified: true,
                phone: true,
                email: true
              }
            }
          }
        },
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            phone: true,
            email: true
          }
        },
        messages: {
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        reviews: {
          include: {
            client: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check permissions
    if (userRole !== UserRole.ADMIN && 
        booking.clientId !== userId && 
        booking.providerId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return booking;
  }

  /**
   * Update booking status
   */
  async updateStatus(id: string, status: BookingStatus, userId: string, userRole: UserRole) {
    const booking = await this.findOne(id, userId, userRole);

    // Validate status transitions
    const validTransitions = this.getValidStatusTransitions(booking.status as BookingStatus, userRole);
    if (!validTransitions.includes(status)) {
      throw new BadRequestException(`Cannot transition from ${booking.status} to ${status}`);
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: { 
        status: status as any,
        updatedAt: new Date()
      },
      include: {
        service: true,
        client: true,
        provider: true
      }
    });

    // Handle side effects of status changes
    await this.handleStatusChange(updatedBooking, status);

    return updatedBooking;
  }

  /**
   * Update booking details
   */
  async update(id: string, updateBookingDto: UpdateBookingDto, userId: string, userRole: UserRole) {
    const booking = await this.findOne(id, userId, userRole);

    // Only allow updates if booking is PENDING or CONFIRMED
    if (![BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(booking.status as BookingStatus)) {
      throw new BadRequestException('Cannot update booking in current status');
    }

    // Validate scheduled time if being updated
    if (updateBookingDto.scheduledAt) {
      const scheduledTime = new Date(updateBookingDto.scheduledAt);
      if (scheduledTime <= new Date()) {
        throw new BadRequestException('Scheduled time must be in the future');
      }
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        ...updateBookingDto,
        updatedAt: new Date()
      },
      include: {
        service: true,
        client: true,
        provider: true
      }
    });

    return updatedBooking;
  }

  /**
   * Cancel booking
   */
  async cancel(id: string, userId: string, userRole: UserRole, reason?: string) {
    const booking = await this.findOne(id, userId, userRole);

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === 'COMPLETED') {
      throw new BadRequestException('Cannot cancel completed booking');
    }

    // Calculate cancellation fee based on timing
    const hoursUntilBooking = (new Date(booking.scheduledAt).getTime() - new Date().getTime()) / (1000 * 60 * 60);
    let refundAmount = booking.totalAmount;

    if (hoursUntilBooking < 24) {
      refundAmount = booking.totalAmount * 0.5; // 50% refund for cancellations within 24 hours
    } else if (hoursUntilBooking < 2) {
      refundAmount = 0; // No refund for cancellations within 2 hours
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id },
      data: {
        status: 'CANCELLED',
        notes: reason ? `${booking.notes || ''}\n\nCancellation reason: ${reason}` : booking.notes,
        updatedAt: new Date()
      },
      include: {
        service: true,
        client: true,
        provider: true
      }
    });

    // TODO: Process refund if payment was completed
    // TODO: Send cancellation notifications

    return {
      booking: updatedBooking,
      refundAmount
    };
  }

  /**
   * Get booking statistics
   */
  async getStats(userId: string, userRole: UserRole) {
    const where: any = {};

    if (userRole === UserRole.CLIENT) {
      where.clientId = userId;
    } else if (userRole === UserRole.PROVIDER) {
      where.providerId = userId;
    }

    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue
    ] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.count({ where: { ...where, status: 'PENDING' } }),
      this.prisma.booking.count({ where: { ...where, status: 'CONFIRMED' } }),
      this.prisma.booking.count({ where: { ...where, status: 'COMPLETED' } }),
      this.prisma.booking.count({ where: { ...where, status: 'CANCELLED' } }),
      this.prisma.booking.aggregate({
        where: { ...where, status: 'COMPLETED' },
        _sum: { totalAmount: true }
      })
    ]);

    return {
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      totalRevenue: totalRevenue._sum.totalAmount || 0
    };
  }

  /**
   * Get valid status transitions based on current status and user role
   */
  private getValidStatusTransitions(currentStatus: BookingStatus, userRole: UserRole): BookingStatus[] {
    const transitions: Record<BookingStatus, Record<UserRole, BookingStatus[]>> = {
      [BookingStatus.PENDING]: {
        [UserRole.CLIENT]: [BookingStatus.CANCELLED],
        [UserRole.PROVIDER]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED],
        [UserRole.ADMIN]: [BookingStatus.CONFIRMED, BookingStatus.CANCELLED]
      },
      [BookingStatus.CONFIRMED]: {
        [UserRole.CLIENT]: [BookingStatus.CANCELLED],
        [UserRole.PROVIDER]: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED],
        [UserRole.ADMIN]: [BookingStatus.IN_PROGRESS, BookingStatus.CANCELLED]
      },
      [BookingStatus.IN_PROGRESS]: {
        [UserRole.CLIENT]: [],
        [UserRole.PROVIDER]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED],
        [UserRole.ADMIN]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED]
      },
      [BookingStatus.COMPLETED]: {
        [UserRole.CLIENT]: [BookingStatus.DISPUTED],
        [UserRole.PROVIDER]: [],
        [UserRole.ADMIN]: [BookingStatus.DISPUTED]
      },
      [BookingStatus.CANCELLED]: {
        [UserRole.CLIENT]: [],
        [UserRole.PROVIDER]: [],
        [UserRole.ADMIN]: []
      },
      [BookingStatus.DISPUTED]: {
        [UserRole.CLIENT]: [],
        [UserRole.PROVIDER]: [],
        [UserRole.ADMIN]: [BookingStatus.COMPLETED, BookingStatus.CANCELLED]
      }
    };

    return transitions[currentStatus]?.[userRole] || [];
  }

  /**
   * Handle side effects of status changes
   */
  private async handleStatusChange(booking: any, newStatus: BookingStatus) {
    switch (newStatus) {
      case BookingStatus.CONFIRMED:
        // TODO: Send confirmation notifications
        // TODO: Create calendar events
        break;
      
      case BookingStatus.COMPLETED:
        // Update provider statistics
        await this.prisma.user.update({
          where: { id: booking.providerId },
          data: {
            completedBookings: { increment: 1 }
          }
        });
        // TODO: Send completion notifications
        // TODO: Trigger review request
        break;
      
      case BookingStatus.CANCELLED:
        // TODO: Send cancellation notifications
        // TODO: Process refunds
        break;
    }
  }
} 