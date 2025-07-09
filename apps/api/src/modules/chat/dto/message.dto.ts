import { IsString, IsOptional, IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType } from '@fixelo/common';

export class CreateMessageDto {
  @ApiProperty({ description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'Booking ID', example: 'clh123...' })
  @IsUUID()
  @IsNotEmpty()
  bookingId: string;

  @ApiProperty({ enum: MessageType, default: MessageType.TEXT })
  @IsEnum(MessageType)
  @IsOptional()
  messageType?: MessageType = MessageType.TEXT;
}

export class MessageResponseDto {
  @ApiProperty({ description: 'Message ID' })
  id: string;

  @ApiProperty({ description: 'Message content' })
  content: string;

  @ApiProperty({ enum: MessageType })
  messageType: MessageType;

  @ApiProperty({ description: 'Booking ID' })
  bookingId: string;

  @ApiProperty({ description: 'Sender ID' })
  senderId: string;

  @ApiProperty({ description: 'Sender info' })
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };

  @ApiProperty({ description: 'Read timestamp', required: false })
  readAt?: Date;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;
}

export class MarkAsReadDto {
  @ApiProperty({ description: 'Message ID' })
  @IsUUID()
  @IsNotEmpty()
  messageId: string;
}

export class ChatRoomDto {
  @ApiProperty({ description: 'Booking ID' })
  @IsUUID()
  @IsNotEmpty()
  bookingId: string;
} 