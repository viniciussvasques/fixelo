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
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@fixelo/common';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

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
      currentPlan: userPlan,
      details: planDetails,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('user/limits')
  async getUserLimits(@Request() req) {
    const userId = req.user.id;
    return this.plansService.checkLeadLimits(userId);
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