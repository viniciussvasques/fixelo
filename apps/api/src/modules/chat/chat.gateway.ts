import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatService } from './chat.service';
import { CreateMessageDto, MarkAsReadDto } from './dto/message.dto';

interface AuthenticatedSocket extends Socket {
  userId: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private logger = new Logger('ChatGateway');
  private connectedUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private chatService: ChatService,
    private jwtService: JwtService,
  ) {}

  async handleConnection(client: AuthenticatedSocket) {
    try {
      const token = client.handshake.auth.token || client.handshake.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);
      client.userId = payload.sub;
      
      this.connectedUsers.set(client.userId, client.id);
      
      this.logger.log(`User ${client.userId} connected to chat`);
      
      // Join user to their personal room for notifications
      client.join(`user_${client.userId}`);
      
    } catch (error) {
      this.logger.error(`Connection failed: ${error.message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      this.connectedUsers.delete(client.userId);
      this.logger.log(`User ${client.userId} disconnected from chat`);
    }
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { bookingId: string },
  ) {
    try {
      const { bookingId } = data;
      
      // Verify user has access to this booking
      const messages = await this.chatService.getMessages(client.userId, bookingId, 1, 1);
      
      // Join the booking room
      client.join(`booking_${bookingId}`);
      
      this.logger.log(`User ${client.userId} joined chat for booking ${bookingId}`);
      
      client.emit('joined_chat', { bookingId, success: true });
      
    } catch (error) {
      this.logger.error(`Join chat failed: ${error.message}`);
      client.emit('joined_chat', { success: false, error: error.message });
    }
  }

  @SubscribeMessage('leave_chat')
  async handleLeaveChat(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { bookingId: string },
  ) {
    const { bookingId } = data;
    client.leave(`booking_${bookingId}`);
    
    this.logger.log(`User ${client.userId} left chat for booking ${bookingId}`);
    client.emit('left_chat', { bookingId, success: true });
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    try {
      const message = await this.chatService.createMessage(client.userId, createMessageDto);
      
      // Emit to all users in the booking room
      this.server.to(`booking_${createMessageDto.bookingId}`).emit('new_message', message);
      
      // Send notification to the other user if they're online
      const booking = await this.chatService.getMessages(client.userId, createMessageDto.bookingId, 1, 1);
      // We need to get the other user ID from the booking
      // This is a simplified approach - in production, you'd want to optimize this
      
      this.logger.log(`Message sent in booking ${createMessageDto.bookingId} by user ${client.userId}`);
      
    } catch (error) {
      this.logger.error(`Send message failed: ${error.message}`);
      client.emit('message_error', { error: error.message });
    }
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() markAsReadDto: MarkAsReadDto,
  ) {
    try {
      await this.chatService.markAsRead(client.userId, markAsReadDto.messageId);
      
      // Emit read confirmation to the sender
      client.emit('message_read', { messageId: markAsReadDto.messageId });
      
      this.logger.log(`Message ${markAsReadDto.messageId} marked as read by user ${client.userId}`);
      
    } catch (error) {
      this.logger.error(`Mark as read failed: ${error.message}`);
      client.emit('read_error', { error: error.message });
    }
  }

  @SubscribeMessage('typing_start')
  async handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { bookingId: string },
  ) {
    client.to(`booking_${data.bookingId}`).emit('user_typing', {
      userId: client.userId,
      bookingId: data.bookingId,
      typing: true,
    });
  }

  @SubscribeMessage('typing_stop')
  async handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { bookingId: string },
  ) {
    client.to(`booking_${data.bookingId}`).emit('user_typing', {
      userId: client.userId,
      bookingId: data.bookingId,
      typing: false,
    });
  }

  @SubscribeMessage('get_online_status')
  async handleGetOnlineStatus(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { userId: string },
  ) {
    const isOnline = this.connectedUsers.has(data.userId);
    client.emit('online_status', { userId: data.userId, isOnline });
  }

  // Helper method to send notifications to specific users
  async sendNotificationToUser(userId: string, notification: any) {
    const socketId = this.connectedUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', notification);
    }
  }

  // Helper method to broadcast to a booking room
  async broadcastToBooking(bookingId: string, event: string, data: any) {
    this.server.to(`booking_${bookingId}`).emit(event, data);
  }
} 