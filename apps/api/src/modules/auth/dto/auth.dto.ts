import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsPhoneNumber, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@fixelo/common';

export class RegisterDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+14079538380', required: false })
  @IsOptional()
  @Matches(/^(\+1|1)?[2-9]\d{2}[2-9]\d{2}\d{4}$/, {
    message: 'Phone number must be a valid US phone number (e.g., +14079538380, 14079538380, or 4079538380)'
  })
  phone?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CLIENT })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ example: 'Miami', required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: 'FL', required: false })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: 'en', required: false })
  @IsOptional()
  @IsString()
  preferredLanguage?: string;
}

export class LoginDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  refreshToken: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  refreshToken: string;

  @ApiProperty({ example: 3600 })
  expiresIn: number;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'CLIENT'
    }
  })
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
} 