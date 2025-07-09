import { IsString, IsDateString, IsOptional, IsNumber, IsEnum, IsPositive, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

// Enums locais (copiados do Prisma schema)
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  DISPUTED = 'DISPUTED'
}

export class CreateBookingDto {
  @ApiProperty({ description: 'Service ID to book' })
  @IsString()
  serviceId: string;

  @ApiProperty({ description: 'Scheduled date and time for the service' })
  @IsDateString()
  scheduledAt: string;

  @ApiPropertyOptional({ description: 'Duration in minutes (defaults to service duration)' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  duration?: number;

  @ApiPropertyOptional({ description: 'Additional notes for the booking' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Service address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Service city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Service state' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Service ZIP code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Service latitude' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Service longitude' })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UpdateBookingDto {
  @ApiPropertyOptional({ description: 'New scheduled date and time' })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;

  @ApiPropertyOptional({ description: 'Updated duration in minutes' })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  duration?: number;

  @ApiPropertyOptional({ description: 'Updated notes' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ description: 'Updated address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Updated city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'Updated state' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Updated ZIP code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Updated latitude' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Updated longitude' })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UpdateBookingStatusDto {
  @ApiProperty({ description: 'New booking status', enum: BookingStatus })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}

export class CancelBookingDto {
  @ApiPropertyOptional({ description: 'Reason for cancellation' })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class BookingFilterDto {
  @ApiPropertyOptional({ description: 'Filter by booking status', enum: BookingStatus })
  @IsOptional()
  @IsEnum(BookingStatus)
  status?: BookingStatus;

  @ApiPropertyOptional({ description: 'Filter by payment status', enum: PaymentStatus })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @ApiPropertyOptional({ description: 'Filter by start date (ISO string)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Filter by end date (ISO string)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Filter by service ID' })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiPropertyOptional({ description: 'Filter by provider ID' })
  @IsOptional()
  @IsString()
  providerId?: string;

  @ApiPropertyOptional({ description: 'Filter by client ID' })
  @IsOptional()
  @IsString()
  clientId?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Sort field', default: 'scheduledAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'scheduledAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class BookingStatsResponseDto {
  @ApiProperty({ description: 'Total number of bookings' })
  totalBookings: number;

  @ApiProperty({ description: 'Number of pending bookings' })
  pendingBookings: number;

  @ApiProperty({ description: 'Number of confirmed bookings' })
  confirmedBookings: number;

  @ApiProperty({ description: 'Number of completed bookings' })
  completedBookings: number;

  @ApiProperty({ description: 'Number of cancelled bookings' })
  cancelledBookings: number;

  @ApiProperty({ description: 'Total revenue from completed bookings' })
  totalRevenue: number;
}

export class BookingResponseDto {
  @ApiProperty({ description: 'Booking ID' })
  id: string;

  @ApiProperty({ description: 'Booking status', enum: BookingStatus })
  status: BookingStatus;

  @ApiProperty({ description: 'Scheduled date and time' })
  scheduledAt: Date;

  @ApiProperty({ description: 'Duration in minutes' })
  duration: number;

  @ApiProperty({ description: 'Total amount' })
  totalAmount: number;

  @ApiProperty({ description: 'Currency' })
  currency: string;

  @ApiProperty({ description: 'Payment status', enum: PaymentStatus })
  paymentStatus: PaymentStatus;

  @ApiPropertyOptional({ description: 'Stripe payment intent ID' })
  paymentIntentId?: string;

  @ApiPropertyOptional({ description: 'Booking notes' })
  notes?: string;

  @ApiPropertyOptional({ description: 'Service address' })
  address?: string;

  @ApiPropertyOptional({ description: 'Service city' })
  city?: string;

  @ApiPropertyOptional({ description: 'Service state' })
  state?: string;

  @ApiPropertyOptional({ description: 'Service ZIP code' })
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Service latitude' })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Service longitude' })
  longitude?: number;

  @ApiProperty({ description: 'Service information' })
  service: {
    id: string;
    title: string;
    category: string;
    price: number;
    duration: number;
    images: string[];
  };

  @ApiProperty({ description: 'Client information' })
  client: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    phone?: string;
    email: string;
  };

  @ApiProperty({ description: 'Provider information' })
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    businessName?: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    verified: boolean;
  };

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

export class BookingListResponseDto {
  @ApiProperty({ description: 'List of bookings', type: [BookingResponseDto] })
  bookings: BookingResponseDto[];

  @ApiProperty({ description: 'Pagination information' })
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class CancelBookingResponseDto {
  @ApiProperty({ description: 'Updated booking information', type: BookingResponseDto })
  booking: BookingResponseDto;

  @ApiProperty({ description: 'Refund amount' })
  refundAmount: number;
} 