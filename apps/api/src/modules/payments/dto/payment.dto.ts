import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNumber, IsOptional, IsBoolean, IsObject } from 'class-validator';

export enum PaymentMethod {
  STRIPE_CARD = 'stripe_card',
  APPLE_PAY = 'apple_pay',
  GOOGLE_PAY = 'google_pay',
  APP_STORE = 'app_store',
  PLAY_STORE = 'play_store'
}

export enum PaymentType {
  SERVICE_BOOKING = 'service_booking',
  LEAD_PURCHASE = 'lead_purchase',
  PRO_SUBSCRIPTION = 'pro_subscription',
  BOOST_CAMPAIGN = 'boost_campaign',
  EXTRA_LEADS = 'extra_leads'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export class CreatePaymentDto {
  @ApiProperty({ enum: PaymentMethod, description: 'Payment method' })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiProperty({ enum: PaymentType, description: 'Payment type' })
  @IsEnum(PaymentType)
  type!: PaymentType;

  @ApiProperty({ description: 'Amount in cents (USD)', example: 2999 })
  @IsNumber()
  amount!: number;

  @ApiProperty({ description: 'Currency', example: 'USD' })
  @IsString()
  currency!: string;

  @ApiProperty({ description: 'Payment description', example: 'Residential cleaning booking' })
  @IsString()
  description!: string;

  @ApiProperty({ description: 'Related service ID', required: false })
  @IsOptional()
  @IsString()
  serviceId?: string;

  @ApiProperty({ description: 'Related booking ID', required: false })
  @IsOptional()
  @IsString()
  bookingId?: string;

  @ApiProperty({ description: 'Related ADS campaign ID', required: false })
  @IsOptional()
  @IsString()
  campaignId?: string;

  @ApiProperty({ description: 'Payment method specific data', required: false })
  @IsOptional()
  @IsObject()
  paymentData?: any;
}

export class StripePaymentDto {
  @ApiProperty({ description: 'Stripe card token' })
  @IsString()
  token!: string;

  @ApiProperty({ description: 'Stripe customer ID', required: false })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ description: 'Save card for future use', default: false })
  @IsOptional()
  @IsBoolean()
  saveCard?: boolean;
}

export class ApplePayDto {
  @ApiProperty({ description: 'Apple Pay token' })
  @IsString()
  token!: string;

  @ApiProperty({ description: 'Apple Pay transaction ID' })
  @IsString()
  transactionId!: string;
}

export class GooglePayDto {
  @ApiProperty({ description: 'Google Pay token' })
  @IsString()
  token!: string;

  @ApiProperty({ description: 'Google Pay transaction ID' })
  @IsString()
  transactionId!: string;
}

export class AppStoreReceiptDto {
  @ApiProperty({ description: 'App Store receipt data' })
  @IsString()
  receiptData!: string;

  @ApiProperty({ description: 'Product ID purchased' })
  @IsString()
  productId!: string;

  @ApiProperty({ description: 'Transaction ID' })
  @IsString()
  transactionId!: string;
}

export class PlayStoreReceiptDto {
  @ApiProperty({ description: 'Play Store purchase token' })
  @IsString()
  purchaseToken!: string;

  @ApiProperty({ description: 'Product ID purchased' })
  @IsString()
  productId!: string;

  @ApiProperty({ description: 'App package name' })
  @IsString()
  packageName!: string;
}

export class ProcessPaymentDto extends CreatePaymentDto {
  @ApiProperty({ description: 'Stripe payment data', required: false })
  @IsOptional()
  stripe?: StripePaymentDto;

  @ApiProperty({ description: 'Apple Pay payment data', required: false })
  @IsOptional()
  applePay?: ApplePayDto;

  @ApiProperty({ description: 'Google Pay payment data', required: false })
  @IsOptional()
  googlePay?: GooglePayDto;

  @ApiProperty({ description: 'App Store receipt data', required: false })
  @IsOptional()
  appStore?: AppStoreReceiptDto;

  @ApiProperty({ description: 'Play Store receipt data', required: false })
  @IsOptional()
  playStore?: PlayStoreReceiptDto;
}

export class PaymentResponseDto {
  @ApiProperty({ description: 'Payment ID' })
  id!: string;

  @ApiProperty({ enum: PaymentStatus, description: 'Payment status' })
  status!: PaymentStatus;

  @ApiProperty({ description: 'Amount in cents' })
  amount!: number;

  @ApiProperty({ description: 'Currency' })
  currency!: string;

  @ApiProperty({ enum: PaymentMethod, description: 'Payment method' })
  method!: PaymentMethod;

  @ApiProperty({ enum: PaymentType, description: 'Payment type' })
  type!: PaymentType;

  @ApiProperty({ description: 'Provider transaction ID' })
  transactionId!: string;

  @ApiProperty({ description: 'Additional payment metadata', required: false })
  metadata?: any;

  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;

  @ApiProperty({ description: 'Update date' })
  updatedAt!: Date;
}

export class RefundPaymentDto {
  @ApiProperty({ description: 'Payment ID to refund' })
  @IsString()
  paymentId!: string;

  @ApiProperty({ description: 'Amount to refund in cents (optional - defaults to full amount)', required: false })
  @IsOptional()
  @IsNumber()
  amount?: number;

  @ApiProperty({ description: 'Refund reason', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class SubscriptionDto {
  @ApiProperty({ description: 'Subscription plan ID' })
  @IsString()
  planId!: string;

  @ApiProperty({ description: 'Trial period in days', required: false })
  @IsOptional()
  @IsNumber()
  trialDays?: number;

  @ApiProperty({ description: 'Apply discount coupon', required: false })
  @IsOptional()
  @IsString()
  couponCode?: string;
}

export class LeadPurchaseDto {
  @ApiProperty({ description: 'Number of leads to purchase' })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ description: 'Service category for leads', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ description: 'Location for leads', required: false })
  @IsOptional()
  @IsString()
  location?: string;
}

export class BoostCampaignDto {
  @ApiProperty({ description: 'Service ID to boost' })
  @IsString()
  serviceId!: string;

  @ApiProperty({ description: 'Boost duration in days' })
  @IsNumber()
  duration!: number;

  @ApiProperty({ description: 'Daily boost budget in cents' })
  @IsNumber()
  dailyBudget!: number;

  @ApiProperty({ description: 'Target cities for boost', required: false })
  @IsOptional()
  @IsString()
  targetCities?: string;
} 