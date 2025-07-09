import { IsString, IsBoolean, IsOptional, IsEnum, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum PaymentMethodType {
  CARD = 'CARD',
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
}

export class CreatePaymentMethodDto {
  @ApiProperty({
    description: 'Stripe payment method ID',
    example: 'pm_1234567890abcdef',
  })
  @IsString()
  stripeId: string;

  @ApiProperty({
    description: 'Type of payment method',
    enum: PaymentMethodType,
    example: PaymentMethodType.CARD,
  })
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @ApiProperty({
    description: 'Last 4 digits of the card',
    example: '4242',
  })
  @IsString()
  last4: string;

  @ApiProperty({
    description: 'Card brand (visa, mastercard, amex, etc.)',
    example: 'visa',
  })
  @IsString()
  brand: string;

  @ApiProperty({
    description: 'Expiry month (1-12)',
    example: 12,
  })
  @IsInt()
  @Min(1)
  @Max(12)
  expiryMonth: number;

  @ApiProperty({
    description: 'Expiry year (4 digits)',
    example: 2025,
  })
  @IsInt()
  @Min(new Date().getFullYear())
  expiryYear: number;

  @ApiPropertyOptional({
    description: 'Set as default payment method',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Billing name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  billingName?: string;

  @ApiPropertyOptional({
    description: 'Billing email',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsString()
  billingEmail?: string;

  @ApiPropertyOptional({
    description: 'Billing address',
    example: '123 Main St',
  })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiPropertyOptional({
    description: 'Billing city',
    example: 'Miami',
  })
  @IsOptional()
  @IsString()
  billingCity?: string;

  @ApiPropertyOptional({
    description: 'Billing state',
    example: 'FL',
  })
  @IsOptional()
  @IsString()
  billingState?: string;

  @ApiPropertyOptional({
    description: 'Billing ZIP code',
    example: '33101',
  })
  @IsOptional()
  @IsString()
  billingZip?: string;

  @ApiPropertyOptional({
    description: 'Billing country',
    example: 'US',
  })
  @IsOptional()
  @IsString()
  billingCountry?: string;
}

export class UpdatePaymentMethodDto {
  @ApiPropertyOptional({
    description: 'Set as default payment method',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Activate/deactivate payment method',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Billing name',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  billingName?: string;

  @ApiPropertyOptional({
    description: 'Billing email',
    example: 'john@example.com',
  })
  @IsOptional()
  @IsString()
  billingEmail?: string;

  @ApiPropertyOptional({
    description: 'Billing address',
    example: '123 Main St',
  })
  @IsOptional()
  @IsString()
  billingAddress?: string;

  @ApiPropertyOptional({
    description: 'Billing city',
    example: 'Miami',
  })
  @IsOptional()
  @IsString()
  billingCity?: string;

  @ApiPropertyOptional({
    description: 'Billing state',
    example: 'FL',
  })
  @IsOptional()
  @IsString()
  billingState?: string;

  @ApiPropertyOptional({
    description: 'Billing ZIP code',
    example: '33101',
  })
  @IsOptional()
  @IsString()
  billingZip?: string;

  @ApiPropertyOptional({
    description: 'Billing country',
    example: 'US',
  })
  @IsOptional()
  @IsString()
  billingCountry?: string;
}

export class PaymentMethodResponseDto {
  @ApiProperty({
    description: 'Payment method ID',
    example: 'pm_1234567890abcdef',
  })
  id: string;

  @ApiProperty({
    description: 'Type of payment method',
    enum: PaymentMethodType,
    example: PaymentMethodType.CARD,
  })
  type: PaymentMethodType;

  @ApiProperty({
    description: 'Last 4 digits of the card',
    example: '4242',
  })
  last4: string;

  @ApiProperty({
    description: 'Card brand (visa, mastercard, amex, etc.)',
    example: 'visa',
  })
  brand: string;

  @ApiProperty({
    description: 'Expiry month (1-12)',
    example: 12,
  })
  expiryMonth: number;

  @ApiProperty({
    description: 'Expiry year (4 digits)',
    example: 2025,
  })
  expiryYear: number;

  @ApiProperty({
    description: 'Is default payment method',
    example: true,
  })
  isDefault: boolean;

  @ApiProperty({
    description: 'Is payment method active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Billing name',
    example: 'John Doe',
  })
  billingName?: string;

  @ApiPropertyOptional({
    description: 'Billing email',
    example: 'john@example.com',
  })
  billingEmail?: string;

  @ApiPropertyOptional({
    description: 'Billing address',
    example: '123 Main St',
  })
  billingAddress?: string;

  @ApiPropertyOptional({
    description: 'Billing city',
    example: 'Miami',
  })
  billingCity?: string;

  @ApiPropertyOptional({
    description: 'Billing state',
    example: 'FL',
  })
  billingState?: string;

  @ApiPropertyOptional({
    description: 'Billing ZIP code',
    example: '33101',
  })
  billingZip?: string;

  @ApiPropertyOptional({
    description: 'Billing country',
    example: 'US',
  })
  billingCountry?: string;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;
}

export class SetupPaymentMethodDto {
  @ApiProperty({
    description: 'Return URL after payment setup',
    example: 'https://yourapp.com/payment-setup/success',
  })
  @IsString()
  returnUrl: string;

  @ApiPropertyOptional({
    description: 'Set as default payment method after setup',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  setAsDefault?: boolean;
}

export class SetupPaymentMethodResponseDto {
  @ApiProperty({
    description: 'Setup Intent client secret',
    example: 'seti_1234567890abcdef_secret_xyz',
  })
  clientSecret: string;

  @ApiProperty({
    description: 'Setup Intent ID',
    example: 'seti_1234567890abcdef',
  })
  setupIntentId: string;

  @ApiProperty({
    description: 'Status of the setup intent',
    example: 'requires_payment_method',
  })
  status: string;
} 