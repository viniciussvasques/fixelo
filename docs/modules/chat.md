# Chat Module Documentation

## Overview

The Chat module provides real-time messaging functionality between clients and providers within the context of a booking. It uses Socket.IO for real-time communication and includes REST API endpoints for message management.

## Features

### Real-time Communication
- **WebSocket Gateway**: Socket.IO-based real-time messaging
- **Room-based Chat**: Messages are isolated per booking
- **Authentication**: JWT-based authentication for WebSocket connections
- **Online Status**: Track user online/offline status
- **Typing Indicators**: Real-time typing notifications

### Message Management
- **Send Messages**: Text, image, file, and system messages
- **Message History**: Paginated message retrieval
- **Read Receipts**: Mark messages as read/unread
- **Message Deletion**: Users can delete their own messages
- **Unread Count**: Track unread messages per chat

### Security & Authorization
- **Booking-based Access**: Only booking participants can access chat
- **Role Verification**: Clients and providers have appropriate permissions
- **Message Ownership**: Users can only delete their own messages

## API Endpoints

### REST API

#### Send Message
```http
POST /api/chat/messages
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Hello, when can you start?",
  "bookingId": "clh123...",
  "messageType": "TEXT"
}
```

#### Get Messages
```http
GET /api/chat/bookings/{bookingId}/messages?page=1&limit=50
Authorization: Bearer <token>
```

#### Mark as Read
```http
POST /api/chat/messages/{messageId}/read
Authorization: Bearer <token>
```

#### Get Unread Count
```http
GET /api/chat/bookings/{bookingId}/unread-count
Authorization: Bearer <token>
```

#### Get User Chats
```http
GET /api/chat/chats
Authorization: Bearer <token>
```

#### Delete Message
```http
DELETE /api/chat/messages/{messageId}
Authorization: Bearer <token>
```

### WebSocket Events

#### Connection
```javascript
const socket = io('/chat', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

#### Join Chat Room
```javascript
socket.emit('join_chat', { bookingId: 'clh123...' });
socket.on('joined_chat', (data) => {
  console.log('Joined chat:', data);
});
```

#### Send Message
```javascript
socket.emit('send_message', {
  content: 'Hello!',
  bookingId: 'clh123...',
  messageType: 'TEXT'
});
```

#### Receive Messages
```javascript
socket.on('new_message', (message) => {
  console.log('New message:', message);
});
```

#### Typing Indicators
```javascript
// Start typing
socket.emit('typing_start', { bookingId: 'clh123...' });

// Stop typing
socket.emit('typing_stop', { bookingId: 'clh123...' });

// Listen for typing
socket.on('user_typing', (data) => {
  console.log('User typing:', data);
});
```

#### Mark as Read
```javascript
socket.emit('mark_as_read', { messageId: 'msg123...' });
socket.on('message_read', (data) => {
  console.log('Message read:', data);
});
```

#### Online Status
```javascript
socket.emit('get_online_status', { userId: 'user123...' });
socket.on('online_status', (data) => {
  console.log('User online:', data.isOnline);
});
```

## Data Models

### Message
```typescript
interface Message {
  id: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
  bookingId: string;
  senderId: string;
  readAt?: Date;
  createdAt: Date;
  
  // Relations
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}
```

### Chat Room
```typescript
interface ChatRoom {
  bookingId: string;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  service: {
    id: string;
    title: string;
    category: string;
  };
  lastMessage?: {
    id: string;
    content: string;
    messageType: string;
    sender: {
      id: string;
      firstName: string;
      lastName: string;
    };
    createdAt: Date;
  };
  unreadCount: number;
  bookingStatus: string;
  updatedAt: Date;
}
```

## Frontend Integration

### React/Next.js Example

```typescript
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';

interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  createdAt: Date;
  sender: {
    firstName: string;
    lastName: string;
  };
}

export function useChat(bookingId: string, token: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('/chat', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('join_chat', { bookingId });
    });

    newSocket.on('new_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [bookingId, token]);

  const sendMessage = (content: string) => {
    if (socket && isConnected) {
      socket.emit('send_message', {
        content,
        bookingId,
        messageType: 'TEXT'
      });
    }
  };

  return {
    messages,
    sendMessage,
    isConnected,
    socket
  };
}
```

### React Native Example

```typescript
import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

