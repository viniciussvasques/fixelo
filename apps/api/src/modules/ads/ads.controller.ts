import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  UseGuards, 
  Request 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery 
} from '@nestjs/swagger';
import { AdsService } from './ads.service';
import { 
  CreateAdCampaignDto, 
  UpdateAdCampaignDto, 
  CreateBoostDto, 
  AdCampaignFilterDto, 
  AdAnalyticsFilterDto,
  BidDto,
  PurchaseLeadsDto,
  UpgradePlanDto,
  AdCampaignResponseDto,
  AdAnalyticsResponseDto
} from './dto/ads.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@fixelo/common';

@ApiTags('ads')
@Controller('ads')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  // ================== CAMPANHAS DE ADS ==================

  @Post('campaigns')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Criar nova campanha de ADS' })
  @ApiResponse({ status: 201, description: 'Campanha criada com sucesso', type: AdCampaignResponseDto })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 403, description: 'Tipo de anúncio requer plano PRO' })
  async createCampaign(
    @Body() createAdCampaignDto: CreateAdCampaignDto,
    @Request() req: any
  ) {
    return this.adsService.createCampaign(createAdCampaignDto, req.user.sub);
  }

  @Get('campaigns')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Listar campanhas do provider' })
  @ApiResponse({ status: 200, description: 'Lista de campanhas' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por status' })
  @ApiQuery({ name: 'adType', required: false, description: 'Filtrar por tipo de anúncio' })
  @ApiQuery({ name: 'page', required: false, description: 'Página' })
  @ApiQuery({ name: 'limit', required: false, description: 'Limite por página' })
  async findAllCampaigns(
    @Query() filters: AdCampaignFilterDto,
    @Request() req: any
  ) {
    return this.adsService.findAllCampaigns(filters, req.user.sub);
  }

  @Get('campaigns/:id')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Obter detalhes da campanha' })
  @ApiResponse({ status: 200, description: 'Detalhes da campanha', type: AdCampaignResponseDto })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada' })
  async findOneCampaign(
    @Param('id') id: string,
    @Request() req: any
  ) {
    return this.adsService.findOneCampaign(id, req.user.sub);
  }

  @Patch('campaigns/:id')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Atualizar campanha' })
  @ApiResponse({ status: 200, description: 'Campanha atualizada', type: AdCampaignResponseDto })
  @ApiResponse({ status: 400, description: 'Não é possível atualizar campanha ativa' })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada' })
  async updateCampaign(
    @Param('id') id: string,
    @Body() updateAdCampaignDto: UpdateAdCampaignDto,
    @Request() req: any
  ) {
    return this.adsService.updateCampaign(id, updateAdCampaignDto, req.user.sub);
  }

  @Post('campaigns/:id/activate')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Ativar campanha' })
  @ApiResponse({ status: 200, description: 'Campanha ativada', type: AdCampaignResponseDto })
  @ApiResponse({ status: 400, description: 'Apenas campanhas em rascunho podem ser ativadas' })
  async activateCampaign(
    @Param('id') id: string,
    @Request() req: any
  ) {
    return this.adsService.activateCampaign(id, req.user.sub);
  }

  @Post('campaigns/:id/pause')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Pausar campanha' })
  @ApiResponse({ status: 200, description: 'Campanha pausada', type: AdCampaignResponseDto })
  @ApiResponse({ status: 400, description: 'Apenas campanhas ativas podem ser pausadas' })
  async pauseCampaign(
    @Param('id') id: string,
    @Request() req: any
  ) {
    return this.adsService.pauseCampaign(id, req.user.sub);
  }

  // ================== SISTEMA DE BOOST ==================

  @Post('boost')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Criar boost rápido para serviço' })
  @ApiResponse({ status: 201, description: 'Boost criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Serviço não encontrado' })
  async createBoost(
    @Body() createBoostDto: CreateBoostDto,
    @Request() req: any
  ) {
    return this.adsService.createBoost(createBoostDto, req.user.sub);
  }

  // ================== SISTEMA DE LEILÃO ==================

  @Post('campaigns/:id/bid')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Fazer lance em leilão' })
  @ApiResponse({ status: 201, description: 'Lance realizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Tipo de anúncio não suporta leilão' })
  @ApiResponse({ status: 404, description: 'Campanha não encontrada' })
  async placeBid(
    @Param('id') campaignId: string,
    @Body() bidDto: Omit<BidDto, 'campaignId'>,
    @Request() req: any
  ) {
    return this.adsService.placeBid({ ...bidDto, campaignId }, req.user.sub);
  }

  // ================== ANALYTICS ==================

  @Get('analytics')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Obter analytics de campanhas' })
  @ApiResponse({ status: 200, description: 'Analytics das campanhas', type: AdAnalyticsResponseDto })
  @ApiQuery({ name: 'campaignId', required: false, description: 'ID da campanha específica' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Data de início' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Data de fim' })
  @ApiQuery({ name: 'groupBy', required: false, description: 'Agrupar por (day, week, month)' })
  async getCampaignAnalytics(
    @Query() filters: AdAnalyticsFilterDto,
    @Request() req: any
  ) {
    return this.adsService.getCampaignAnalytics(filters, req.user.sub);
  }

  @Get('stats')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Obter estatísticas gerais de ADS' })
  @ApiResponse({ status: 200, description: 'Estatísticas gerais de ADS' })
  async getAdsStats(@Request() req: any) {
    return this.adsService.getAdsStats(req.user.sub);
  }

  // ================== SISTEMA DE LEADS E PLANOS ==================

  @Post('leads/purchase')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Comprar leads extras' })
  @ApiResponse({ status: 201, description: 'Leads comprados com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados de pagamento inválidos' })
  async purchaseLeads(
    @Body() purchaseLeadsDto: PurchaseLeadsDto,
    @Request() req: any
  ) {
    return this.adsService.purchaseLeads(purchaseLeadsDto, req.user.sub);
  }

  @Post('upgrade-plan')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Upgrade para plano PRO' })
  @ApiResponse({ status: 201, description: 'Plano atualizado com sucesso' })
  @ApiResponse({ status: 400, description: 'Provider já tem plano PRO' })
  async upgradeToPro(
    @Body() upgradePlanDto: UpgradePlanDto,
    @Request() req: any
  ) {
    return this.adsService.upgradeToPro(upgradePlanDto, req.user.sub);
  }

  // ================== ENDPOINTS ADMINISTRATIVOS ==================

  @Get('admin/campaigns')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todas as campanhas (Admin)' })
  @ApiResponse({ status: 200, description: 'Lista de todas as campanhas' })
  async findAllCampaignsAdmin(
    @Query() filters: AdCampaignFilterDto
  ) {
    // TODO: Implementar endpoint admin
    return { message: 'Admin endpoint - to be implemented' };
  }

  @Get('admin/stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Estatísticas gerais da plataforma (Admin)' })
  @ApiResponse({ status: 200, description: 'Estatísticas da plataforma' })
  async getPlatformStats() {
    // TODO: Implementar estatísticas da plataforma
    return { message: 'Platform stats - to be implemented' };
  }

  // ================== ENDPOINTS PÚBLICOS (para busca) ==================

  @Get('public/featured-services')
  @ApiOperation({ summary: 'Obter serviços em destaque' })
  @ApiResponse({ status: 200, description: 'Serviços em destaque' })
  async getFeaturedServices(
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('limit') limit: number = 10
  ) {
    // TODO: Implementar busca de serviços em destaque
    return { message: 'Featured services - to be implemented' };
  }

  @Get('public/sponsored-services')
  @ApiOperation({ summary: 'Obter serviços patrocinados' })
  @ApiResponse({ status: 200, description: 'Serviços patrocinados' })
  async getSponsoredServices(
    @Query('city') city?: string,
    @Query('category') category?: string,
    @Query('keywords') keywords?: string,
    @Query('limit') limit: number = 5
  ) {
    // TODO: Implementar busca de serviços patrocinados
    return { message: 'Sponsored services - to be implemented' };
  }

  // ================== ENDPOINTS DE PERFORMANCE ==================

  @Get('performance/top-categories')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Categorias com melhor performance' })
  @ApiResponse({ status: 200, description: 'Top categorias por performance' })
  async getTopCategories(@Request() req: any) {
    // TODO: Implementar análise de performance por categoria
    return { message: 'Top categories - to be implemented' };
  }

  @Get('performance/recommendations')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Recomendações de otimização' })
  @ApiResponse({ status: 200, description: 'Recomendações personalizadas' })
  async getRecommendations(@Request() req: any) {
    // TODO: Implementar sistema de recomendações com IA
    return { message: 'AI recommendations - to be implemented' };
  }

  // ================== ENDPOINTS DE COMPETIÇÃO ==================

  @Get('competition/analysis')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Análise da competição' })
  @ApiResponse({ status: 200, description: 'Análise competitiva' })
  async getCompetitionAnalysis(
    @Query('category') category: string,
    @Query('city') city: string,
    @Request() req: any
  ) {
    // TODO: Implementar análise competitiva
    return { message: 'Competition analysis - to be implemented' };
  }

  @Get('competition/bid-suggestions')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Sugestões de lances' })
  @ApiResponse({ status: 200, description: 'Sugestões de lances baseadas na competição' })
  async getBidSuggestions(
    @Query('campaignId') campaignId: string,
    @Request() req: any
  ) {
    // TODO: Implementar sugestões inteligentes de lances
    return { message: 'Bid suggestions - to be implemented' };
  }

  // ================== ENDPOINTS DE AUTOMAÇÃO ==================

  @Post('automation/auto-bid')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Configurar lance automático' })
  @ApiResponse({ status: 201, description: 'Lance automático configurado' })
  async setupAutoBid(
    @Body() autoBidConfig: any,
    @Request() req: any
  ) {
    // TODO: Implementar sistema de lance automático
    return { message: 'Auto-bid setup - to be implemented' };
  }

  @Post('automation/smart-budget')
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Configurar orçamento inteligente' })
  @ApiResponse({ status: 201, description: 'Orçamento inteligente configurado' })
  async setupSmartBudget(
    @Body() smartBudgetConfig: any,
    @Request() req: any
  ) {
    // TODO: Implementar sistema de orçamento inteligente
    return { message: 'Smart budget setup - to be implemented' };
  }
} 