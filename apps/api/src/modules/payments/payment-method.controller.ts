import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentMethodService } from './payment-method.service';
import {
  CreatePaymentMethodDto,
  UpdatePaymentMethodDto,
  PaymentMethodResponseDto,
  SetupPaymentMethodDto,
  SetupPaymentMethodResponseDto,
} from './dto/payment-method.dto';

@ApiTags('Payment Methods')
@Controller('payment-methods')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentMethodController {
  constructor(private readonly paymentMethodService: PaymentMethodService) {}

  @Post('setup-intent')
  @ApiOperation({
    summary: 'Create setup intent for payment method',
    description: 'Creates a Stripe setup intent to collect payment method details securely',
  })
  @ApiResponse({
    status: 201,
    description: 'Setup intent created successfully',
    type: SetupPaymentMethodResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or Stripe error',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async createSetupIntent(
    @Request() req: any,
    @Body() dto: SetupPaymentMethodDto,
  ): Promise<SetupPaymentMethodResponseDto> {
    return this.paymentMethodService.createSetupIntent(req.user.sub, dto);
  }

  @Post()
  @ApiOperation({
    summary: 'Save payment method',
    description: 'Saves a payment method after successful setup intent confirmation',
  })
  @ApiResponse({
    status: 201,
    description: 'Payment method saved successfully',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid data or Stripe error',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method not found in Stripe',
  })
  @ApiResponse({
    status: 409,
    description: 'Payment method already exists',
  })
  async savePaymentMethod(
    @Request() req: any,
    @Body() dto: CreatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodService.savePaymentMethod(req.user.sub, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get user payment methods',
    description: 'Retrieves all active payment methods for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment methods retrieved successfully',
    type: [PaymentMethodResponseDto],
  })
  async getPaymentMethods(@Request() req: any): Promise<PaymentMethodResponseDto[]> {
    return this.paymentMethodService.getPaymentMethods(req.user.sub);
  }

  @Get('default')
  @ApiOperation({
    summary: 'Get default payment method',
    description: 'Retrieves the default payment method for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'Default payment method retrieved successfully',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No default payment method found',
  })
  async getDefaultPaymentMethod(@Request() req: any): Promise<PaymentMethodResponseDto | null> {
    return this.paymentMethodService.getDefaultPaymentMethod(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get payment method by ID',
    description: 'Retrieves a specific payment method by ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment method ID',
    example: 'pm_1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method retrieved successfully',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method not found',
  })
  async getPaymentMethod(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodService.getPaymentMethod(req.user.sub, id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update payment method',
    description: 'Updates payment method details (billing info, default status, etc.)',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment method ID',
    example: 'pm_1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method updated successfully',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method not found',
  })
  async updatePaymentMethod(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdatePaymentMethodDto,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodService.updatePaymentMethod(req.user.sub, id, dto);
  }

  @Put(':id/set-default')
  @ApiOperation({
    summary: 'Set payment method as default',
    description: 'Sets the specified payment method as the default for the user',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment method ID',
    example: 'pm_1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method set as default successfully',
    type: PaymentMethodResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method not found',
  })
  @HttpCode(HttpStatus.OK)
  async setAsDefault(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<PaymentMethodResponseDto> {
    return this.paymentMethodService.setAsDefault(req.user.sub, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete payment method',
    description: 'Deletes a payment method from both database and Stripe',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment method ID',
    example: 'pm_1234567890abcdef',
  })
  @ApiResponse({
    status: 204,
    description: 'Payment method deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method not found',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePaymentMethod(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.paymentMethodService.deletePaymentMethod(req.user.sub, id);
  }

  @Post(':id/validate')
  @ApiOperation({
    summary: 'Validate payment method for campaign',
    description: 'Validates if a payment method can be used for a campaign with specific budget',
  })
  @ApiParam({
    name: 'id',
    description: 'Payment method ID',
    example: 'pm_1234567890abcdef',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment method validation result',
    schema: {
      type: 'object',
      properties: {
        valid: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Payment method is valid for campaign' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Payment method not found',
  })
  async validatePaymentMethod(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: { budgetAmount: number },
  ): Promise<{ valid: boolean; message: string }> {
    const isValid = await this.paymentMethodService.validatePaymentMethodForCampaign(
      req.user.sub,
      id,
      body.budgetAmount,
    );

    return {
      valid: isValid,
      message: isValid
        ? 'Payment method is valid for campaign'
        : 'Payment method validation failed',
    };
  }
} 