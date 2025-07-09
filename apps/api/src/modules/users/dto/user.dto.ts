import { IsString, IsEmail, IsOptional, IsEnum, IsBoolean, IsNumber, IsPhoneNumber, Length, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole, Language, PlanType } from '@fixelo/common';

export class CreateUserDto {
  @ApiPropertyOptional({ description: 'User email', example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'User phone number', example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'User password' })
  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;

  @ApiProperty({ description: 'User first name', example: 'John' })
  @IsString()
  @Length(1, 50)
  firstName: string;

  @ApiProperty({ description: 'User last name', example: 'Doe' })
  @IsString()
  @Length(1, 50)
  lastName: string;

  @ApiPropertyOptional({ description: 'User role', enum: UserRole, example: UserRole.CLIENT })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Business name (for providers)', example: 'John\'s Cleaning Service' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  businessName?: string;

  @ApiPropertyOptional({ description: 'User avatar URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: 'User city', example: 'Miami' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'User state', example: 'FL' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'User country', example: 'USA' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'ZIP code', example: '33101' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'User preferred language', enum: Language })
  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @ApiPropertyOptional({ description: 'User bio/description' })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  bio?: string;

  @ApiPropertyOptional({ description: 'User address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Date of birth' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Latitude coordinate' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude coordinate' })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: 'User email' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ description: 'User phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: 'User password' })
  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;

  @ApiPropertyOptional({ description: 'User first name' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  firstName?: string;

  @ApiPropertyOptional({ description: 'User last name' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  lastName?: string;

  @ApiPropertyOptional({ description: 'User role', enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiPropertyOptional({ description: 'Business name (for providers)' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  businessName?: string;

  @ApiPropertyOptional({ description: 'User avatar URL' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: 'User city' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: 'User state' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ description: 'User country' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: 'ZIP code' })
  @IsOptional()
  @IsString()
  zipCode?: string;

  @ApiPropertyOptional({ description: 'User preferred language', enum: Language })
  @IsOptional()
  @IsEnum(Language)
  preferredLanguage?: Language;

  @ApiPropertyOptional({ description: 'User bio/description' })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  bio?: string;

  @ApiPropertyOptional({ description: 'User address' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: 'Date of birth' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: 'Latitude coordinate' })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude coordinate' })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiPropertyOptional({ description: 'Whether user is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Whether user is verified' })
  @IsOptional()
  @IsBoolean()
  verified?: boolean;
}

export class ChangePasswordDto {
  @ApiProperty({ description: 'Current password' })
  @IsString()
  @Length(6, 100)
  currentPassword: string;

  @ApiProperty({ description: 'New password' })
  @IsString()
  @Length(6, 100)
  newPassword: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiPropertyOptional({ description: 'User email' })
  email?: string;

  @ApiPropertyOptional({ description: 'User phone number' })
  phone?: string;

  @ApiProperty({ description: 'User first name' })
  firstName: string;

  @ApiProperty({ description: 'User last name' })
  lastName: string;

  @ApiPropertyOptional({ description: 'Full name (computed)' })
  fullName?: string;

  @ApiPropertyOptional({ description: 'Display name (computed)' })
  displayName: string;

  @ApiProperty({ description: 'User role', enum: UserRole })
  role: UserRole;

  @ApiPropertyOptional({ description: 'Business name' })
  businessName?: string;

  @ApiPropertyOptional({ description: 'User avatar URL' })
  avatar?: string;

  @ApiPropertyOptional({ description: 'User city' })
  city?: string;

  @ApiPropertyOptional({ description: 'User state' })
  state?: string;

  @ApiPropertyOptional({ description: 'User country' })
  country?: string;

  @ApiPropertyOptional({ description: 'ZIP code' })
  zipCode?: string;

  @ApiProperty({ description: 'User preferred language', enum: Language })
  language: Language;

  @ApiPropertyOptional({ description: 'User bio/description' })
  bio?: string;

  @ApiPropertyOptional({ description: 'User address' })
  address?: string;

  @ApiPropertyOptional({ description: 'Date of birth' })
  dateOfBirth?: Date;

  @ApiPropertyOptional({ description: 'Latitude coordinate' })
  latitude?: number;

  @ApiPropertyOptional({ description: 'Longitude coordinate' })
  longitude?: number;

  @ApiProperty({ description: 'Whether user is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Whether user is verified' })
  verified: boolean;

  @ApiProperty({ description: 'User plan type', enum: PlanType })
  planType: PlanType;

  @ApiProperty({ description: 'Number of leads used' })
  leadsUsed: number;

  @ApiProperty({ description: 'Lead limit for current plan' })
  leadsLimit: number;

  @ApiProperty({ description: 'User rating' })
  rating: number;

  @ApiProperty({ description: 'Number of reviews' })
  reviewCount: number;

  @ApiPropertyOptional({ description: 'Total earnings (for providers)' })
  totalEarnings?: number;

  @ApiPropertyOptional({ description: 'Total spent (for clients)' })
  totalSpent?: number;

  @ApiProperty({ description: 'Whether email is verified' })
  emailVerified: boolean;

  @ApiPropertyOptional({ description: 'Whether phone is verified' })
  phoneVerified?: boolean;

  @ApiPropertyOptional({ description: 'Whether two-factor auth is enabled' })
  twoFactorEnabled?: boolean;

  @ApiProperty({ description: 'Last login date' })
  lastLoginAt: Date;

  @ApiProperty({ description: 'Account creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'User status', example: 'ACTIVE' })
  status: string;

  @ApiProperty({ description: 'Completed bookings (providers)', example: 0 })
  completedBookings: number;

  @ApiProperty({ description: 'Preferred language', example: 'en' })
  preferredLanguage: string;
}

export class UserListResponseDto {
  @ApiProperty({ description: 'List of users', type: [UserResponseDto] })
  users: UserResponseDto[];

  @ApiProperty({ description: 'Total number of users' })
  total: number;

  @ApiProperty({ description: 'Current page' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total pages' })
  totalPages: number;
} 