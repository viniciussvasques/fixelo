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
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  DefaultValuePipe
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth, 
  ApiQuery,
  ApiParam
} from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { 
  CreateServiceDto, 
  UpdateServiceDto, 
  ServiceSearchDto, 
  ServiceResponseDto, 
  ServiceListResponseDto,
  ServiceCategoriesResponseDto
} from './dto/service.dto';
import { JwtAuthGuard } from '../modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../modules/auth/guards/roles.guard';
import { Roles } from '../modules/auth/decorators/roles.decorator';
import { UserRole } from '@fixelo/common';


@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  // 🔧 CREATE SERVICE (PROVIDER only)
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.PROVIDER)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create a new service',
    description: 'Only PROVIDER users can create services. Service will be created with ACTIVE status.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Service created successfully',
    type: ServiceResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Only providers can create services' })
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @Request() req: any
  ): Promise<ServiceResponseDto> {
    return this.servicesService.create(createServiceDto, req.user.id);
  }

  // 📋 GET ALL SERVICES (with advanced search)
  @Get()
  @ApiOperation({ 
    summary: 'Get all services with advanced search and filtering',
    description: 'Public endpoint to search and filter services with geolocation support'
  })
  @ApiQuery({ name: 'query', required: false, description: 'Search query' })
  @ApiQuery({ name: 'category', required: false, description: 'Service category' })
  @ApiQuery({ name: 'city', required: false, description: 'City filter' })
  @ApiQuery({ name: 'state', required: false, description: 'State filter (FL)' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Minimum price' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Maximum price' })
  @ApiQuery({ name: 'latitude', required: false, description: 'Latitude for location search' })
  @ApiQuery({ name: 'longitude', required: false, description: 'Longitude for location search' })
  @ApiQuery({ name: 'radius', required: false, description: 'Search radius in miles' })
  @ApiQuery({ name: 'sortBy', required: false, description: 'Sort by field', enum: ['price', 'rating', 'createdAt', 'distance'] })
  @ApiQuery({ name: 'sortOrder', required: false, description: 'Sort order', enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'verifiedOnly', required: false, description: 'Filter by verified providers only' })
  @ApiQuery({ name: 'tags', required: false, description: 'Filter by tags (comma-separated)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Services retrieved successfully',
    type: ServiceListResponseDto
  })
  async findAll(@Query() query: any): Promise<ServiceListResponseDto> {
    // Convert query parameters to proper types
    const searchDto: ServiceSearchDto = {
      ...query,
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      latitude: query.latitude ? parseFloat(query.latitude) : undefined,
      longitude: query.longitude ? parseFloat(query.longitude) : undefined,
      radius: query.radius ? parseFloat(query.radius) : undefined,
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
      verifiedOnly: query.verifiedOnly === 'true',
      tags: query.tags ? query.tags.split(',') : undefined,
    };

    return this.servicesService.findAll(searchDto);
  }

  // 🏷️ GET SERVICE CATEGORIES
  @Get('categories')
  @ApiOperation({ 
    summary: 'Get all service categories with counts',
    description: 'Public endpoint to get available service categories with service counts and icons'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Categories retrieved successfully',
    type: ServiceCategoriesResponseDto
  })
  async getCategories(): Promise<ServiceCategoriesResponseDto> {
    return this.servicesService.getCategories();
  }

  // 🎯 GET FEATURED SERVICES
  @Get('featured')
  @ApiOperation({ 
    summary: 'Get featured services',
    description: 'Public endpoint to get high-rated services from verified providers'
  })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of services to return' })
  @ApiResponse({ 
    status: 200, 
    description: 'Featured services retrieved successfully',
    type: [ServiceResponseDto]
  })
  async getFeatured(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<ServiceResponseDto[]> {
    return this.servicesService.getFeaturedServices(limit);
  }

  // 👤 GET SERVICES BY PROVIDER
  @Get('provider/:providerId')
  @ApiOperation({ 
    summary: 'Get services by provider ID',
    description: 'Public endpoint to get all services from a specific provider'
  })
  @ApiParam({ name: 'providerId', description: 'Provider ID' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiResponse({ 
    status: 200, 
    description: 'Provider services retrieved successfully',
    type: ServiceListResponseDto
  })
  @ApiResponse({ status: 404, description: 'Provider not found' })
  async findByProvider(
    @Param('providerId') providerId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ): Promise<ServiceListResponseDto> {
    return this.servicesService.findByProvider(providerId, page, limit);
  }

  // 🔍 GET SERVICE BY ID
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get service by ID',
    description: 'Public endpoint to get detailed information about a specific service'
  })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service retrieved successfully',
    type: ServiceResponseDto
  })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async findOne(@Param('id') id: string): Promise<ServiceResponseDto> {
    return this.servicesService.findOne(id);
  }

  // ✏️ UPDATE SERVICE (owner or admin only)
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Update service',
    description: 'Update service information. Only service owner or admin can update.'
  })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'Service updated successfully',
    type: ServiceResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You can only update your own services' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Request() req: any
  ): Promise<ServiceResponseDto> {
    return this.servicesService.update(id, updateServiceDto, req.user.id);
  }

  // 🗑️ DELETE SERVICE (owner or admin only)
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Delete service',
    description: 'Delete service permanently. Only service owner or admin can delete.'
  })
  @ApiParam({ name: 'id', description: 'Service ID' })
  @ApiResponse({ status: 204, description: 'Service deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'You can only delete your own services' })
  @ApiResponse({ status: 404, description: 'Service not found' })
  async remove(
    @Param('id') id: string,
    @Request() req: any
  ): Promise<void> {
    await this.servicesService.remove(id, req.user.id);
  }

  // 🎯 SEARCH SERVICES BY LOCATION
  @Get('location/nearby')
  @ApiOperation({ 
    summary: 'Find services near a location',
    description: 'Find services within a specified radius of a location'
  })
  @ApiQuery({ name: 'latitude', required: true, description: 'Latitude coordinate' })
  @ApiQuery({ name: 'longitude', required: true, description: 'Longitude coordinate' })
  @ApiQuery({ name: 'radius', required: false, description: 'Search radius in miles (default: 25)' })
  @ApiQuery({ name: 'category', required: false, description: 'Service category filter' })
  @ApiQuery({ name: 'limit', required: false, description: 'Number of services to return' })
  @ApiResponse({ 
    status: 200, 
    description: 'Nearby services retrieved successfully',
    type: ServiceListResponseDto
  })
  @ApiResponse({ status: 400, description: 'Invalid coordinates' })
  async findNearby(
    @Query('latitude') latitude: string,
    @Query('longitude') longitude: string,
    @Query('radius', new DefaultValuePipe('25')) radius: string,
    @Query('category') category?: string,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit?: number
  ): Promise<ServiceListResponseDto> {
    const searchDto: ServiceSearchDto = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      radius: parseFloat(radius),
      category: category as any,
      limit,
      sortBy: 'distance',
      sortOrder: 'asc'
    };

    return this.servicesService.findAll(searchDto);
  }

  // 📊 GET SERVICE STATISTICS (admin only)
  @Get('admin/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Get service statistics',
    description: 'Get comprehensive service statistics for admin dashboard'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Service statistics retrieved successfully'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async getStats(): Promise<any> {
    // This would be implemented later with detailed statistics
    return { message: 'Service statistics endpoint - to be implemented' };
  }

  // 🔄 BULK UPDATE SERVICES (admin only)
  @Patch('admin/bulk-update')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Bulk update services',
    description: 'Update multiple services at once (admin only)'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Services updated successfully'
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Admin access required' })
  async bulkUpdate(@Body() updateData: any): Promise<any> {
    // This would be implemented later for bulk operations
    return { message: 'Bulk update endpoint - to be implemented' };
  }
} 