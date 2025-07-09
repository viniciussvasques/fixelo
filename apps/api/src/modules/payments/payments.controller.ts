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
  HttpCode
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
  async handleStripeWebhook(@Body() webhookData: any) {
    // Handle Stripe webhook events
    // This would typically verify the webhook signature and process events
    return { received: true };
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