export function ChatScreen({ bookingId, token }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3000/chat', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_chat', { bookingId });
    });

    newSocket.on('new_message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, [bookingId, token]);

  const sendMessage = () => {
    if (socket && inputText.trim()) {
      socket.emit('send_message', {
        content: inputText,
        bookingId,
        messageType: 'TEXT'
      });
      setInputText('');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text>{item.sender.firstName}: {item.content}</Text>
        )}
      />
      <TextInput
        value={inputText}
        onChangeText={setInputText}
        placeholder="Type a message..."
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}
```

## Testing

### Unit Tests

```typescript
describe('ChatService', () => {
  let service: ChatService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ChatService, PrismaService],
    }).compile();

    service = module.get<ChatService>(ChatService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should create a message', async () => {
    const mockBooking = {
      id: 'booking1',
      clientId: 'client1',
      providerId: 'provider1',
      serviceId: 'service1',
    };

    jest.spyOn(prisma.booking, 'findUnique').mockResolvedValue(mockBooking);
    jest.spyOn(prisma.message, 'create').mockResolvedValue({
      id: 'msg1',
      content: 'Hello',
      messageType: 'TEXT',
      bookingId: 'booking1',
      senderId: 'client1',
      createdAt: new Date(),
      readAt: null,
      sender: {
        id: 'client1',
        firstName: 'John',
        lastName: 'Doe',
        avatar: null,
      },
    });

    const result = await service.createMessage('client1', {
      content: 'Hello',
      bookingId: 'booking1',
      messageType: 'TEXT',
    });

    expect(result.content).toBe('Hello');
    expect(result.senderId).toBe('client1');
  });
});
```

### Integration Tests

```typescript
describe('ChatController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Login and get token
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.accessToken;
  });

  it('/chat/messages (POST)', () => {
    return request(app.getHttpServer())
      .post('/chat/messages')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        content: 'Test message',
        bookingId: 'booking-id',
        messageType: 'TEXT',
      })
      .expect(201);
  });
});
```

## Security Considerations

1. **Authentication**: All WebSocket connections must be authenticated with JWT
2. **Authorization**: Users can only access chats for their own bookings
3. **Message Ownership**: Users can only delete their own messages
4. **Rate Limiting**: Consider implementing rate limiting for message sending
5. **Content Validation**: Validate message content for safety and appropriateness
6. **File Uploads**: Implement secure file upload handling for image/file messages

## Performance Optimization

1. **Message Pagination**: Implement efficient pagination for message history
2. **Connection Pooling**: Use connection pooling for database operations
3. **Caching**: Cache frequently accessed data (user info, booking details)
4. **Message Queuing**: Consider using Redis for message queuing in high-traffic scenarios
5. **Database Indexing**: Ensure proper indexing on bookingId and senderId fields

## Deployment Considerations

1. **Sticky Sessions**: Configure load balancer for sticky sessions with Socket.IO
2. **Redis Adapter**: Use Redis adapter for Socket.IO in multi-server deployments
3. **Monitoring**: Monitor WebSocket connections and message throughput
4. **Scaling**: Consider horizontal scaling strategies for high-traffic scenarios

## Error Handling

The chat system includes comprehensive error handling:

- **Connection Errors**: Handle WebSocket connection failures gracefully
- **Authentication Errors**: Properly handle JWT validation failures
- **Authorization Errors**: Clear error messages for access denied scenarios
- **Network Errors**: Retry mechanisms for network failures
- **Rate Limiting**: Graceful handling of rate limit exceeded errors

## Future Enhancements

1. **File Sharing**: Implement secure file and image sharing
2. **Message Reactions**: Add emoji reactions to messages
3. **Message Threading**: Support for threaded conversations
4. **Push Notifications**: Mobile push notifications for new messages
5. **Message Search**: Full-text search across message history
6. **Message Encryption**: End-to-end encryption for sensitive communications
7. **Audio Messages**: Support for voice messages
8. **Video Calls**: Integration with video calling services
9. **Message Translation**: Automatic translation for multi-language support
10. **Chat Bots**: Integration with AI chatbots for automated responses 