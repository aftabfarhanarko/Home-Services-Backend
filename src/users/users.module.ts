import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { AuditLog } from './entities/audit-log.entity';
import { LoginLog } from './entities/login-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AuditLog, LoginLog])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
