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
  HttpStatus,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import {
  CreateBookingDto,
  UpdateBookingDto,
  UpdateBookingStatusDto,
  CancelBookingDto,
  BookingFilterDto,
  BookingResponseDto,
  BookingListResponseDto,
  BookingStatsResponseDto,
  CancelBookingResponseDto,
  BookingStatus
} from './dto/booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

enum UserRole {
  CLIENT = 'CLIENT',
  PROVIDER = 'PROVIDER',
  ADMIN = 'ADMIN'
}

@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Booking created successfully', type: BookingResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid booking data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Service not found' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createBookingDto: CreateBookingDto, @Request() req) {
    return this.bookingsService.create(createBookingDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.CLIENT, UserRole.PROVIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all bookings with filters' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Bookings retrieved successfully', type: BookingListResponseDto })
  @ApiQuery({ name: 'status', enum: BookingStatus, required: false })
  @ApiQuery({ name: 'startDate', type: String, required: false })
  @ApiQuery({ name: 'endDate', type: String, required: false })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'limit', type: Number, required: false })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async findAll(@Query() filters: BookingFilterDto, @Request() req) {
    return this.bookingsService.findAll(filters, req.user.id, req.user.role);
  }

  @Get('stats')
  @Roles(UserRole.CLIENT, UserRole.PROVIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get booking statistics' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Statistics retrieved successfully', type: BookingStatsResponseDto })
  async getStats(@Request() req) {
    return this.bookingsService.getStats(req.user.id, req.user.role);
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.PROVIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking retrieved successfully', type: BookingResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.bookingsService.findOne(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  @Roles(UserRole.CLIENT, UserRole.PROVIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update booking details' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking updated successfully', type: BookingResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid update data' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async update(
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Request() req
  ) {
    return this.bookingsService.update(id, updateBookingDto, req.user.id, req.user.role);
  }

  @Patch(':id/status')
  @Roles(UserRole.PROVIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update booking status' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking status updated successfully', type: BookingResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid status transition' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateBookingStatusDto,
    @Request() req
  ) {
    return this.bookingsService.updateStatus(id, updateStatusDto.status, req.user.id, req.user.role);
  }

  @Post(':id/cancel')
  @Roles(UserRole.CLIENT, UserRole.PROVIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Cancel a booking' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking cancelled successfully', type: CancelBookingResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cannot cancel booking' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async cancel(
    @Param('id') id: string,
    @Body() cancelDto: CancelBookingDto,
    @Request() req
  ) {
    return this.bookingsService.cancel(id, req.user.id, req.user.role, cancelDto.reason);
  }

  @Post(':id/confirm')
  @Roles(UserRole.PROVIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Confirm a booking' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking confirmed successfully', type: BookingResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cannot confirm booking' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied' })
  async confirm(@Param('id') id: string, @Request() req) {
    return this.bookingsService.updateStatus(id, BookingStatus.CONFIRMED, req.user.id, req.user.role);
  }

  @Post(':id/start')
  @Roles(UserRole.PROVIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Start a booking (mark as in progress)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking started successfully', type: BookingResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cannot start booking' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied' })
  async start(@Param('id') id: string, @Request() req) {
    return this.bookingsService.updateStatus(id, BookingStatus.IN_PROGRESS, req.user.id, req.user.role);
  }

  @Post(':id/complete')
  @Roles(UserRole.PROVIDER, UserRole.ADMIN)
  @ApiOperation({ summary: 'Complete a booking' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking completed successfully', type: BookingResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cannot complete booking' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied' })
  async complete(@Param('id') id: string, @Request() req) {
    return this.bookingsService.updateStatus(id, BookingStatus.COMPLETED, req.user.id, req.user.role);
  }

  @Post(':id/dispute')
  @Roles(UserRole.CLIENT, UserRole.ADMIN)
  @ApiOperation({ summary: 'Dispute a booking' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Booking disputed successfully', type: BookingResponseDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Cannot dispute booking' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Access denied' })
  async dispute(@Param('id') id: string, @Request() req) {
    return this.bookingsService.updateStatus(id, BookingStatus.DISPUTED, req.user.id, req.user.role);
  }

  // Admin-only endpoints
  @Get('admin/all')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all bookings (admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'All bookings retrieved successfully', type: BookingListResponseDto })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
  async findAllAdmin(@Query() filters: BookingFilterDto, @Request() req) {
    return this.bookingsService.findAll(filters, req.user.id, UserRole.ADMIN);
  }

  @Get('admin/stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get global booking statistics (admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Global statistics retrieved successfully', type: BookingStatsResponseDto })
  async getGlobalStats(@Request() req) {
    return this.bookingsService.getStats(req.user.id, UserRole.ADMIN);
  }

  @Patch('admin/:id/resolve-dispute')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Resolve a disputed booking (admin only)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Dispute resolved successfully', type: BookingResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Booking not found' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async resolveDispute(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateBookingStatusDto,
    @Request() req
  ) {
    return this.bookingsService.updateStatus(id, updateStatusDto.status, req.user.id, UserRole.ADMIN);
  }
} 