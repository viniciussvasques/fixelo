import { IsString, IsInt, IsOptional, IsUUID, IsNotEmpty, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ description: 'Review comment', required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ description: 'Booking ID', example: 'clh123...' })
  @IsUUID()
  @IsNotEmpty()
  bookingId: string;
}

export class UpdateReviewDto {
  @ApiProperty({ description: 'Rating from 1 to 5', minimum: 1, maximum: 5, required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ description: 'Review comment', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}

export class ReviewResponseDto {
  @ApiProperty({ description: 'Review ID' })
  id: string;

  @ApiProperty({ description: 'Rating from 1 to 5' })
  rating: number;

  @ApiProperty({ description: 'Review comment', required: false })
  comment?: string;

  @ApiProperty({ description: 'Provider response to review', required: false })
  response?: string;

  @ApiProperty({ description: 'Booking ID' })
  bookingId: string;

  @ApiProperty({ description: 'Client info' })
  client: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };

  @ApiProperty({ description: 'Provider info' })
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    businessName?: string;
    avatar?: string;
  };

  @ApiProperty({ description: 'Service info' })
  service: {
    id: string;
    title: string;
    category: string;
  };

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Update timestamp' })
  updatedAt: Date;
}

export class ProviderResponseDto {
  @ApiProperty({ description: 'Provider response to review' })
  @IsString()
  @IsNotEmpty()
  response: string;
}

export class ReviewStatsDto {
  @ApiProperty({ description: 'Average rating' })
  averageRating: number;

  @ApiProperty({ description: 'Total number of reviews' })
  totalReviews: number;

  @ApiProperty({ description: 'Rating distribution' })
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export class ReviewFiltersDto {
  @ApiProperty({ description: 'Filter by rating', required: false })
  @IsInt()
  @Min(1)
  @Max(5)
  @IsOptional()
  rating?: number;

  @ApiProperty({ description: 'Filter by service ID', required: false })
  @IsUUID()
  @IsOptional()
  serviceId?: string;

  @ApiProperty({ description: 'Filter by provider ID', required: false })
  @IsUUID()
  @IsOptional()
  providerId?: string;

  @ApiProperty({ description: 'Filter by client ID', required: false })
  @IsUUID()
  @IsOptional()
  clientId?: string;

  @ApiProperty({ description: 'Page number', default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', default: 10 })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  limit?: number = 10;
} 