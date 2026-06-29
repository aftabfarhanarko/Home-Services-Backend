import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async saveMessage(senderId: number, receiverId: number, content: string, imageUrl?: string): Promise<Message> {
    const sender = await this.userRepository.findOne({ where: { id: senderId } });
    const receiver = await this.userRepository.findOne({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new NotFoundException('Sender or receiver not found');
    }

    const message = this.messageRepository.create({
      sender,
      receiver,
      content,
      imageUrl,
    });

    return this.messageRepository.save(message);
  }

  async getChatHistory(userId1: number, userId2: number): Promise<Message[]> {
    return this.messageRepository.find({
      where: [
        { sender: { id: userId1 }, receiver: { id: userId2 } },
        { sender: { id: userId2 }, receiver: { id: userId1 } },
      ],
      order: { createdAt: 'ASC' },
      relations: { sender: true, receiver: true },
    });
  }

  async getAdminInbox(adminId: number): Promise<any[]> {
    // Get unique users who have chatted with this admin
    const messages = await this.messageRepository.find({
      where: [
        { receiver: { id: adminId } },
        { sender: { id: adminId } },
      ],
      order: { createdAt: 'DESC' },
      relations: { sender: true, receiver: true },
    });

    const uniqueUsers = new Map<number, any>();

    for (const msg of messages) {
      const otherUser = msg.sender.id === adminId ? msg.receiver : msg.sender;
      if (!uniqueUsers.has(otherUser.id)) {
        uniqueUsers.set(otherUser.id, {
          user: {
            id: otherUser.id,
            name: otherUser.name,
            email: otherUser.email,
          },
          lastMessage: msg.imageUrl ? '📷 Image' : msg.content,
          lastMessageAt: msg.createdAt,
          isRead: msg.isRead,
        });
      }
    }

    return Array.from(uniqueUsers.values());
  }

  async markAsRead(senderId: number, receiverId: number): Promise<void> {
    await this.messageRepository.update(
      { sender: { id: senderId }, receiver: { id: receiverId }, isRead: false },
      { isRead: true }
    );
  }
}
