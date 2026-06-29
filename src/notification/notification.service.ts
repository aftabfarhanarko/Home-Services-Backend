import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';
import { UsersService } from '../users/users.service';
import { RoleType } from '../roles/entities/role.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    private usersService: UsersService,
  ) {}

  async createForUser(userId: number, message: string, type: NotificationType) {
    const notification = this.notificationRepository.create({
      userId,
      message,
      type,
    });
    return await this.notificationRepository.save(notification);
  }

  async createForSuperAdmins(message: string, type: NotificationType) {
    const superAdmins = await this.usersService.findByRoleName(RoleType.SUPER_ADMIN);
    const notifications = superAdmins.map(admin => 
      this.notificationRepository.create({
        userId: admin.id,
        message,
        type,
      })
    );
    if (notifications.length > 0) {
      await this.notificationRepository.save(notifications);
    }
  }

  async getUserNotifications(userId: number) {
    return await this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number, userId: number) {
    const notification = await this.notificationRepository.findOne({ where: { id, userId } });
    if (!notification) {
      throw new NotFoundException(`Notification #${id} not found`);
    }
    notification.isRead = true;
    return await this.notificationRepository.save(notification);
  }
}
