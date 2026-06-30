import { Controller, Get, Patch, Param, UseGuards, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notification')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getUserNotifications(@Request() req) {
    return this.notificationService.getUserNotifications(req.user.userId);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationService.markAsRead(+id, req.user.userId);
  }
}
