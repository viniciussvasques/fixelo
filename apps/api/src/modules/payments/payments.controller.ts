import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  Request,
  HttpStatus,
  HttpCode,
  Req,
  Res
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentsService } from './payments.service';
import { 
  ProcessPaymentDto, 
  PaymentResponseDto, 
  RefundPaymentDto, 
  SubscriptionDto, 
  LeadPurchaseDto, 
  BoostCampaignDto 
} from './dto/payment.dto';
import Stripe from 'stripe';
import { PlanType } from '@prisma/client';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('process')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Process payment',
    description: 'Process payment using various methods: Stripe, Apple Pay, Google Pay, App Store, Play Store'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment processed successfully',
    type: PaymentResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid payment data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async processPayment(
    @Request() req: any,
    @Body() paymentData: ProcessPaymentDto
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.processPayment(req.user.id, paymentData);
  }

  @Post('subscription')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Create PRO subscription',
    description: 'Create a PRO subscription with optional trial period and coupon'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Subscription created successfully',
    type: PaymentResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid subscription data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSubscription(
    @Request() req: any,
    @Body() subscriptionData: SubscriptionDto
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.createSubscription(req.user.id, subscriptionData);
  }

  @Post('leads/purchase')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Purchase extra leads',
    description: 'Purchase additional leads for FREE plan users ($3.00 per lead)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Leads purchased successfully',
    type: PaymentResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid lead purchase data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async purchaseLeads(
    @Request() req: any,
    @Body() leadData: LeadPurchaseDto
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.purchaseLeads(req.user.id, leadData);
  }

  @Post('boost/campaign')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Create boost campaign',
    description: 'Create a boost campaign to promote a service in search results'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Boost campaign created successfully',
    type: PaymentResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid boost campaign data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createBoostCampaign(
    @Request() req: any,
    @Body() boostData: BoostCampaignDto
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.createBoostCampaign(req.user.id, boostData);
  }

  @Post('refund')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Refund payment',
    description: 'Process a refund for a completed payment'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Refund processed successfully',
    type: PaymentResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid refund data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async refundPayment(
    @Body() refundData: RefundPaymentDto
  ): Promise<PaymentResponseDto> {
    return this.paymentsService.refundPayment(refundData);
  }

  @Get('history')
  @ApiOperation({ 
    summary: 'Get payment history',
    description: 'Retrieve payment history for the authenticated user'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment history retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        payments: {
          type: 'array',
          items: { $ref: '#/components/schemas/PaymentResponseDto' }
        },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' },
            total: { type: 'number' },
            pages: { type: 'number' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getPaymentHistory(
    @Request() req: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20
  ) {
    return this.paymentsService.getPaymentHistory(req.user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get payment details',
    description: 'Retrieve details of a specific payment'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Payment details retrieved successfully',
    type: PaymentResponseDto 
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPaymentDetails(
    @Param('id') paymentId: string
  ): Promise<PaymentResponseDto> {
    // This would need to be implemented in the service
    throw new Error('Method not implemented');
  }

  // Webhook endpoints for payment providers
  @Post('webhook/stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Stripe webhook',
    description: 'Handle Stripe webhook events'
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleStripeWebhook(@Req() req, @Res() res) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });
    const sig = req.headers['stripe-signature'];
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Processar evento de subscription ativada
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      // Atualizar plano do usuário para PRO
      if (userId) {
        await this.paymentsService.updateUserPlan(userId, PlanType.PRO);
      }
    }
    res.status(200).json({ received: true });
  }

  @Post('webhook/apple')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Apple App Store webhook',
    description: 'Handle Apple App Store Server-to-Server notifications'
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleAppleWebhook(@Body() webhookData: any) {
    // Handle Apple App Store webhook events
    return { received: true };
  }

  @Post('webhook/google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Google Play webhook',
    description: 'Handle Google Play Developer notifications'
  })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleGoogleWebhook(@Body() webhookData: any) {
    // Handle Google Play webhook events
    return { received: true };
  }
} 