import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateMessageDto, MessageResponseDto, MarkAsReadDto } from './dto/message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Send a message in a booking chat' })
  @ApiResponse({ status: 201, description: 'Message sent successfully', type: MessageResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - not part of booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async sendMessage(
    @CurrentUser() user: any,
    @Body() createMessageDto: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    return this.chatService.createMessage(user.id, createMessageDto);
  }

  @Get('bookings/:bookingId/messages')
  @ApiOperation({ summary: 'Get messages for a booking' })
  @ApiResponse({ status: 200, description: 'Messages retrieved successfully', type: [MessageResponseDto] })
  @ApiResponse({ status: 403, description: 'Forbidden - not part of booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getMessages(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ): Promise<MessageResponseDto[]> {
    return this.chatService.getMessages(user.id, bookingId, page, limit);
  }

  @Post('messages/:messageId/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark a message as read' })
  @ApiResponse({ status: 204, description: 'Message marked as read' })
  @ApiResponse({ status: 400, description: 'Cannot mark own message as read' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async markAsRead(
    @CurrentUser() user: any,
    @Param('messageId') messageId: string,
  ): Promise<void> {
    return this.chatService.markAsRead(user.id, messageId);
  }

  @Get('bookings/:bookingId/unread-count')
  @ApiOperation({ summary: 'Get unread message count for a booking' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - not part of booking' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getUnreadCount(
    @CurrentUser() user: any,
    @Param('bookingId') bookingId: string,
  ): Promise<{ count: number }> {
    const count = await this.chatService.getUnreadCount(user.id, bookingId);
    return { count };
  }

  @Get('chats')
  @ApiOperation({ summary: 'Get all chats for the current user' })
  @ApiResponse({ status: 200, description: 'Chats retrieved successfully' })
  async getUserChats(@CurrentUser() user: any): Promise<any[]> {
    return this.chatService.getUserChats(user.id);
  }

  @Delete('messages/:messageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a message (only own messages)' })
  @ApiResponse({ status: 204, description: 'Message deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - can only delete own messages' })
  @ApiResponse({ status: 404, description: 'Message not found' })
  async deleteMessage(
    @CurrentUser() user: any,
    @Param('messageId') messageId: string,
  ): Promise<void> {
    return this.chatService.deleteMessage(user.id, messageId);
  }
} 