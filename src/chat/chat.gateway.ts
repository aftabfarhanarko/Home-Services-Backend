import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // Map to store connected user sockets: userId -> socketId
  private connectedUsers = new Map<number, string>();

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      this.connectedUsers.set(Number(userId), client.id);
      // Join a room with their own user ID for easier targeting
      client.join(userId.toString());
      console.log(`User ${userId} connected with socket ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId;
    if (userId) {
      this.connectedUsers.delete(Number(userId));
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: number; content: string; imageUrl?: string },
  ) {
    const senderId = Number(client.handshake.query.userId);
    if (!senderId || !payload.receiverId || (!payload.content && !payload.imageUrl)) return;

    // Save to DB
    const message = await this.chatService.saveMessage(
      senderId,
      payload.receiverId,
      payload.content,
      payload.imageUrl,
    );

    // Emit to receiver's room
    this.server.to(payload.receiverId.toString()).emit('newMessage', message);
    
    // Also emit back to sender to confirm
    client.emit('messageSent', message);
    
    // If it's a new conversation, we might want to alert the receiver's inbox
    this.server.to(payload.receiverId.toString()).emit('inboxUpdate', message);
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { receiverId: number; isTyping: boolean },
  ) {
    const senderId = Number(client.handshake.query.userId);
    if (!senderId || !payload.receiverId) return;

    this.server.to(payload.receiverId.toString()).emit('userTyping', {
      senderId,
      isTyping: payload.isTyping,
    });
  }
}
