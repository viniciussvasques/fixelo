import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto, MessageResponseDto } from './dto/message.dto';
import { MessageType } from '@fixelo/common';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createMessage(senderId: string, createMessageDto: CreateMessageDto): Promise<MessageResponseDto> {
    const { content, bookingId, messageType = MessageType.TEXT } = createMessageDto;

    // Verify booking exists and user is part of it
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        client: true,
        provider: true,
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Check if user is either client or provider of this booking
    if (booking.clientId !== senderId && booking.providerId !== senderId) {
      throw new ForbiddenException('You are not authorized to send messages in this chat');
    }

    // Create the message
    const message = await this.prisma.message.create({
      data: {
        content,
        messageType,
        bookingId,
        senderId,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    return {
      id: message.id,
      content: message.content,
      messageType: message.messageType as MessageType,
      bookingId: message.bookingId,
      senderId: message.senderId,
      sender: message.sender,
      readAt: message.readAt,
      createdAt: message.createdAt,
    };
  }

  async getMessages(userId: string, bookingId: string, page: number = 1, limit: number = 50): Promise<MessageResponseDto[]> {
    // Verify user is part of the booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.clientId !== userId && booking.providerId !== userId) {
      throw new ForbiddenException('You are not authorized to view messages in this chat');
    }

    const messages = await this.prisma.message.findMany({
      where: { bookingId },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return messages.map(message => ({
      id: message.id,
      content: message.content,
      messageType: message.messageType as MessageType,
      bookingId: message.bookingId,
      senderId: message.senderId,
      sender: message.sender,
      readAt: message.readAt,
      createdAt: message.createdAt,
    }));
  }

  async markAsRead(userId: string, messageId: string): Promise<void> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        booking: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // User can only mark messages as read if they are part of the booking and not the sender
    if (message.booking.clientId !== userId && message.booking.providerId !== userId) {
      throw new ForbiddenException('You are not authorized to mark this message as read');
    }

    if (message.senderId === userId) {
      throw new BadRequestException('You cannot mark your own message as read');
    }

    await this.prisma.message.update({
      where: { id: messageId },
      data: { readAt: new Date() },
    });
  }

  async getUnreadCount(userId: string, bookingId: string): Promise<number> {
    // Verify user is part of the booking
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.clientId !== userId && booking.providerId !== userId) {
      throw new ForbiddenException('You are not authorized to view this chat');
    }

    return await this.prisma.message.count({
      where: {
        bookingId,
        senderId: { not: userId },
        readAt: null,
      },
    });
  }

  async getUserChats(userId: string): Promise<any[]> {
    // Get all bookings where user is either client or provider
    const bookings = await this.prisma.booking.findMany({
      where: {
        OR: [
          { clientId: userId },
          { providerId: userId },
        ],
      },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        provider: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        service: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Format the response
    const chats = await Promise.all(
      bookings.map(async (booking) => {
        const otherUser = booking.clientId === userId ? booking.provider : booking.client;
        const lastMessage = booking.messages[0];
        const unreadCount = await this.getUnreadCount(userId, booking.id);

        return {
          bookingId: booking.id,
          otherUser,
          service: booking.service,
          lastMessage: lastMessage ? {
            id: lastMessage.id,
            content: lastMessage.content,
            messageType: lastMessage.messageType as MessageType,
            sender: lastMessage.sender,
            createdAt: lastMessage.createdAt,
          } : null,
          unreadCount,
          bookingStatus: booking.status,
          updatedAt: booking.updatedAt,
        };
      })
    );

    return chats;
  }

  async deleteMessage(userId: string, messageId: string): Promise<void> {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: {
        booking: true,
      },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    // Only sender can delete their own message
    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    await this.prisma.message.delete({
      where: { id: messageId },
    });
  }
} 