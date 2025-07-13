import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '@fixelo/prisma';
import Stripe from 'stripe';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
  PaymentMethodResponseDto,
  SetupPaymentMethodDto,
  SetupPaymentMethodResponseDto,
  PaymentMethodType,
} from './dto/payment-method.dto';

@Injectable()
export class PaymentMethodService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not configured');
    }
    
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Create a setup intent for collecting payment method
   */
  async createSetupIntent(userId: string, dto: SetupPaymentMethodDto): Promise<SetupPaymentMethodResponseDto> {
    try {
      // Get or create Stripe customer
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          metadata: { userId },
        });

        customerId = customer.id;

        // Update user with Stripe customer ID
        await this.prisma.user.update({
          where: { id: userId },
          data: { stripeCustomerId: customerId },
        });
      }

      // Create setup intent
      const setupIntent = await this.stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        usage: 'off_session',
        return_url: dto.returnUrl,
      });

      return {
        clientSecret: setupIntent.client_secret!,
        setupIntentId: setupIntent.id,
        status: setupIntent.status,
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Save payment method after successful setup
   */
  async savePaymentMethod(userId: string, dto: CreatePaymentMethodDto): Promise<PaymentMethodResponseDto> {
    try {
      // Validate Stripe payment method
      const paymentMethod = await this.stripe.paymentMethods.retrieve(dto.stripeId);

      if (!paymentMethod) {
        throw new NotFoundException('Payment method not found in Stripe');
      }

      // Check if payment method already exists
      const existingPaymentMethod = await this.prisma.paymentMethod.findUnique({
        where: { stripeId: dto.stripeId },
      });

      if (existingPaymentMethod) {
        throw new ConflictException('Payment method already exists');
      }

      // If this is set as default, unset other defaults
      if (dto.isDefault) {
        await this.prisma.paymentMethod.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      // Create payment method in database
      const savedPaymentMethod = await this.prisma.paymentMethod.create({
        data: {
          userId,
          stripeId: dto.stripeId,
          type: dto.type,
          last4: dto.last4,
          brand: dto.brand,
          expiryMonth: dto.expiryMonth,
          expiryYear: dto.expiryYear,
          isDefault: dto.isDefault || false,
          billingName: dto.billingName,
          billingEmail: dto.billingEmail,
          billingAddress: dto.billingAddress,
          billingCity: dto.billingCity,
          billingState: dto.billingState,
          billingZip: dto.billingZip,
          billingCountry: dto.billingCountry,
        },
      });

      return this.mapToResponseDto(savedPaymentMethod);
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new BadRequestException(`Stripe error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get all payment methods for a user
   */
  async getPaymentMethods(userId: string): Promise<PaymentMethodResponseDto[]> {
    const paymentMethods = await this.prisma.paymentMethod.findMany({
      where: { userId, isActive: true },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return paymentMethods.map(pm => this.mapToResponseDto(pm));
  }

  /**
   * Get a specific payment method
   */
  async getPaymentMethod(userId: string, paymentMethodId: string): Promise<PaymentMethodResponseDto> {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { id: paymentMethodId, userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    return this.mapToResponseDto(paymentMethod);
  }

  /**
   * Update payment method
   */
  async updatePaymentMethod(
    userId: string,
    paymentMethodId: string,
    dto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { id: paymentMethodId, userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    // If setting as default, unset other defaults
    if (dto.isDefault) {
      await this.prisma.paymentMethod.updateMany({
        where: { userId, isDefault: true, id: { not: paymentMethodId } },
        data: { isDefault: false },
      });
    }

    const updatedPaymentMethod = await this.prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: {
        isDefault: dto.isDefault,
        isActive: dto.isActive,
        billingName: dto.billingName,
        billingEmail: dto.billingEmail,
        billingAddress: dto.billingAddress,
        billingCity: dto.billingCity,
        billingState: dto.billingState,
        billingZip: dto.billingZip,
        billingCountry: dto.billingCountry,
      },
    });

    return this.mapToResponseDto(updatedPaymentMethod);
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { id: paymentMethodId, userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    try {
      // Detach from Stripe
      await this.stripe.paymentMethods.detach(paymentMethod.stripeId);
    } catch (error) {
      // Log error but don't fail the deletion
      console.error('Failed to detach payment method from Stripe:', error);
    }

    // Delete from database
    await this.prisma.paymentMethod.delete({
      where: { id: paymentMethodId },
    });

    // If this was the default, set another as default
    if (paymentMethod.isDefault) {
      const firstActive = await this.prisma.paymentMethod.findFirst({
        where: { userId, isActive: true },
        orderBy: { createdAt: 'desc' },
      });

      if (firstActive) {
        await this.prisma.paymentMethod.update({
          where: { id: firstActive.id },
          data: { isDefault: true },
        });
      }
    }
  }

  /**
   * Get default payment method for user
   */
  async getDefaultPaymentMethod(userId: string): Promise<PaymentMethodResponseDto | null> {
    const defaultPaymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { userId, isDefault: true, isActive: true },
    });

    return defaultPaymentMethod ? this.mapToResponseDto(defaultPaymentMethod) : null;
  }

  /**
   * Set payment method as default
   */
  async setAsDefault(userId: string, paymentMethodId: string): Promise<PaymentMethodResponseDto> {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { id: paymentMethodId, userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    // Unset other defaults
    await this.prisma.paymentMethod.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });

    // Set as default
    const updatedPaymentMethod = await this.prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isDefault: true },
    });

    return this.mapToResponseDto(updatedPaymentMethod);
  }

  /**
   * Validate payment method for campaign budget
   */
  async validatePaymentMethodForCampaign(
    userId: string,
    paymentMethodId: string,
    budgetAmount: number,
  ): Promise<boolean> {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: { id: paymentMethodId, userId, isActive: true },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    try {
      // Create a test payment intent to validate the payment method
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(budgetAmount * 100), // Convert to cents
        currency: 'usd',
        payment_method: paymentMethod.stripeId,
        confirmation_method: 'manual',
        capture_method: 'manual',
        confirm: true,
      });

      // Cancel the payment intent since it's just for validation
      if (paymentIntent.status === 'requires_capture') {
        await this.stripe.paymentIntents.cancel(paymentIntent.id);
      }

      return true;
    } catch (error) {
      console.error('Payment method validation failed:', error);
      return false;
    }
  }

  /**
   * Map database model to response DTO
   */
  private mapToResponseDto(paymentMethod: any): PaymentMethodResponseDto {
    return {
      id: paymentMethod.id,
      type: paymentMethod.type as PaymentMethodType,
      last4: paymentMethod.last4,
      brand: paymentMethod.brand,
      expiryMonth: paymentMethod.expiryMonth,
      expiryYear: paymentMethod.expiryYear,
      isDefault: paymentMethod.isDefault,
      isActive: paymentMethod.isActive,
      billingName: paymentMethod.billingName,
      billingEmail: paymentMethod.billingEmail,
      billingAddress: paymentMethod.billingAddress,
      billingCity: paymentMethod.billingCity,
      billingState: paymentMethod.billingState,
      billingZip: paymentMethod.billingZip,
      billingCountry: paymentMethod.billingCountry,
      createdAt: paymentMethod.createdAt,
      updatedAt: paymentMethod.updatedAt,
    };
  }
} 