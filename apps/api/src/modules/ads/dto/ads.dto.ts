import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEnum, IsArray, IsBoolean, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Enums para ADS
export enum AdType {
  BOOST = 'BOOST',           // Impulsiona serviço existente
  BANNER = 'BANNER',         // Banner no topo da busca
  FEATURED = 'FEATURED',     // Destaque na categoria
  SPONSORED = 'SPONSORED',   // Aparece em resultados relacionados
  PREMIUM_BADGE = 'PREMIUM_BADGE', // Badge premium no perfil
  TOP_SEARCH = 'TOP_SEARCH'  // Sempre aparece no topo
}

export enum AdStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum BudgetType {
  DAILY = 'DAILY',
  TOTAL = 'TOTAL',
  PER_CLICK = 'PER_CLICK',
  PER_LEAD = 'PER_LEAD'
}

export enum TargetingType {
  LOCATION = 'LOCATION',
  CATEGORY = 'CATEGORY',
  KEYWORDS = 'KEYWORDS',
  DEMOGRAPHICS = 'DEMOGRAPHICS',
  BEHAVIOR = 'BEHAVIOR',
  COMPETITOR = 'COMPETITOR'
}

export class TargetingConfigDto {
  @ApiPropertyOptional({ description: 'Cidades alvo' })
  @IsOptional()
  @IsArray()
  cities?: string[];

