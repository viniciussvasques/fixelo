import { Controller, Get, Post, Put, Delete, Param, Body, Query, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { Response } from 'express';
import * as path from 'path';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard HTML page
  @Get('dashboard')
  async getDashboard(@Res() res: Response) {
    return res.sendFile(path.join(__dirname, 'dashboard.html'));
  }

  // Dashboard endpoints
  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('dashboard/metrics')
  async getDashboardMetrics(@Query('period') period: string = '30d') {
    return this.adminService.getDashboardMetrics(period);
  }

  @Get('dashboard/revenue')
  async getRevenueStats(@Query('period') period: string = '30d') {
    return this.adminService.getRevenueStats(period);
  }

  // User management
  @Get('users')
  async getAllUsers(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.adminService.getAllUsers(page, limit);
  }

  @Get('users/:id')
  async getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  @Put('users/:id')
  async updateUser(@Param('id') id: string, @Body() updateData: any) {
    return this.adminService.updateUser(id, updateData);
  }

  @Post('users/:id/suspend')
  async suspendUser(@Param('id') id: string) {
    return this.adminService.suspendUser(id);
  }

  @Post('users/:id/activate')
  async activateUser(@Param('id') id: string) {
    return this.adminService.activateUser(id);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // Service management
  @Get('services')
  async getAllServices(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.adminService.getAllServices(page, limit);
  }

  @Get('services/:id')
  async getServiceById(@Param('id') id: string) {
    return this.adminService.getServiceById(id);
  }

  @Put('services/:id')
  async updateService(@Param('id') id: string, @Body() updateData: any) {
    return this.adminService.updateService(id, updateData);
  }

  @Post('services/:id/approve')
  async approveService(@Param('id') id: string) {
    return this.adminService.approveService(id);
  }

  @Post('services/:id/suspend')
  async suspendService(@Param('id') id: string) {
    return this.adminService.suspendService(id);
  }

  @Delete('services/:id')
  async deleteService(@Param('id') id: string) {
    return this.adminService.deleteService(id);
  }

  // Booking management
  @Get('bookings')
  async getAllBookings(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.adminService.getAllBookings(page, limit);
  }

  @Get('bookings/:id')
  async getBookingById(@Param('id') id: string) {
    return this.adminService.getBookingById(id);
  }

  @Post('bookings/:id/resolve-dispute')
  async resolveDispute(@Param('id') id: string, @Body() resolution: any) {
    return this.adminService.resolveDispute(id, resolution);
  }

  @Put('bookings/:id/status')
  async updateBookingStatus(@Param('id') id: string, @Body() statusData: any) {
    return this.adminService.updateBookingStatus(id, statusData);
  }

  // Review management
  @Get('reviews')
  async getAllReviews(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.adminService.getAllReviews(page, limit);
  }

  @Get('reviews/:id')
  async getReviewById(@Param('id') id: string) {
    return this.adminService.getReviewById(id);
  }

  @Post('reviews/:id/moderate')
  async moderateReview(@Param('id') id: string, @Body() moderationData: any) {
    return this.adminService.moderateReview(id, moderationData);
  }

  @Delete('reviews/:id')
  async deleteReview(@Param('id') id: string) {
    return this.adminService.deleteReview(id);
  }

  // Plan management
  @Get('plans')
  async getAllPlans() {
    return this.adminService.getAllPlans();
  }

  @Get('plans/:id')
  async getPlanById(@Param('id') id: string) {
    return this.adminService.getPlanById(id);
  }

  @Post('plans')
  async createPlan(@Body() planData: any) {
    return this.adminService.createPlan(planData);
  }

  @Put('plans/:id')
  async updatePlan(@Param('id') id: string, @Body() updateData: any) {
    return this.adminService.updatePlan(id, updateData);
  }

  @Delete('plans/:id')
  async deletePlan(@Param('id') id: string) {
    return this.adminService.deletePlan(id);
  }

  // Subscription management
  @Get('subscriptions')
  async getAllSubscriptions(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.adminService.getAllSubscriptions(page, limit);
  }

  @Get('subscriptions/:id')
  async getSubscriptionById(@Param('id') id: string) {
    return this.adminService.getSubscriptionById(id);
  }

  @Post('subscriptions/:id/cancel')
  async cancelSubscription(@Param('id') id: string) {
    return this.adminService.cancelSubscription(id);
  }

  @Post('subscriptions/:id/reactivate')
  async reactivateSubscription(@Param('id') id: string) {
    return this.adminService.reactivateSubscription(id);
  }

  // Transaction management
  @Get('transactions')
  async getAllTransactions(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.adminService.getAllTransactions(page, limit);
  }

  @Get('transactions/:id')
  async getTransactionById(@Param('id') id: string) {
    return this.adminService.getTransactionById(id);
  }

  @Post('transactions/:id/refund')
  async refundTransaction(@Param('id') id: string, @Body() refundData: any) {
    return this.adminService.refundTransaction(id, refundData);
  }

  // Ad Campaign management
  @Get('ads/campaigns')
  async getAllCampaigns(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.adminService.getAllCampaigns(page, limit);
  }

  @Get('ads/campaigns/:id')
  async getCampaignById(@Param('id') id: string) {
    return this.adminService.getCampaignById(id);
  }

  @Post('ads/campaigns/:id/approve')
  async approveCampaign(@Param('id') id: string) {
    return this.adminService.approveCampaign(id);
  }

  @Post('ads/campaigns/:id/suspend')
  async suspendCampaign(@Param('id') id: string) {
    return this.adminService.suspendCampaign(id);
  }

  // Notification management
  @Get('notifications')
  async getAllNotifications(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.adminService.getAllNotifications(page, limit);
  }

  @Post('notifications/broadcast')
  async broadcastNotification(@Body() notificationData: any) {
    return this.adminService.broadcastNotification(notificationData);
  }

  // Audit logs
  @Get('audit-logs')
  async getAuditLogs(@Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    return this.adminService.getAuditLogs(page, limit);
  }

  // System health
  @Get('health')
  async getSystemHealth() {
    return this.adminService.getSystemHealth();
  }

  // Reports
  @Get('reports/users')
  async getUserReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.adminService.getUserReport(startDate, endDate);
  }

  @Get('reports/revenue')
  async getRevenueReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.adminService.getRevenueReport(startDate, endDate);
  }

  @Get('reports/bookings')
  async getBookingReport(@Query('startDate') startDate: string, @Query('endDate') endDate: string) {
    return this.adminService.getBookingReport(startDate, endDate);
  }

  // Support tools
  @Get('support/user-activity/:userId')
  async getUserActivity(@Param('userId') userId: string) {
    return this.adminService.getUserActivity(userId);
  }

  @Post('support/impersonate/:userId')
  async impersonateUser(@Param('userId') userId: string) {
    return this.adminService.impersonateUser(userId);
  }

  @Post('support/send-message')
  async sendSupportMessage(@Body() messageData: any) {
    return this.adminService.sendSupportMessage(messageData);
  }
} 