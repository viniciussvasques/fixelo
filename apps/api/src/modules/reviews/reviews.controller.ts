import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, ReviewResponseDto, ProviderResponseDto, ReviewStatsDto, ReviewFiltersDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '@fixelo/common';

@ApiTags('Reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a review (clients only)' })
  @ApiResponse({ status: 201, description: 'Review created successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request - booking not completed or review already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - not a client or not your booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async createReview(
    @CurrentUser() user: any,
    @Body() createReviewDto: CreateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.createReview(user.id, createReviewDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Update a review (clients only)' })
  @ApiResponse({ status: 200, description: 'Review updated successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async updateReview(
    @CurrentUser() user: any,
    @Param('id') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.updateReview(user.id, reviewId, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a review (clients only)' })
  @ApiResponse({ status: 204, description: 'Review deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async deleteReview(
    @CurrentUser() user: any,
    @Param('id') reviewId: string,
  ): Promise<void> {
    return this.reviewsService.deleteReview(user.id, reviewId);
  }

  @Post(':id/response')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Add provider response to a review (providers only)' })
  @ApiResponse({ status: 200, description: 'Response added successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 403, description: 'Forbidden - not your review' })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async addProviderResponse(
    @CurrentUser() user: any,
    @Param('id') reviewId: string,
    @Body() providerResponseDto: ProviderResponseDto,
  ): Promise<ReviewResponseDto> {
    return this.reviewsService.addProviderResponse(user.id, reviewId, providerResponseDto.response);
  }

  @Get()
  @ApiOperation({ summary: 'Get reviews with filters' })
  @ApiQuery({ name: 'rating', required: false, type: Number, description: 'Filter by rating (1-5)' })
  @ApiQuery({ name: 'serviceId', required: false, type: String, description: 'Filter by service ID' })
  @ApiQuery({ name: 'providerId', required: false, type: String, description: 'Filter by provider ID' })
  @ApiQuery({ name: 'clientId', required: false, type: String, description: 'Filter by client ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async getReviews(
    @Query('rating') rating?: number,
    @Query('serviceId') serviceId?: string,
    @Query('providerId') providerId?: string,
    @Query('clientId') clientId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{ reviews: ReviewResponseDto[]; total: number; page: number; limit: number }> {
    const filters: ReviewFiltersDto = {
      rating: rating ? Number(rating) : undefined,
      serviceId,
      providerId,
      clientId,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };
    return this.reviewsService.getReviews(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a review by ID' })
  @ApiResponse({ status: 200, description: 'Review retrieved successfully', type: ReviewResponseDto })
  @ApiResponse({ status: 404, description: 'Review not found' })
  async getReviewById(@Param('id') reviewId: string): Promise<ReviewResponseDto> {
    return this.reviewsService.getReviewById(reviewId);
  }

  @Get('providers/:providerId/stats')
  @ApiOperation({ summary: 'Get provider review statistics' })
  @ApiResponse({ status: 200, description: 'Provider stats retrieved successfully', type: ReviewStatsDto })
  async getProviderStats(@Param('providerId') providerId: string): Promise<ReviewStatsDto> {
    return this.reviewsService.getProviderStats(providerId);
  }

  @Get('services/:serviceId/stats')
  @ApiOperation({ summary: 'Get service review statistics' })
  @ApiResponse({ status: 200, description: 'Service stats retrieved successfully', type: ReviewStatsDto })
  async getServiceStats(@Param('serviceId') serviceId: string): Promise<ReviewStatsDto> {
    return this.reviewsService.getServiceStats(serviceId);
  }

  @Get('my/given')
  @UseGuards(RolesGuard)
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Get reviews given by current client' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async getMyGivenReviews(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{ reviews: ReviewResponseDto[]; total: number; page: number; limit: number }> {
    const filters: ReviewFiltersDto = {
      clientId: user.id,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };
    return this.reviewsService.getReviews(filters);
  }

  @Get('my/received')
  @UseGuards(RolesGuard)
  @Roles(UserRole.PROVIDER)
  @ApiOperation({ summary: 'Get reviews received by current provider' })
  @ApiResponse({ status: 200, description: 'Reviews retrieved successfully' })
  async getMyReceivedReviews(
    @CurrentUser() user: any,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<{ reviews: ReviewResponseDto[]; total: number; page: number; limit: number }> {
    const filters: ReviewFiltersDto = {
      providerId: user.id,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
    };
    return this.reviewsService.getReviews(filters);
  }
} 