import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpController } from './help.controller';
import { HelpService } from './help.service';
import { HelpArticle } from './entities/help-article.entity';
import { SupportTicket } from './entities/support-ticket.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HelpArticle, SupportTicket, User])],
  controllers: [HelpController],
  providers: [HelpService],
  exports: [HelpService],
})
export class HelpModule {}
