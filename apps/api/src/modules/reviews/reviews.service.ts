import { Injectable, NotFoundException, ForbiddenException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto, ReviewResponseDto, ReviewStatsDto, ReviewFiltersDto } from './dto/review.dto';
import { BookingStatus } from '@fixelo/common';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async createReview(clientId: string, createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
    const { rating, comment, bookingId } = createReviewDto;

    // Verify booking exists and is completed
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        provider: true,
        service: true,
        reviews: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Only client can create review
    if (booking.clientId !== clientId) {
      throw new ForbiddenException('Only the client can create a review for this booking');
    }

    // Booking must be completed to allow reviews
    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException('Can only review completed bookings');
    }

    // Check if review already exists
    if (booking.reviews.length > 0) {
      throw new ConflictException('Review already exists for this booking');
    }

    // Create the review
    const review = await this.prisma.review.create({
      data: {
        rating,
        comment,
        bookingId,
        clientId,
        providerId: booking.providerId,
        serviceId: booking.serviceId,
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
            avatar: true,
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
    });

    // Update provider's rating statistics
    await this.updateProviderRating(booking.providerId);

    return this.formatReviewResponse(review);
  }

  async updateReview(clientId: string, reviewId: string, updateReviewDto: UpdateReviewDto): Promise<ReviewResponseDto> {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        client: true,
        provider: true,
        service: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Only client who created the review can update it
    if (review.clientId !== clientId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: updateReviewDto,
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
            avatar: true,
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
    });

    // Update provider's rating statistics if rating changed
    if (updateReviewDto.rating !== undefined) {
      await this.updateProviderRating(review.providerId);
    }

    return this.formatReviewResponse(updatedReview);
  }

  async deleteReview(clientId: string, reviewId: string): Promise<void> {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Only client who created the review can delete it
    if (review.clientId !== clientId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    // Update provider's rating statistics
    await this.updateProviderRating(review.providerId);
  }

  async addProviderResponse(providerId: string, reviewId: string, response: string): Promise<ReviewResponseDto> {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        client: true,
        provider: true,
        service: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    // Only the provider who received the review can respond
    if (review.providerId !== providerId) {
      throw new ForbiddenException('You can only respond to reviews about your services');
    }

    const updatedReview = await this.prisma.review.update({
      where: { id: reviewId },
      data: { response },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
            avatar: true,
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
    });

    return this.formatReviewResponse(updatedReview);
  }

  async getReviews(filters: ReviewFiltersDto): Promise<{ reviews: ReviewResponseDto[]; total: number; page: number; limit: number }> {
    const { rating, serviceId, providerId, clientId, page = 1, limit = 10 } = filters;

    const where: any = {};

    if (rating) where.rating = rating;
    if (serviceId) where.serviceId = serviceId;
    if (providerId) where.providerId = providerId;
    if (clientId) where.clientId = clientId;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          provider: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              businessName: true,
              avatar: true,
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
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      reviews: reviews.map(review => this.formatReviewResponse(review)),
      total,
      page,
      limit,
    };
  }

  async getReviewById(reviewId: string): Promise<ReviewResponseDto> {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            businessName: true,
            avatar: true,
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
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return this.formatReviewResponse(review);
  }

  async getProviderStats(providerId: string): Promise<ReviewStatsDto> {
    const reviews = await this.prisma.review.findMany({
      where: { providerId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    const ratingDistribution = reviews.reduce(
      (acc, review) => {
        acc[review.rating as keyof typeof acc]++;
        return acc;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    );

    return {
      averageRating: Math.round(averageRating * 100) / 100, // Round to 2 decimal places
      totalReviews,
      ratingDistribution,
    };
  }

  async getServiceStats(serviceId: string): Promise<ReviewStatsDto> {
    const reviews = await this.prisma.review.findMany({
      where: { serviceId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

    const ratingDistribution = reviews.reduce(
      (acc, review) => {
        acc[review.rating as keyof typeof acc]++;
        return acc;
      },
      { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    );

    return {
      averageRating: Math.round(averageRating * 100) / 100,
      totalReviews,
      ratingDistribution,
    };
  }

  private async updateProviderRating(providerId: string): Promise<void> {
    const stats = await this.getProviderStats(providerId);
    
    await this.prisma.user.update({
      where: { id: providerId },
      data: {
        rating: stats.averageRating,
        reviewCount: stats.totalReviews,
      },
    });
  }

  private formatReviewResponse(review: any): ReviewResponseDto {
    return {
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      response: review.response,
      bookingId: review.bookingId,
      client: review.client,
      provider: review.provider,
      service: review.service,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    };
  }
} 