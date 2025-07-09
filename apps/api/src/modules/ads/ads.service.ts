import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@fixelo/common';
import { PaymentMethodService } from '../payments/payment-method.service';
import { 
  CreateAdCampaignDto, 
  UpdateAdCampaignDto, 
  CreateBoostDto, 
  AdCampaignFilterDto, 
  AdAnalyticsFilterDto,
  BidDto,
  PurchaseLeadsDto,
  UpgradePlanDto,
  AdType, 
  AdStatus, 
  BudgetType 
} from './dto/ads.dto';

@Injectable()
export class AdsService {
  constructor(
    private prisma: PrismaService,
    private paymentMethodService: PaymentMethodService,
  ) {}

  // ================== CAMPANHAS DE ADS ==================

  /**
   * Criar nova campanha de ADS
   */
  async createCampaign(createAdCampaignDto: CreateAdCampaignDto, providerId: string) {
    const { serviceId, name, description, adType, budget, budgetType, startDate, endDate, targeting, creative } = createAdCampaignDto;

    // Validar se o serviço pertence ao provider
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, providerId, isActive: true }
    });

    if (!service) {
      throw new NotFoundException('Service not found or not owned by provider');
    }

    // Validar se o provider tem plano PRO para certos tipos de anúncios
    const provider = await this.prisma.user.findUnique({
      where: { id: providerId }
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Validar permissões por tipo de anúncio
    const premiumAdTypes = [AdType.BANNER, AdType.TOP_SEARCH, AdType.PREMIUM_BADGE];
    if (premiumAdTypes.includes(adType) && provider.planType !== 'PRO') {
      throw new ForbiddenException('Premium ad types require PRO plan');
    }

    // Validar orçamento mínimo
    const minBudgets = {
      [AdType.BOOST]: 5,
      [AdType.FEATURED]: 10,
      [AdType.SPONSORED]: 15,
      [AdType.BANNER]: 25,
      [AdType.TOP_SEARCH]: 50,
      [AdType.PREMIUM_BADGE]: 20
    };

    if (budget < minBudgets[adType]) {
      throw new BadRequestException(`Minimum budget for ${adType} is $${minBudgets[adType]}`);
    }

    // Validar datas
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start <= new Date()) {
      throw new BadRequestException('Start date must be in the future');
    }
    
    if (end <= start) {
      throw new BadRequestException('End date must be after start date');
    }

    // Criar campanha
    const campaign = await this.prisma.adCampaign.create({
      data: {
        name,
        description,
        adType,
        status: AdStatus.DRAFT,
        budget,
        budgetType,
        spent: 0,
        impressions: 0,
        clicks: 0,
        leads: 0,
        conversions: 0,
        startDate: start,
        endDate: end,
        serviceId,
        providerId,
        targeting: targeting ? JSON.stringify(targeting) : null,
        creative: creative ? JSON.stringify(creative) : null
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
            images: true
          }
        }
      }
    });

    // Calcular métricas iniciais
    const metrics = this.calculateMetrics(campaign);

    return {
      ...campaign,
      targeting: campaign.targeting ? JSON.parse(campaign.targeting) : null,
      creative: campaign.creative ? JSON.parse(campaign.creative) : null,
      ...metrics
    };
  }

  /**
   * Listar campanhas com filtros
   */
  async findAllCampaigns(filters: AdCampaignFilterDto, providerId: string) {
    const {
      status,
      adType,
      startDate,
      endDate,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = filters;

    const skip = (page - 1) * limit;

    const where: any = { providerId };

    if (status) where.status = status;
    if (adType) where.adType = adType;
    
    if (startDate || endDate) {
      where.startDate = {};
      if (startDate) where.startDate.gte = new Date(startDate);
      if (endDate) where.startDate.lte = new Date(endDate);
    }

    const [campaigns, total] = await Promise.all([
      this.prisma.adCampaign.findMany({
        where,
        include: {
          service: {
            select: {
              id: true,
              title: true,
              category: true,
              price: true,
              images: true
            }
          }
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder }
      }),
      this.prisma.adCampaign.count({ where })
    ]);

    const campaignsWithMetrics = campaigns.map(campaign => ({
      ...campaign,
      targeting: campaign.targeting ? JSON.parse(campaign.targeting) : null,
      creative: campaign.creative ? JSON.parse(campaign.creative) : null,
      ...this.calculateMetrics(campaign)
    }));

    return {
      campaigns: campaignsWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Obter campanha por ID
   */
  async findOneCampaign(id: string, providerId: string) {
    const campaign = await this.prisma.adCampaign.findFirst({
      where: { id, providerId },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
            images: true
          }
        },
        bids: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!campaign) {
      throw new NotFoundException('Campaign not found');
    }

    return {
      ...campaign,
      targeting: campaign.targeting ? JSON.parse(campaign.targeting) : null,
      creative: campaign.creative ? JSON.parse(campaign.creative) : null,
      ...this.calculateMetrics(campaign)
    };
  }

  /**
   * Atualizar campanha
   */
  async updateCampaign(id: string, updateAdCampaignDto: UpdateAdCampaignDto, providerId: string) {
    const campaign = await this.findOneCampaign(id, providerId);

    if (campaign.status === AdStatus.ACTIVE) {
      // Apenas algumas propriedades podem ser atualizadas em campanhas ativas
      const allowedUpdates = ['budget', 'endDate', 'targeting', 'creative'];
      const updates = Object.keys(updateAdCampaignDto);
      const invalidUpdates = updates.filter(update => !allowedUpdates.includes(update));
      
      if (invalidUpdates.length > 0) {
        throw new BadRequestException(`Cannot update ${invalidUpdates.join(', ')} on active campaign`);
      }
    }

    const updateData: any = { ...updateAdCampaignDto };
    
    if (updateData.targeting) {
      updateData.targeting = JSON.stringify(updateData.targeting);
    }
    
    if (updateData.creative) {
      updateData.creative = JSON.stringify(updateData.creative);
    }

    const updatedCampaign = await this.prisma.adCampaign.update({
      where: { id },
      data: updateData,
      include: {
        service: {
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
            images: true
          }
        }
      }
    });

    return {
      ...updatedCampaign,
      targeting: updatedCampaign.targeting ? JSON.parse(updatedCampaign.targeting) : null,
      creative: updatedCampaign.creative ? JSON.parse(updatedCampaign.creative) : null,
      ...this.calculateMetrics(updatedCampaign)
    };
  }

  /**
   * Ativar campanha
   */
  async activateCampaign(id: string, providerId: string) {
    const campaign = await this.findOneCampaign(id, providerId);

    if (campaign.status !== AdStatus.DRAFT) {
      throw new BadRequestException('Only draft campaigns can be activated');
    }

    // Validar se o provider tem método de pagamento configurado
    const provider = await this.prisma.user.findUnique({
      where: { id: providerId }
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    // Verificar se tem método de pagamento padrão
    const defaultPaymentMethod = await this.paymentMethodService.getDefaultPaymentMethod(providerId);
    
    if (!defaultPaymentMethod) {
      throw new BadRequestException('No default payment method found. Please add a payment method before activating campaigns.');
    }

    // Validar se o método de pagamento pode processar o orçamento da campanha
    const isValidPaymentMethod = await this.paymentMethodService.validatePaymentMethodForCampaign(
      providerId,
      defaultPaymentMethod.id,
      campaign.budget
    );

    if (!isValidPaymentMethod) {
      throw new BadRequestException('Payment method validation failed. Please check your payment method or try a different one.');
    }

    // Atualizar campanha com método de pagamento
    const updatedCampaign = await this.prisma.adCampaign.update({
      where: { id },
      data: { 
        status: AdStatus.ACTIVE,
        activatedAt: new Date(),
        paymentMethodId: defaultPaymentMethod.id
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
            images: true
          }
        },
        paymentMethod: {
          select: {
            id: true,
            last4: true,
            brand: true,
            type: true
          }
        }
      }
    });

    // Iniciar processo de leilão se necessário
    if ([AdType.BANNER, AdType.TOP_SEARCH, AdType.FEATURED].includes(updatedCampaign.adType as AdType)) {
      await this.processAuctionBid(updatedCampaign);
    }

    return {
      ...updatedCampaign,
      targeting: updatedCampaign.targeting ? JSON.parse(updatedCampaign.targeting) : null,
      creative: updatedCampaign.creative ? JSON.parse(updatedCampaign.creative) : null,
      ...this.calculateMetrics(updatedCampaign)
    };
  }

  /**
   * Pausar campanha
   */
  async pauseCampaign(id: string, providerId: string) {
    const campaign = await this.findOneCampaign(id, providerId);

    if (campaign.status !== AdStatus.ACTIVE) {
      throw new BadRequestException('Only active campaigns can be paused');
    }

    const updatedCampaign = await this.prisma.adCampaign.update({
      where: { id },
      data: { status: AdStatus.PAUSED },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
            images: true
          }
        }
      }
    });

    return {
      ...updatedCampaign,
      targeting: updatedCampaign.targeting ? JSON.parse(updatedCampaign.targeting) : null,
      creative: updatedCampaign.creative ? JSON.parse(updatedCampaign.creative) : null,
      ...this.calculateMetrics(updatedCampaign)
    };
  }

  // ================== SISTEMA DE BOOST ==================

  /**
   * Criar boost rápido
   */
  async createBoost(createBoostDto: CreateBoostDto, providerId: string) {
    const { serviceId, duration, amount, boostType = AdType.BOOST } = createBoostDto;

    // Validar serviço
    const service = await this.prisma.service.findFirst({
      where: { id: serviceId, providerId, isActive: true }
    });

    if (!service) {
      throw new NotFoundException('Service not found or not owned by provider');
    }

    // Calcular data de fim baseada na duração
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + duration);

    // Criar campanha de boost
    const boostCampaign = await this.prisma.adCampaign.create({
      data: {
        name: `Boost - ${service.title}`,
        description: `Quick boost for ${duration} hours`,
        adType: boostType,
        status: AdStatus.ACTIVE,
        budget: amount,
        budgetType: BudgetType.TOTAL,
        spent: 0,
        impressions: 0,
        clicks: 0,
        leads: 0,
        conversions: 0,
        startDate: new Date(),
        endDate,
        serviceId,
        providerId,
        activatedAt: new Date()
      },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            category: true,
            price: true,
            images: true
          }
        }
      }
    });

    // TODO: Processar pagamento imediato

    return {
      ...boostCampaign,
      ...this.calculateMetrics(boostCampaign)
    };
  }

  // ================== SISTEMA DE LEILÃO ==================

  /**
   * Fazer lance em leilão
   */
  async placeBid(bidDto: BidDto, providerId: string) {
    const { campaignId, bidAmount, targetPosition, autoBid, maxBid } = bidDto;

    const campaign = await this.findOneCampaign(campaignId, providerId);

    if (campaign.status !== AdStatus.ACTIVE) {
      throw new BadRequestException('Campaign must be active to place bids');
    }

    // Validar se o tipo de anúncio suporta leilão
    const auctionAdTypes = [AdType.BANNER, AdType.TOP_SEARCH, AdType.FEATURED];
    if (!auctionAdTypes.includes(campaign.adType as AdType)) {
      throw new BadRequestException('This ad type does not support bidding');
    }

    // Criar lance
    const bid = await this.prisma.adBid.create({
      data: {
        campaignId,
        bidAmount,
        targetPosition,
        autoBid: autoBid || false,
        maxBid: maxBid || bidAmount,
        status: 'ACTIVE'
      }
    });

    // Reprocessar leilão para esta categoria/localização
    await this.processAuctionBid(campaign);

    return bid;
  }

  /**
   * Processar leilão automaticamente
   */
  private async processAuctionBid(campaign: any) {
    // Obter todos os lances ativos para a mesma categoria/localização
    const targeting = campaign.targeting ? JSON.parse(campaign.targeting) : {};
    const category = campaign.service.category;

    const competingCampaigns = await this.prisma.adCampaign.findMany({
      where: {
        status: AdStatus.ACTIVE,
        adType: campaign.adType,
        service: {
          category: category
        }
      },
      include: {
        bids: {
          where: { status: 'ACTIVE' },
          orderBy: { bidAmount: 'desc' }
        },
        service: true
      }
    });

    // Algoritmo de leilão de segundo preço
    const sortedCampaigns = competingCampaigns
      .filter(c => c.bids.length > 0)
      .map(c => ({
        ...c,
        highestBid: c.bids[0].bidAmount,
        qualityScore: this.calculateQualityScore(c)
      }))
      .sort((a, b) => (b.highestBid * b.qualityScore) - (a.highestBid * a.qualityScore));

    // Atualizar posições
    for (let i = 0; i < sortedCampaigns.length; i++) {
      const campaign = sortedCampaigns[i];
      const position = i + 1;
      const actualCpc = i < sortedCampaigns.length - 1 
        ? sortedCampaigns[i + 1].highestBid + 0.01 
        : campaign.highestBid;

      await this.prisma.adCampaign.update({
        where: { id: campaign.id },
        data: {
          currentPosition: position,
          actualCpc: actualCpc
        }
      });
    }
  }

  /**
   * Calcular quality score (semelhante ao Google Ads)
   */
  private calculateQualityScore(campaign: any): number {
    let score = 1.0;

    // CTR histórico (peso 40%)
    const ctr = campaign.clicks > 0 ? campaign.clicks / campaign.impressions : 0.01;
    score *= (1 + ctr * 4);

    // Qualidade do serviço (peso 30%)
    const serviceRating = campaign.service.rating || 3.0;
    score *= (serviceRating / 5.0);

    // Completude do perfil (peso 20%)
    const profileCompleteness = this.calculateProfileCompleteness(campaign.service);
    score *= profileCompleteness;

    // Relevância do anúncio (peso 10%)
    const adRelevance = this.calculateAdRelevance(campaign);
    score *= adRelevance;

    return Math.min(Math.max(score, 0.1), 10.0); // Entre 0.1 e 10.0
  }

  private calculateProfileCompleteness(service: any): number {
    let score = 0.5; // Base score
    
    if (service.images && service.images.length > 0) score += 0.2;
    if (service.description && service.description.length > 50) score += 0.2;
    if (service.tags && service.tags.length > 0) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  private calculateAdRelevance(campaign: any): number {
    // Simplificado - pode ser expandido com ML
    return 1.0;
  }

  // ================== ANALYTICS ==================

  /**
   * Obter analytics da campanha
   */
  async getCampaignAnalytics(filters: AdAnalyticsFilterDto, providerId: string) {
    const { campaignId, startDate, endDate, groupBy = 'day' } = filters;

    const where: any = { providerId };
    if (campaignId) where.id = campaignId;

    const campaigns = await this.prisma.adCampaign.findMany({
      where,
      include: {
        service: {
          select: {
            id: true,
            title: true,
            category: true
          }
        }
      }
    });

    if (campaigns.length === 0) {
      throw new NotFoundException('No campaigns found');
    }

    // Calcular métricas agregadas
    const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
    const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
    const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
    const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
    const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);

    const averageCtr = totalImpressions > 0 ? totalClicks / totalImpressions : 0;
    const averageCpc = totalClicks > 0 ? totalSpent / totalClicks : 0;
    const averageCpl = totalLeads > 0 ? totalSpent / totalLeads : 0;
    const roi = totalSpent > 0 ? (totalConversions * 50 - totalSpent) / totalSpent : 0; // Assumindo $50 por conversão

    // Simular dados diários (em produção, viria de uma tabela de métricas)
    const dailyStats = this.generateDailyStats(campaigns, startDate, endDate);

    // Top performing ads
    const topPerformingAds = campaigns
      .map(c => ({
        id: c.id,
        name: c.name,
        impressions: c.impressions,
        clicks: c.clicks,
        ctr: c.impressions > 0 ? c.clicks / c.impressions : 0,
        spent: c.spent,
        roi: c.spent > 0 ? (c.conversions * 50 - c.spent) / c.spent : 0
      }))
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 5);

    // Audience insights (simulado)
    const audienceInsights = {
      topCities: [
        { city: 'Miami', percentage: 35 },
        { city: 'Orlando', percentage: 25 },
        { city: 'Tampa', percentage: 20 },
        { city: 'Jacksonville', percentage: 15 },
        { city: 'Fort Lauderdale', percentage: 5 }
      ],
      topAgeGroups: [
        { ageGroup: '25-34', percentage: 40 },
        { ageGroup: '35-44', percentage: 30 },
        { ageGroup: '45-54', percentage: 20 },
        { ageGroup: '18-24', percentage: 10 }
      ],
      topInterests: [
        { interest: 'Home Improvement', percentage: 45 },
        { interest: 'Beauty & Wellness', percentage: 25 },
        { interest: 'Technology', percentage: 20 },
        { interest: 'Fitness', percentage: 10 }
      ],
      deviceBreakdown: [
        { device: 'Mobile', percentage: 70 },
        { device: 'Desktop', percentage: 25 },
        { device: 'Tablet', percentage: 5 }
      ]
    };

    return {
      campaignId: campaignId || 'all',
      totalSpent,
      totalImpressions,
      totalClicks,
      totalLeads,
      totalConversions,
      averageCtr,
      averageCpc,
      averageCpl,
      roi,
      dailyStats,
      topPerformingAds,
      audienceInsights
    };
  }

  private generateDailyStats(campaigns: any[], startDate?: string, endDate?: string): any[] {
    // Simplificado - em produção, viria de uma tabela de métricas diárias
    const days = [];
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayData = {
        date: d.toISOString().split('T')[0],
        spent: Math.random() * 100,
        impressions: Math.floor(Math.random() * 1000),
        clicks: Math.floor(Math.random() * 50),
        leads: Math.floor(Math.random() * 10),
        conversions: Math.floor(Math.random() * 5),
        ctr: 0,
        cpc: 0
      };

      dayData.ctr = dayData.impressions > 0 ? dayData.clicks / dayData.impressions : 0;
      dayData.cpc = dayData.clicks > 0 ? dayData.spent / dayData.clicks : 0;

      days.push(dayData);
    }

    return days;
  }

  // ================== SISTEMA DE LEADS E PLANOS ==================

  /**
   * Comprar leads extras
   */
  async purchaseLeads(purchaseLeadsDto: PurchaseLeadsDto, providerId: string) {
    const { quantity, paymentMethodId } = purchaseLeadsDto;

    const provider = await this.prisma.user.findUnique({
      where: { id: providerId }
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    const totalCost = quantity * 3.0; // $3 por lead extra

    // TODO: Processar pagamento com Stripe
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: totalCost * 100,
    //   currency: 'usd',
    //   payment_method: paymentMethodId
    // });

    // Atualizar limite de leads
    const updatedProvider = await this.prisma.user.update({
      where: { id: providerId },
      data: {
        leadsLimit: { increment: quantity }
      }
    });

    // Registrar transação
    await this.prisma.transaction.create({
      data: {
        userId: providerId,
        type: 'LEAD_PURCHASE',
        amount: totalCost,
        currency: 'USD',
        status: 'COMPLETED',
        description: `Purchased ${quantity} extra leads`,
        metadata: JSON.stringify({ quantity, pricePerLead: 3.0 })
      }
    });

    return {
      success: true,
      quantity,
      totalCost,
      newLeadsLimit: updatedProvider.leadsLimit
    };
  }

  /**
   * Upgrade para plano PRO
   */
  async upgradeToPro(upgradePlanDto: UpgradePlanDto, providerId: string) {
    const { planType, paymentMethodId, billingPeriod = 'monthly' } = upgradePlanDto;

    if (planType !== 'PRO') {
      throw new BadRequestException('Only PRO plan upgrade is supported');
    }

    const provider = await this.prisma.user.findUnique({
      where: { id: providerId }
    });

    if (!provider) {
      throw new NotFoundException('Provider not found');
    }

    if (provider.planType === 'PRO') {
      throw new BadRequestException('Provider already has PRO plan');
    }

    const price = billingPeriod === 'yearly' ? 34.80 * 12 * 0.8 : 34.80; // 20% desconto anual

    // TODO: Processar pagamento com Stripe
    // const subscription = await stripe.subscriptions.create({
    //   customer: provider.stripeCustomerId,
    //   items: [{ price: billingPeriod === 'monthly' ? 'price_pro_monthly' : 'price_pro_yearly' }],
    //   payment_behavior: 'default_incomplete',
    //   payment_settings: { save_default_payment_method: 'on_subscription' }
    // });

    // Calcular data de expiração
    const expirationDate = new Date();
    if (billingPeriod === 'monthly') {
      expirationDate.setMonth(expirationDate.getMonth() + 1);
    } else {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    // Atualizar plano do usuário
    const updatedProvider = await this.prisma.user.update({
      where: { id: providerId },
      data: {
        planType: 'PRO',
        planExpiresAt: expirationDate,
        leadsLimit: 999999, // Ilimitado para PRO
        verified: true // PRO users são automaticamente verificados
      }
    });

    // Registrar transação
    await this.prisma.transaction.create({
      data: {
        userId: providerId,
        type: 'SUBSCRIPTION',
        amount: price,
        currency: 'USD',
        status: 'COMPLETED',
        description: `Upgraded to PRO plan (${billingPeriod})`,
        metadata: JSON.stringify({ planType, billingPeriod, expirationDate })
      }
    });

    return {
      success: true,
      planType: 'PRO',
      billingPeriod,
      price,
      expirationDate: updatedProvider.planExpiresAt,
      features: [
        'Unlimited leads and messages',
        'Verified badge',
        'Top search visibility',
        'Advanced analytics',
        'Premium ad types access',
        'Priority support'
      ]
    };
  }

  // ================== UTILITIES ==================

  /**
   * Calcular métricas da campanha
   */
  private calculateMetrics(campaign: any) {
    const ctr = campaign.impressions > 0 ? campaign.clicks / campaign.impressions : 0;
    const cpc = campaign.clicks > 0 ? campaign.spent / campaign.clicks : 0;
    const cpl = campaign.leads > 0 ? campaign.spent / campaign.leads : 0;
    const conversionRate = campaign.clicks > 0 ? campaign.conversions / campaign.clicks : 0;
    const roi = campaign.spent > 0 ? (campaign.conversions * 50 - campaign.spent) / campaign.spent : 0;

    return {
      ctr: Number(ctr.toFixed(4)),
      cpc: Number(cpc.toFixed(2)),
      cpl: Number(cpl.toFixed(2)),
      conversionRate: Number(conversionRate.toFixed(4)),
      roi: Number(roi.toFixed(2))
    };
  }

  /**
   * Obter estatísticas gerais de ADS
   */
  async getAdsStats(providerId: string) {
    const [
      totalCampaigns,
      activeCampaigns,
      totalSpent,
      totalImpressions,
      totalClicks,
      totalLeads,
      totalConversions
    ] = await Promise.all([
      this.prisma.adCampaign.count({ where: { providerId } }),
      this.prisma.adCampaign.count({ where: { providerId, status: AdStatus.ACTIVE } }),
      this.prisma.adCampaign.aggregate({
        where: { providerId },
        _sum: { spent: true }
      }),
      this.prisma.adCampaign.aggregate({
        where: { providerId },
        _sum: { impressions: true }
      }),
      this.prisma.adCampaign.aggregate({
        where: { providerId },
        _sum: { clicks: true }
      }),
      this.prisma.adCampaign.aggregate({
        where: { providerId },
        _sum: { leads: true }
      }),
      this.prisma.adCampaign.aggregate({
        where: { providerId },
        _sum: { conversions: true }
      })
    ]);

    const spent = totalSpent._sum.spent || 0;
    const impressions = totalImpressions._sum.impressions || 0;
    const clicks = totalClicks._sum.clicks || 0;
    const leads = totalLeads._sum.leads || 0;
    const conversions = totalConversions._sum.conversions || 0;

    const averageCtr = impressions > 0 ? clicks / impressions : 0;
    const averageCpc = clicks > 0 ? spent / clicks : 0;
    const averageCpl = leads > 0 ? spent / leads : 0;
    const roi = spent > 0 ? (conversions * 50 - spent) / spent : 0;

    return {
      totalCampaigns,
      activeCampaigns,
      totalSpent: spent,
      totalImpressions: impressions,
      totalClicks: clicks,
      totalLeads: leads,
      totalConversions: conversions,
      averageCtr: Number(averageCtr.toFixed(4)),
      averageCpc: Number(averageCpc.toFixed(2)),
      averageCpl: Number(averageCpl.toFixed(2)),
      roi: Number(roi.toFixed(2))
    };
  }
} 