  @ApiPropertyOptional({ description: 'Raio em milhas' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(50)
  radius?: number;

  @ApiPropertyOptional({ description: 'Categorias alvo' })
  @IsOptional()
  @IsArray()
  categories?: string[];

  @ApiPropertyOptional({ description: 'Palavras-chave' })
  @IsOptional()
  @IsArray()
  keywords?: string[];

  @ApiPropertyOptional({ description: 'Idade mínima do público' })
  @IsOptional()
  @IsNumber()
  @Min(18)
  minAge?: number;

  @ApiPropertyOptional({ description: 'Idade máxima do público' })
  @IsOptional()
  @IsNumber()
  @Max(80)
  maxAge?: number;

  @ApiPropertyOptional({ description: 'Gêneros alvo' })
  @IsOptional()
  @IsArray()
  genders?: string[];

  @ApiPropertyOptional({ description: 'Interesses do público' })
  @IsOptional()
  @IsArray()
  interests?: string[];
}

export class AdCreativeDto {
  @ApiPropertyOptional({ description: 'Título do anúncio' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Descrição do anúncio' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'URLs das imagens' })
  @IsOptional()
  @IsArray()
  images?: string[];

  @ApiPropertyOptional({ description: 'Call-to-action' })
  @IsOptional()
  @IsString()
  callToAction?: string;

  @ApiPropertyOptional({ description: 'Cor do tema' })
  @IsOptional()
  @IsString()
  themeColor?: string;

  @ApiPropertyOptional({ description: 'Badge personalizado' })
  @IsOptional()
  @IsString()
  customBadge?: string;
}

// DTOs para criação de campanhas
export class CreateAdCampaignDto {
  @ApiProperty({ description: 'Nome da campanha' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descrição da campanha' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: AdType, description: 'Tipo de anúncio' })
  @IsEnum(AdType)
  adType: AdType;

  @ApiProperty({ description: 'ID do serviço a ser promovido' })
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @ApiProperty({ description: 'Orçamento da campanha' })
  @IsNumber()
  @Min(1)
  budget: number;

  @ApiProperty({ enum: BudgetType, description: 'Tipo de orçamento' })
  @IsEnum(BudgetType)
  budgetType: BudgetType;

  @ApiProperty({ description: 'Data de início da campanha' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ description: 'Data de fim da campanha' })
  @IsDateString()
  endDate: string;

  @ApiPropertyOptional({ description: 'Configurações de targeting' })
  @IsOptional()
  targeting?: TargetingConfigDto;

  @ApiPropertyOptional({ description: 'Configurações criativas do anúncio' })
  @IsOptional()
  creative?: AdCreativeDto;
}

export class UpdateAdCampaignDto {
  @ApiPropertyOptional({ description: 'Nome da campanha' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Descrição da campanha' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Orçamento da campanha' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  budget?: number;

  @ApiPropertyOptional({ enum: BudgetType, description: 'Tipo de orçamento' })
  @IsOptional()
  @IsEnum(BudgetType)
  budgetType?: BudgetType;

  @ApiPropertyOptional({ description: 'Data de início da campanha' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data de fim da campanha' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Configurações de targeting' })
  @IsOptional()
  targeting?: TargetingConfigDto;

  @ApiPropertyOptional({ description: 'Configurações criativas do anúncio' })
  @IsOptional()
  creative?: AdCreativeDto;
}

// DTOs para Boost rápido
export class CreateBoostDto {
  @ApiProperty({ description: 'ID do serviço a ser impulsionado' })
  @IsNotEmpty()
  @IsString()
  serviceId: string;

  @ApiProperty({ description: 'Duração do boost em horas' })
  @IsNumber()
  @Min(1)
  @Max(168) // máximo 7 dias
  duration: number;

  @ApiProperty({ description: 'Valor do boost' })
  @IsNumber()
  @Min(5)
  amount: number;

  @ApiPropertyOptional({ description: 'Tipo de boost' })
  @IsOptional()
  @IsEnum(AdType)
  boostType?: AdType;
}

// DTOs para filtros e busca
export class AdCampaignFilterDto {
  @ApiPropertyOptional({ enum: AdStatus, description: 'Status da campanha' })
  @IsOptional()
  @IsEnum(AdStatus)
  status?: AdStatus;

  @ApiPropertyOptional({ enum: AdType, description: 'Tipo de anúncio' })
  @IsOptional()
  @IsEnum(AdType)
  adType?: AdType;

  @ApiPropertyOptional({ description: 'Data de início (filtro)' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data de fim (filtro)' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Página' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Limite por página' })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'Ordenar por' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({ description: 'Ordem' })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}

// DTOs para Analytics
export class AdAnalyticsFilterDto {
  @ApiPropertyOptional({ description: 'ID da campanha' })
  @IsOptional()
  @IsString()
  campaignId?: string;

  @ApiPropertyOptional({ description: 'Data de início para analytics' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ description: 'Data de fim para analytics' })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ description: 'Agrupar por' })
  @IsOptional()
  @IsEnum(['day', 'week', 'month'])
  groupBy?: 'day' | 'week' | 'month' = 'day';
}

// DTOs de resposta
export class AdCampaignResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description?: string;

  @ApiProperty({ enum: AdType })
  adType: AdType;

  @ApiProperty({ enum: AdStatus })
  status: AdStatus;

  @ApiProperty()
  budget: number;

  @ApiProperty({ enum: BudgetType })
  budgetType: BudgetType;

  @ApiProperty()
  spent: number;

  @ApiProperty()
  impressions: number;

  @ApiProperty()
  clicks: number;

  @ApiProperty()
  leads: number;

  @ApiProperty()
  conversions: number;

  @ApiProperty()
  ctr: number; // Click-through rate

  @ApiProperty()
  cpc: number; // Cost per click

  @ApiProperty()
  cpl: number; // Cost per lead

  @ApiProperty()
  roi: number; // Return on investment

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  service: {
    id: string;
    title: string;
    category: string;
    price: number;
    images: string[];
  };

  @ApiProperty()
  targeting?: TargetingConfigDto;

  @ApiProperty()
  creative?: AdCreativeDto;
}

export class AdAnalyticsResponseDto {
  @ApiProperty()
  campaignId: string;

  @ApiProperty()
  totalSpent: number;

  @ApiProperty()
  totalImpressions: number;

  @ApiProperty()
  totalClicks: number;

  @ApiProperty()
  totalLeads: number;

  @ApiProperty()
  totalConversions: number;

  @ApiProperty()
  averageCtr: number;

  @ApiProperty()
  averageCpc: number;

  @ApiProperty()
  averageCpl: number;

  @ApiProperty()
  roi: number;

  @ApiProperty({ type: Object, isArray: true })
  dailyStats: any[];

  @ApiProperty({ type: Object, isArray: true })
  topPerformingAds: any[];

  @ApiProperty({ type: Object })
  audienceInsights: any;
}

// DTOs para sistema de leilão
export class BidDto {
  @ApiProperty({ description: 'ID da campanha' })
  @IsNotEmpty()
  @IsString()
  campaignId: string;

  @ApiProperty({ description: 'Valor do lance' })
  @IsNumber()
  @Min(0.1)
  bidAmount: number;

  @ApiProperty({ description: 'Posição desejada' })
  @IsNumber()
  @Min(1)
  @Max(10)
  targetPosition: number;

  @ApiPropertyOptional({ description: 'Lance automático' })
  @IsOptional()
  @IsBoolean()
  autoBid?: boolean;

  @ApiPropertyOptional({ description: 'Lance máximo para auto-bid' })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  maxBid?: number;
}

// DTOs para planos e leads
export class PurchaseLeadsDto {
  @ApiProperty({ description: 'Quantidade de leads extras' })
  @IsNumber()
  @Min(1)
  @Max(100)
  quantity: number;

  @ApiPropertyOptional({ description: 'Método de pagamento' })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;
}

export class UpgradePlanDto {
  @ApiProperty({ description: 'Tipo do plano' })
  @IsEnum(['FREE', 'PRO'])
  planType: 'FREE' | 'PRO';

  @ApiPropertyOptional({ description: 'Método de pagamento' })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @ApiPropertyOptional({ description: 'Período de cobrança' })
  @IsOptional()
  @IsEnum(['monthly', 'yearly'])
  billingPeriod?: 'monthly' | 'yearly';
} 