import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsEnum, IsBoolean, Min, Max, IsUrl, Length, IsLatitude, IsLongitude } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceCategory, ServiceStatus } from '@prisma/client';

export class CreateServiceDto {
  @ApiProperty({ description: 'Service title', example: 'Professional House Cleaning' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @ApiProperty({ description: 'Detailed service description', example: 'Complete house cleaning including all rooms, bathrooms, and kitchen' })
  @IsString()
  @IsNotEmpty()
  @Length(10, 2000)
  description: string;

  @ApiProperty({ 
    description: 'Service category', 
    enum: ServiceCategory,
    example: ServiceCategory.HOUSE_CLEANING
  })
  @IsEnum(ServiceCategory)
  category: ServiceCategory;

  @ApiProperty({ description: 'Service price in USD', example: 150.00 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(10000)
  price: number;

  @ApiProperty({ description: 'Service duration in minutes', example: 120 })
  @IsNumber()
  @Min(15)
  @Max(1440)
  duration: number;

  @ApiPropertyOptional({ description: 'Array of image URLs', example: ['https://example.com/image1.jpg'] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Service tags for better searchability', example: ['eco-friendly', 'deep-clean', 'weekly'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Service address', example: '123 Main St' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City where service is offered', example: 'Miami' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State (FL)', example: 'FL' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code', example: '33101' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Latitude coordinate', example: 25.7617 })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude coordinate', example: -80.1918 })
  @IsOptional()
  @IsLongitude()
  longitude?: number;
}

export class UpdateServiceDto {
  @ApiPropertyOptional({ description: 'Service title', example: 'Professional House Cleaning' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title?: string;

  @ApiPropertyOptional({ description: 'Detailed service description' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Length(10, 2000)
  description?: string;

  @ApiPropertyOptional({ 
    description: 'Service category', 
    enum: ServiceCategory
  })
  @IsOptional()
  @IsEnum(ServiceCategory)
  category?: ServiceCategory;

  @ApiPropertyOptional({ description: 'Service price in USD' })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(1)
  @Max(10000)
  price?: number;

  @ApiPropertyOptional({ description: 'Service duration in minutes' })
  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(1440)
  duration?: number;

  @ApiPropertyOptional({ description: 'Array of image URLs' })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({ description: 'Service tags' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ description: 'Service address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'City where service is offered' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State (FL)' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Latitude coordinate' })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude coordinate' })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ 
    description: 'Service status', 
    enum: ServiceStatus
  })
  @IsOptional()
  @IsEnum(ServiceStatus)
  status?: ServiceStatus;

  @ApiPropertyOptional({ description: 'Whether service is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ServiceResponseDto {
  @ApiProperty({ description: 'Service ID' })
  id: string;

  @ApiProperty({ description: 'Service title' })
  title: string;

  @ApiProperty({ description: 'Service description' })
  description: string;

  @ApiProperty({ description: 'Service category', enum: ServiceCategory })
  category: ServiceCategory;

  @ApiProperty({ description: 'Service price in USD' })
  price: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Service duration in minutes' })
  duration: number;

  @ApiProperty({ description: 'Array of image URLs' })
  images: string[];

  @ApiProperty({ description: 'Service status', enum: ServiceStatus })
  status: ServiceStatus;

  @ApiProperty({ description: 'Whether service is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Service tags' })
  tags: string[];

  @ApiPropertyOptional({ description: 'Service address' })
  address?: string;

  @ApiPropertyOptional({ description: 'City' })
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  state?: string;

  @ApiPropertyOptional({ description: 'ZIP code' })
  zipCode?: string;

  @ApiPropertyOptional({ description: 'Latitude' })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude' })
  longitude?: number;

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

export class ServiceSearchDto {
  @ApiPropertyOptional({ description: 'Search query', example: 'house cleaning' })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ 
    description: 'Service category', 
    enum: ServiceCategory
  })
  @IsOptional()
  @IsEnum(ServiceCategory)
  category?: ServiceCategory;

  @ApiPropertyOptional({ description: 'City filter', example: 'Miami' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'State filter', example: 'FL' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'Minimum price', example: 50 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Maximum price', example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: 'Latitude for location-based search' })
  @IsOptional()
  @IsLatitude()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude for location-based search' })
  @IsOptional()
  @IsLongitude()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Search radius in miles', example: 25 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  radius?: number;

  @ApiPropertyOptional({ description: 'Sort by field', enum: ['price', 'rating', 'createdAt', 'distance'] })
  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'rating' | 'createdAt' | 'distance';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';

  @ApiPropertyOptional({ description: 'Page number for pagination', example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Items per page', example: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @ApiPropertyOptional({ description: 'Filter by verified providers only' })
  @IsOptional()
  @IsBoolean()
  verifiedOnly?: boolean;

  @ApiPropertyOptional({ description: 'Filter by tags', example: ['eco-friendly', 'same-day'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}

export class ServiceListResponseDto {
  @ApiProperty({ description: 'List of services', type: [ServiceResponseDto] })
  services: ServiceResponseDto[];

  @ApiProperty({ description: 'Total number of services' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages: number;
}

export class ServiceCategoriesResponseDto {
  @ApiProperty({ description: 'List of available categories with counts' })
  categories: Array<{
    category: ServiceCategory;
    name: string;
    count: number;
    icon?: string;
  }>;
} 