import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@fixelo/prisma';
import Stripe from 'stripe';
import { 
  ProcessPaymentDto, 
  SubscriptionDto, 
  LeadPurchaseDto, 
  BoostCampaignDto, 
  RefundPaymentDto,
  PaymentResponseDto,
  PaymentMethod,
  PaymentType,
  PaymentStatus
} from './dto/payment.dto';
import { PlanType } from '@prisma/client';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService
  ) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    
    console.log('✅ PaymentsService - STRIPE_SECRET_KEY:', stripeSecretKey?.substring(0, 20) + '...');
    console.log('✅ PaymentsService - Comprimento:', stripeSecretKey?.length);
    
    if (!stripeSecretKey || stripeSecretKey.length < 50) {
      throw new Error('STRIPE_SECRET_KEY não está configurada corretamente');
    }
    
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      typescript: true
    });
  }

  /**
   * Process payment based on method
   */
  async processPayment(userId: string, paymentData: ProcessPaymentDto): Promise<PaymentResponseDto> {
    switch (paymentData.method) {
      case PaymentMethod.STRIPE_CARD:
        return this.processStripePayment(userId, paymentData);
      case PaymentMethod.APPLE_PAY:
        return this.processApplePayPayment(userId, paymentData);
      case PaymentMethod.GOOGLE_PAY:
        return this.processGooglePayPayment(userId, paymentData);
      case PaymentMethod.APP_STORE:
        return this.processAppStorePayment(userId, paymentData);
      case PaymentMethod.PLAY_STORE:
        return this.processPlayStorePayment(userId, paymentData);
      default:
        throw new BadRequestException('Unsupported payment method');
    }
  }

  /**
   * Process Stripe card payment
   */
  private async processStripePayment(userId: string, paymentData: ProcessPaymentDto): Promise<PaymentResponseDto> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: paymentData.amount,
      currency: paymentData.currency.toLowerCase(),
      payment_method: paymentData.stripe?.token,
      confirmation_method: 'manual',
      confirm: true,
      description: paymentData.description,
      metadata: {
        userId,
        type: paymentData.type
      }
    });

    // Save payment to database
    const payment = await this.prisma.transaction.create({
      data: {
        userId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        type: paymentData.type as any,
        status: 'COMPLETED',
        description: paymentData.description,
        stripePaymentIntentId: paymentIntent.id,
        metadata: JSON.stringify({
          method: paymentData.method,
          serviceId: paymentData.serviceId,
          bookingId: paymentData.bookingId,
          campaignId: paymentData.campaignId,
          stripeData: paymentIntent
        })
      }
    });

    return this.mapToPaymentResponse(payment);
  }

  /**
   * Process Apple Pay payment
   */
  private async processApplePayPayment(userId: string, paymentData: ProcessPaymentDto): Promise<PaymentResponseDto> {
    if (!paymentData.applePay) {
      throw new BadRequestException('Apple Pay data is required');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: paymentData.amount,
      currency: paymentData.currency.toLowerCase(),
      payment_method: paymentData.applePay.token,
      confirmation_method: 'manual',
      confirm: true,
      description: paymentData.description,
      metadata: {
        userId,
        type: paymentData.type,
        applePayTransactionId: paymentData.applePay.transactionId
      }
    });

    const payment = await this.prisma.transaction.create({
      data: {
        userId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        type: paymentData.type as any,
        status: 'COMPLETED',
        description: paymentData.description,
        stripePaymentIntentId: paymentIntent.id,
        metadata: JSON.stringify({
          method: paymentData.method,
          serviceId: paymentData.serviceId,
          bookingId: paymentData.bookingId,
          campaignId: paymentData.campaignId,
          stripePaymentIntent: paymentIntent,
          applePayTransactionId: paymentData.applePay.transactionId
        })
      }
    });

    return this.mapToPaymentResponse(payment);
  }

  /**
   * Process Google Pay payment
   */
  private async processGooglePayPayment(userId: string, paymentData: ProcessPaymentDto): Promise<PaymentResponseDto> {
    if (!paymentData.googlePay) {
      throw new BadRequestException('Google Pay data is required');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: paymentData.amount,
      currency: paymentData.currency.toLowerCase(),
      payment_method: paymentData.googlePay.token,
      confirmation_method: 'manual',
      confirm: true,
      description: paymentData.description,
      metadata: {
        userId,
        type: paymentData.type,
        googlePayTransactionId: paymentData.googlePay.transactionId
      }
    });

    const payment = await this.prisma.transaction.create({
      data: {
        userId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        type: paymentData.type as any,
        status: 'COMPLETED',
        description: paymentData.description,
        stripePaymentIntentId: paymentIntent.id,
        metadata: JSON.stringify({
          method: paymentData.method,
          serviceId: paymentData.serviceId,
          bookingId: paymentData.bookingId,
          campaignId: paymentData.campaignId,
          stripePaymentIntent: paymentIntent,
          googlePayTransactionId: paymentData.googlePay.transactionId
        })
      }
    });

    return this.mapToPaymentResponse(payment);
  }

  /**
   * Process App Store In-App Purchase
   */
  private async processAppStorePayment(userId: string, paymentData: ProcessPaymentDto): Promise<PaymentResponseDto> {
    if (!paymentData.appStore) {
      throw new BadRequestException('App Store receipt data is required');
    }

    // Validate receipt with Apple
    const isValid = await this.validateAppStoreReceipt(paymentData.appStore.receiptData);
    if (!isValid) {
      throw new BadRequestException('Invalid App Store receipt');
    }

    const payment = await this.prisma.transaction.create({
      data: {
        userId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        type: paymentData.type as any,
        status: 'COMPLETED',
        description: paymentData.description,
        stripeChargeId: paymentData.appStore.transactionId,
        metadata: JSON.stringify({
          method: paymentData.method,
          serviceId: paymentData.serviceId,
          bookingId: paymentData.bookingId,
          campaignId: paymentData.campaignId,
          appStoreReceipt: paymentData.appStore.receiptData,
          productId: paymentData.appStore.productId
        })
      }
    });

    // Handle subscription or product purchase
    if (paymentData.type === PaymentType.PRO_SUBSCRIPTION) {
      await this.handleSubscriptionPurchase(userId, paymentData.appStore.productId);
    }

    return this.mapToPaymentResponse(payment);
  }

  /**
   * Process Play Store In-App Purchase
   */
  private async processPlayStorePayment(userId: string, paymentData: ProcessPaymentDto): Promise<PaymentResponseDto> {
    if (!paymentData.playStore) {
      throw new BadRequestException('Play Store receipt data is required');
    }

    // Validate purchase with Google Play
    const isValid = await this.validatePlayStorePurchase(
      paymentData.playStore.packageName,
      paymentData.playStore.productId,
      paymentData.playStore.purchaseToken
    );
    if (!isValid) {
      throw new BadRequestException('Invalid Play Store purchase');
    }

    const payment = await this.prisma.transaction.create({
      data: {
        userId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        type: paymentData.type as any,
        status: 'COMPLETED',
        description: paymentData.description,
        stripeChargeId: paymentData.playStore.purchaseToken,
        metadata: JSON.stringify({
          method: paymentData.method,
          serviceId: paymentData.serviceId,
          bookingId: paymentData.bookingId,
          campaignId: paymentData.campaignId,
          playStorePurchaseToken: paymentData.playStore.purchaseToken,
          productId: paymentData.playStore.productId,
          packageName: paymentData.playStore.packageName
        })
      }
    });

    // Handle subscription or product purchase
    if (paymentData.type === PaymentType.PRO_SUBSCRIPTION) {
      await this.handleSubscriptionPurchase(userId, paymentData.playStore.productId);
    }

    return this.mapToPaymentResponse(payment);
  }

  /**
   * Create PRO subscription
   */
  async createSubscription(userId: string, subscriptionData: SubscriptionDto): Promise<PaymentResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Create Stripe subscription
    const subscription = await this.stripe.subscriptions.create({
      customer: user.stripeCustomerId || await this.createStripeCustomer(user),
      items: [{ price: subscriptionData.planId }],
      trial_period_days: subscriptionData.trialDays,
      metadata: { userId }
    });

    // Update user plan
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        planType: 'PRO',
        subscriptionId: subscription.id,
        subscriptionStatus: 'active'
      }
    });

    const payment = await this.prisma.transaction.create({
      data: {
        userId,
        amount: 3480, // $34.80 in cents
        currency: 'USD',
        type: 'SUBSCRIPTION',
        status: 'COMPLETED',
        description: 'PRO Subscription',
        stripeChargeId: subscription.id,
        metadata: JSON.stringify({
          method: 'STRIPE_CARD',
          subscriptionData: subscription
        })
      }
    });

    return this.mapToPaymentResponse(payment);
  }

  /**
   * Purchase extra leads
   */
  async purchaseLeads(userId: string, leadData: LeadPurchaseDto): Promise<PaymentResponseDto> {
    const totalAmount = leadData.quantity * 300; // $3.00 per lead in cents

    const payment = await this.prisma.transaction.create({
      data: {
        userId,
        amount: totalAmount,
        currency: 'USD',
        type: 'LEAD_PURCHASE',
        status: 'PENDING',
        description: `Purchase ${leadData.quantity} leads`,
        stripeChargeId: `lead_${Date.now()}`,
        metadata: JSON.stringify({
          method: 'STRIPE_CARD',
          leadData: leadData
        })
      }
    });

    // Update user lead count
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        leadCount: { increment: leadData.quantity }
      }
    });

    return this.mapToPaymentResponse(payment);
  }

  /**
   * Create boost campaign
   */
  async createBoostCampaign(userId: string, boostData: BoostCampaignDto): Promise<PaymentResponseDto> {
    const totalAmount = boostData.dailyBudget * boostData.duration;

    const payment = await this.prisma.transaction.create({
      data: {
        userId,
        amount: totalAmount,
        currency: 'USD',
        type: 'BOOST',
        status: 'COMPLETED',
        description: `Boost campaign for ${boostData.duration} days`,
        stripeChargeId: `boost_${Date.now()}`,
        metadata: JSON.stringify({
          method: 'STRIPE_CARD',
          serviceId: boostData.serviceId,
          boostData: boostData
        })
      }
    });

    // Create ad campaign
    await this.prisma.adCampaign.create({
      data: {
        providerId: userId,
        serviceId: boostData.serviceId,
        name: `Boost Campaign - ${boostData.serviceId}`,
        adType: 'BOOST',
        status: 'ACTIVE',
        budget: totalAmount,
        budgetType: 'DAILY',
        startDate: new Date(),
        endDate: new Date(Date.now() + boostData.duration * 24 * 60 * 60 * 1000),
        targeting: JSON.stringify({ cities: boostData.targetCities })
      }
    });

    return this.mapToPaymentResponse(payment);
  }

  /**
   * Refund payment
   */
  async refundPayment(refundData: RefundPaymentDto): Promise<PaymentResponseDto> {
    const payment = await this.prisma.transaction.findUnique({
      where: { id: refundData.paymentId }
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const paymentMetadata = payment.metadata ? JSON.parse(payment.metadata) : {};
    
    if (paymentMetadata.method === 'STRIPE_CARD' || 
        paymentMetadata.method === 'APPLE_PAY' || 
        paymentMetadata.method === 'GOOGLE_PAY') {
      
      // Refund through Stripe
      await this.stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId || payment.stripeChargeId,
        amount: refundData.amount || payment.amount,
        reason: 'requested_by_customer',
        metadata: { reason: refundData.reason || 'Customer request' }
      });
    }

    // Update payment status
    const updatedPayment = await this.prisma.transaction.update({
      where: { id: refundData.paymentId },
      data: { 
        status: 'REFUNDED',
        metadata: JSON.stringify({
          ...paymentMetadata,
          refundReason: refundData.reason,
          refundAmount: refundData.amount || payment.amount,
          refundDate: new Date()
        })
      }
    });

    return this.mapToPaymentResponse(updatedPayment);
  }

  /**
   * Get payment history
   */
  async getPaymentHistory(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    
    const [payments, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      this.prisma.transaction.count({ where: { userId } })
    ]);

    return {
      payments: payments.map(payment => this.mapToPaymentResponse(payment)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Helper methods
   */
  private async createStripeCustomer(user: any): Promise<string> {
    const customer = await this.stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id }
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { stripeCustomerId: customer.id }
    });

    return customer.id;
  }

  private async validateAppStoreReceipt(receiptData: string): Promise<boolean> {
    // Implement Apple receipt validation
    // This would typically involve calling Apple's receipt validation API
    return true; // Simplified for now
  }

  private async validatePlayStorePurchase(packageName: string, productId: string, purchaseToken: string): Promise<boolean> {
    // Implement Google Play purchase validation
    // This would typically involve calling Google Play Developer API
    return true; // Simplified for now
  }

  private async handleSubscriptionPurchase(userId: string, productId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { 
        planType: 'PRO',
        subscriptionStatus: 'active'
      }
    });
  }

  async updateUserPlan(userId: string, planType: PlanType) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { planType, planExpiresAt: planType === 'PRO' ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null },
    });
    return true;
  }

  private mapToPaymentResponse(payment: any): PaymentResponseDto {
    const metadata = payment.metadata ? JSON.parse(payment.metadata) : {};
    return {
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      currency: payment.currency,
      method: metadata.method,
      type: payment.type,
      transactionId: payment.stripePaymentIntentId || payment.stripeChargeId,
      metadata: metadata,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt
    };
  }
}