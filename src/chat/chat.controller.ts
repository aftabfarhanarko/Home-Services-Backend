import { Controller, Get, Param, UseGuards, Request, Patch } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('history/:otherUserId')
  async getChatHistory(@Request() req, @Param('otherUserId') otherUserId: string) {
    const currentUserId = req.user.sub;
    return this.chatService.getChatHistory(currentUserId, Number(otherUserId));
  }

  @Get('inbox')
  async getInbox(@Request() req) {
    const currentUserId = req.user.sub;
    return this.chatService.getAdminInbox(currentUserId);
  }

  @Patch('read/:senderId')
  async markAsRead(@Request() req, @Param('senderId') senderId: string) {
    const currentUserId = req.user.sub;
    await this.chatService.markAsRead(Number(senderId), currentUserId);
    return { success: true };
  }
}
