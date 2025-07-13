import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@fixelo/common';

export interface PlanFeatures {
  en: string[];
  pt: string[];
  es: string[];
}

export interface PlanDetails {
  id: string;
  name: {
    en: string;
    pt: string;
    es: string;
  };
  price: number;
  currency: string;
  billing: string;
  leadLimit: number;
  extraLeadPrice: number;
  features: PlanFeatures;
  benefits: {
    chatUnlimited: boolean;
    verifiedBadge: boolean;
    topSearchPriority: boolean;
    multipleCategories: boolean;
    analytics: boolean;
    prioritySupport: boolean;
    boostAds: boolean;
    autoScheduling: boolean;
    responseTemplates: boolean;
    conversationBackup: boolean;
    topListRotation: boolean;
    photoGalleryUnlimited: boolean;
    videoPresentation: boolean;
    categoryHighlight: boolean;
    priorityPayment: boolean;
    reducedFees: boolean;
    autoInvoicing: boolean;
    autoResponses: boolean;
    weeklyReports: boolean;
    googleCalendar: boolean;
  };
  rewardSystem: {
    lowConversionReward: number; // leads given back if conversion < 25%
    highPerformanceBonus: number; // leads given if conversion > 75%
    loyaltyBonus: string; // free week every 3 months
    referralDiscount: string; // 50% off for 1 month per referral
  };
}

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  private readonly plans: Record<string, PlanDetails> = {
    FREE: {
      id: 'free',
      name: {
        en: 'Free Plan',
        pt: 'Plano Gratuito',
        es: 'Plan Gratuito',
      },
      price: 0,
      currency: 'USD',
      billing: 'monthly',
      leadLimit: 10,
      extraLeadPrice: 3.0,
      features: {
        en: [
          'Up to 10 leads per month',
          'Basic profile setup',
          'Receive customer reviews',
          'Basic chat (50 messages/month)',
          'Email support (48h response)',
          'Standard search visibility',
          '1 service category only',
          'Extra leads: $3.00 each',
          '3 photos in gallery',
          'Basic analytics',
        ],
        pt: [
          'Até 10 leads por mês',
          'Perfil básico',
          'Receber avaliações de clientes',
          'Chat básico (50 mensagens/mês)',
          'Suporte por email (resposta em 48h)',
          'Visibilidade padrão nas buscas',
          'Apenas 1 categoria de serviço',
          'Leads extras: $3.00 cada',
          '3 fotos na galeria',
          'Analytics básico',
        ],
        es: [
          'Hasta 10 contactos por mes',
          'Perfil básico',
          'Recibir reseñas de clientes',
          'Chat básico (50 mensajes/mes)',
          'Soporte por email (respuesta en 48h)',
          'Visibilidad estándar en búsquedas',
          'Solo 1 categoría de servicio',
          'Contactos extra: $3.00 cada uno',
          '3 fotos en galería',
          'Analytics básico',
        ],
      },
      benefits: {
        chatUnlimited: false,
        verifiedBadge: false,
        topSearchPriority: false,
        multipleCategories: false,
        analytics: false,
        prioritySupport: false,
        boostAds: false,
        autoScheduling: false,
        responseTemplates: false,
        conversationBackup: false,
        topListRotation: false,
        photoGalleryUnlimited: false,
        videoPresentation: false,
        categoryHighlight: false,
        priorityPayment: false,
        reducedFees: false,
        autoInvoicing: false,
        autoResponses: false,
        weeklyReports: false,
        googleCalendar: false,
      },
      rewardSystem: {
        lowConversionReward: 0,
        highPerformanceBonus: 0,
        loyaltyBonus: 'none',
        referralDiscount: 'none',
      },
    },
    PRO: {
      id: 'pro',
      name: {
        en: 'Professional Plan',
        pt: 'Plano Profissional',
        es: 'Plan Profesional',
      },
      price: 34.80,
      currency: 'USD',
      billing: 'monthly',
      leadLimit: 40,
      extraLeadPrice: 3.0,
      features: {
        en: [
          'Up to 40 leads per month (4x more)',
          'Unlimited chat + push notifications',
          'Verified Professional badge',
          'Top search priority',
          'Multiple service categories',
          'Advanced analytics & conversion tracking',
          'Priority support (4h response)',
          'Boost/ADS system access',
          'Automatic scheduling with Google Calendar',
          'Custom response templates',
          'Full conversation backup & history',
          'Top list rotation (4x per week)',
          'Unlimited photo gallery',
          '30-second video presentation',
          'Category highlight feature',
          'Priority payment processing',
          'Reduced transaction fees (-20%)',
          'Automatic invoicing for recurring clients',
          'Auto-responses when offline',
          'Weekly performance reports',
          'Lead conversion rewards system',
        ],
        pt: [
          'Até 40 leads por mês (4x mais)',
          'Chat ilimitado + notificações push',
          'Selo "Profissional Verificado"',
          'Prioridade nas buscas',
          'Múltiplas categorias de serviço',
          'Analytics avançado e rastreamento de conversão',
          'Suporte prioritário (resposta em 4h)',
          'Acesso ao sistema de Boost/ADS',
          'Agendamento automático com Google Calendar',
          'Templates de resposta personalizados',
          'Backup completo de conversas e histórico',
          'Rotação no topo da lista (4x por semana)',
          'Galeria de fotos ilimitada',
          'Vídeo de apresentação de 30 segundos',
          'Destaque nas categorias',
          'Processamento prioritário de pagamentos',
          'Taxas de transação reduzidas (-20%)',
          'Faturamento automático para clientes recorrentes',
          'Respostas automáticas quando offline',
          'Relatórios semanais de performance',
          'Sistema de recompensas por conversão de leads',
        ],
        es: [
          'Hasta 40 contactos por mes (4x más)',
          'Chat ilimitado + notificaciones push',
          'Insignia "Profesional Verificado"',
          'Prioridad en búsquedas',
          'Múltiples categorías de servicio',
          'Analytics avanzado y seguimiento de conversión',
          'Soporte prioritario (respuesta en 4h)',
          'Acceso al sistema de Boost/ADS',
          'Programación automática con Google Calendar',
          'Plantillas de respuesta personalizadas',
          'Respaldo completo de conversaciones e historial',
          'Rotación en la parte superior (4x por semana)',
          'Galería de fotos ilimitada',
          'Video de presentación de 30 segundos',
          'Destacado en categorías',
          'Procesamiento prioritario de pagos',
          'Tarifas de transacción reducidas (-20%)',
          'Facturación automática para clientes recurrentes',
          'Respuestas automáticas cuando está desconectado',
          'Informes semanales de rendimiento',
          'Sistema de recompensas por conversión de contactos',
        ],
      },
      benefits: {
        chatUnlimited: true,
        verifiedBadge: true,
        topSearchPriority: true,
        multipleCategories: true,
        analytics: true,
        prioritySupport: true,
        boostAds: true,
        autoScheduling: true,
        responseTemplates: true,
        conversationBackup: true,
        topListRotation: true,
        photoGalleryUnlimited: true,
        videoPresentation: true,
        categoryHighlight: true,
        priorityPayment: true,
        reducedFees: true,
        autoInvoicing: true,
        autoResponses: true,
        weeklyReports: true,
        googleCalendar: true,
      },
      rewardSystem: {
        lowConversionReward: 2, // 2 leads back if conversion < 25%
        highPerformanceBonus: 5, // 5 bonus leads if conversion > 75%
        loyaltyBonus: '1 free week every 3 months',
        referralDiscount: '50% off for 1 month per referral',
      },
    },
  };

  async getAllPlans(language: string = 'en'): Promise<PlanDetails[]> {
    return Object.values(this.plans);
  }

  async getPlanById(planId: string): Promise<PlanDetails | null> {
    return this.plans[planId.toUpperCase()] || null;
  }

  async getUserPlan(userId: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { planType: true },
    });
    return user?.planType || 'FREE';
  }

  async upgradeToPro(userId: string): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { 
          planType: 'PRO',
          planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
      });
      return true;
    } catch (error) {
      console.error('Error upgrading to PRO:', error);
      return false;
    }
  }

  async downgradeToFree(userId: string): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { 
          planType: 'FREE',
          planExpiresAt: null,
        },
      });
      return true;
    } catch (error) {
      console.error('Error downgrading to FREE:', error);
      return false;
    }
  }

  async checkLeadLimits(userId: string): Promise<{
    currentLeads: number;
    limit: number;
    canReceiveMore: boolean;
    plan: string;
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        planType: true,
        leadsUsed: true,
        leadsLimit: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const plan = this.plans[user.planType || 'FREE'];
    const currentLeads = user.leadsUsed || 0;
    const limit = user.leadsLimit || plan.leadLimit;

    return {
      currentLeads,
      limit,
      canReceiveMore: currentLeads < limit,
      plan: user.planType || 'FREE',
    };
  }

  async getUserUsage(userId: string): Promise<{
    planType: string;
    leadsUsed: number;
    leadsLimit: number;
    leadsRemaining: number;
    usagePercentage: number;
    planDetails: PlanDetails;
    monthlyStats: {
      totalLeads: number;
      conversions: number;
      conversionRate: number;
      revenue: number;
    };
  }> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        planType: true,
        leadsUsed: true,
        leadsLimit: true,
        leadCount: true,
        completedBookings: true,
        rating: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    const planType = user.planType || 'FREE';
    const planDetails = this.plans[planType];
    const leadsUsed = user.leadsUsed || 0;
    const leadsLimit = user.leadsLimit || planDetails.leadLimit;
    const leadsRemaining = Math.max(0, leadsLimit - leadsUsed);
    const usagePercentage = Math.round((leadsUsed / leadsLimit) * 100);

    // Calcular estatísticas mensais (simulado)
    const totalLeads = user.leadCount || 0;
    const conversions = user.completedBookings || 0;
    const conversionRate = totalLeads > 0 ? Math.round((conversions / totalLeads) * 100) : 0;
    const revenue = conversions * 50; // Valor médio por conversão

    return {
      planType,
      leadsUsed,
      leadsLimit,
      leadsRemaining,
      usagePercentage,
      planDetails,
      monthlyStats: {
        totalLeads,
        conversions,
        conversionRate,
        revenue,
      },
    };
  }

  async calculateConversionRewards(userId: string): Promise<{
    totalLeads: number;
    conversions: number;
    conversionRate: number;
    rewardLeads: number;
    rewardType: string;
  }> {
    // TODO: Implement actual conversion calculation
    const totalLeads = 20; // From database
    const conversions = 5; // From database
    const conversionRate = (conversions / totalLeads) * 100;
    
    const userPlan = await this.getUserPlan(userId);
    const plan = this.plans[userPlan];
    
    let rewardLeads = 0;
    let rewardType = 'none';
    
    if (userPlan === 'PRO') {
      if (conversionRate < 25) {
        rewardLeads = plan.rewardSystem.lowConversionReward;
        rewardType = 'low_conversion';
      } else if (conversionRate > 75) {
        rewardLeads = plan.rewardSystem.highPerformanceBonus;
        rewardType = 'high_performance';
      }
    }
    
    return {
      totalLeads,
      conversions,
      conversionRate,
      rewardLeads,
      rewardType,
    };
  }

  async getTopListRotationSchedule(userId: string): Promise<{
    isEligible: boolean;
    nextRotation: Date | null;
    rotationsThisWeek: number;
    maxRotationsPerWeek: number;
  }> {
    const userPlan = await this.getUserPlan(userId);
    const isEligible = userPlan === 'PRO';
    
    if (!isEligible) {
      return {
        isEligible: false,
        nextRotation: null,
        rotationsThisWeek: 0,
        maxRotationsPerWeek: 0,
      };
    }
    
    // TODO: Implement actual rotation scheduling logic
    return {
      isEligible: true,
      nextRotation: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next 24h
      rotationsThisWeek: 2,
      maxRotationsPerWeek: 4,
    };
  }

  async getPlanComparison(language: string = 'en'): Promise<{
    free: PlanDetails;
    pro: PlanDetails;
    savings: number;
    valueProposition: string[];
  }> {
    const free = this.plans.FREE;
    const pro = this.plans.PRO;
    const savings = (pro.leadLimit - free.leadLimit) * free.extraLeadPrice;
    
    const valueProposition = {
      en: [
        `Get ${pro.leadLimit - free.leadLimit} more leads included (saves $${savings}/month)`,
        'Verified badge increases trust and bookings by 40%',
        'Top search priority gets 3x more visibility',
        'Advanced analytics help optimize conversion rates',
        'Priority support ensures quick problem resolution',
        'Boost/ADS system can increase bookings by 60%',
        'Automatic features save 10+ hours per week',
      ],
      pt: [
        `Receba ${pro.leadLimit - free.leadLimit} leads a mais inclusos (economiza $${savings}/mês)`,
        'Selo verificado aumenta confiança e reservas em 40%',
        'Prioridade nas buscas gera 3x mais visibilidade',
        'Analytics avançado ajuda a otimizar taxas de conversão',
        'Suporte prioritário garante resolução rápida de problemas',
        'Sistema de Boost/ADS pode aumentar reservas em 60%',
        'Recursos automáticos economizam mais de 10 horas por semana',
      ],
      es: [
        `Obtén ${pro.leadLimit - free.leadLimit} contactos más incluidos (ahorra $${savings}/mes)`,
        'Insignia verificada aumenta confianza y reservas en 40%',
        'Prioridad en búsquedas genera 3x más visibilidad',
        'Analytics avanzado ayuda a optimizar tasas de conversión',
        'Soporte prioritario garantiza resolución rápida de problemas',
        'Sistema de Boost/ADS puede aumentar reservas en 60%',
        'Funciones automáticas ahorran más de 10 horas por semana',
      ],
    };
    
    return {
      free,
      pro,
      savings,
      valueProposition: valueProposition[language] || valueProposition.en,
    };
  }
} 