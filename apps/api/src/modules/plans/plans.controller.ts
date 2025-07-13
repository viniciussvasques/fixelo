import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Query,
  UseGuards,
  Request,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@fixelo/common';
import { PrismaService } from '@fixelo/prisma';
import Stripe from 'stripe';

@Controller('plans')
export class PlansController {
  constructor(
    private readonly plansService: PlansService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  @Get()
  async getAllPlans(@Query('lang') language: string = 'en') {
    return this.plansService.getAllPlans(language);
  }

  @Get('comparison')
  async getPlanComparison(@Query('lang') language: string = 'en') {
    return this.plansService.getPlanComparison(language);
  }

  @Get(':planId')
  async getPlanById(@Param('planId') planId: string) {
    const plan = await this.plansService.getPlanById(planId);
    if (!plan) {
      throw new BadRequestException('Plan not found');
    }
    return plan;
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/current')
  async getCurrentUserPlan(@Request() req) {
    const userId = req.user.id;
    const userPlan = await this.plansService.getUserPlan(userId);
    const planDetails = await this.plansService.getPlanById(userPlan);
    
    return {
      success: true,
      currentPlan: userPlan,
      details: planDetails,
      type: userPlan, // Para compatibilidade com o frontend
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/limits')
  async getUserLimits(@Request() req) {
    const userId = req.user.id;
    return this.plansService.checkLeadLimits(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/usage')
  async getUserUsage(@Request() req) {
    const userId = req.user.id;
    return this.plansService.getUserUsage(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/rewards')
  async getUserRewards(@Request() req) {
    const userId = req.user.id;
    return this.plansService.calculateConversionRewards(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/rotation')
  async getRotationSchedule(@Request() req) {
    const userId = req.user.id;
    return this.plansService.getTopListRotationSchedule(userId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  @Post('upgrade/pro')
  async upgradeToPro(@Request() req) {
    const userId = req.user.id;
    const success = await this.plansService.upgradeToPro(userId);
    
    if (!success) {
      throw new BadRequestException('Failed to upgrade to PRO plan');
    }
    
    return {
      success: true,
      message: 'Successfully upgraded to PRO plan',
      plan: await this.plansService.getPlanById('PRO'),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  @Post('downgrade/free')
  async downgradeToFree(@Request() req) {
    const userId = req.user.id;
    const success = await this.plansService.downgradeToFree(userId);
    
    if (!success) {
      throw new BadRequestException('Failed to downgrade to FREE plan');
    }
    
    return {
      success: true,
      message: 'Successfully downgraded to FREE plan',
      plan: await this.plansService.getPlanById('FREE'),
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  @Post('checkout-session')
  async createCheckoutSession(@Request() req, @Body() body: { billingPeriod?: string }) {
    try {
      const STRIPE_PRO_MONTHLY_PRICE_ID = process.env.STRIPE_PRO_MONTHLY_PRICE_ID || 'price_1RkRdvBGcLQZk5D6haaPbGK8';
      const STRIPE_PRO_YEARLY_PRICE_ID = process.env.STRIPE_PRO_YEARLY_PRICE_ID || 'price_1RkRdvBGcLQZk5D6bhTBWT5J';
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      
      console.log('✅ PlansController - STRIPE_SECRET_KEY:', stripeSecretKey?.substring(0, 20) + '...');
      console.log('✅ PlansController - Comprimento:', stripeSecretKey?.length);
      
      if (!stripeSecretKey || stripeSecretKey.length < 50) {
        throw new BadRequestException('Chave do Stripe não configurada corretamente.');
      }
      
      const stripe = new Stripe(stripeSecretKey, { apiVersion: '2023-10-16' });
      const user = req.user;
      const billingPeriod = body.billingPeriod || 'monthly';
      
      // Selecionar o preço baseado no período de cobrança
      const priceId = billingPeriod === 'yearly' ? STRIPE_PRO_YEARLY_PRICE_ID : STRIPE_PRO_MONTHLY_PRICE_ID;
      
      // Criar sessão do Stripe Checkout
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pt/dashboard/subscription?success=1`,
        cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pt/dashboard/subscription?canceled=1`,
        customer_email: user.email,
        metadata: {
          userId: user.id,
          planType: 'PRO',
          billingPeriod: billingPeriod,
        },
      });
      
      return {
        success: true,
        data: {
          url: session.url,
          sessionId: session.id,
        },
      };
    } catch (error) {
      console.error('Erro ao criar sessão Stripe:', error);
      throw new BadRequestException(`Erro ao criar sessão de pagamento: ${error.message}`);
    }
  }

  // TEMPORÁRIO: Endpoint para simular webhook em ambiente de desenvolvimento
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  @Post('simulate-payment-success')
  async simulatePaymentSuccess(@Request() req) {
    try {
      const user = req.user;
      console.log('🎯 Simulando sucesso do pagamento para usuário:', user.id);
      
      // Atualizar plano do usuário para PRO
      const updatedUser = await this.prisma.user.update({
        where: { id: user.id },
        data: { 
          planType: 'PRO',
          planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        },
      });
      
      console.log('✅ Usuário atualizado para PRO:', updatedUser.planType);
      
      return {
        success: true,
        message: 'Plano atualizado para PRO com sucesso!',
        planType: updatedUser.planType,
        planExpiresAt: updatedUser.planExpiresAt
      };
    } catch (error) {
      console.error('❌ Erro ao simular pagamento:', error);
      throw new BadRequestException(`Erro ao atualizar plano: ${error.message}`);
    }
  }

  // Admin endpoints
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('admin/stats')
  async getAdminStats() {
    // TODO: Implement admin statistics
    return {
      totalUsers: 0,
      freeUsers: 0,
      proUsers: 0,
      monthlyRevenue: 0,
      conversionRate: 0,
      averageLeadsPerUser: 0,
      topPerformingCategories: [],
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Put('admin/user/:userId/plan/:planId')
  async updateUserPlan(
    @Param('userId') userId: string,
    @Param('planId') planId: string,
  ) {
    const plan = await this.plansService.getPlanById(planId);
    if (!plan) {
      throw new BadRequestException('Invalid plan ID');
    }

    let success = false;
    if (planId.toUpperCase() === 'PRO') {
      success = await this.plansService.upgradeToPro(userId);
    } else {
      success = await this.plansService.downgradeToFree(userId);
    }

    if (!success) {
      throw new BadRequestException('Failed to update user plan');
    }

    return {
      success: true,
      message: `User plan updated to ${planId.toUpperCase()}`,
      userId,
      newPlan: planId.toUpperCase(),
    };
  }
}