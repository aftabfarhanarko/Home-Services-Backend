import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HelpArticle } from './entities/help-article.entity';
import { SupportTicket } from './entities/support-ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class HelpService {
  constructor(
    @InjectRepository(HelpArticle)
    private readonly articleRepository: Repository<HelpArticle>,
    @InjectRepository(SupportTicket)
    private readonly ticketRepository: Repository<SupportTicket>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getArticles(search?: string, category?: string) {
    const queryBuilder = this.articleRepository.createQueryBuilder('article');

    if (category) {
      queryBuilder.andWhere('article.category = :category', { category });
    }

    if (search) {
      queryBuilder.andWhere(
        '(article.title ILIKE :search OR article.titleBn ILIKE :search OR article.content ILIKE :search OR article.contentBn ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    return queryBuilder.orderBy('article.views', 'DESC').getMany();
  }

  async createTicket(userId: number, dto: CreateTicketDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);

    const ticket = this.ticketRepository.create({
      ticketId,
      user,
      subject: dto.subject,
      category: dto.category,
      priority: dto.priority,
      description: dto.description,
      replies: [],
    });

    return this.ticketRepository.save(ticket);
  }

  async getTicketsByUser(userId: number) {
    return this.ticketRepository.find({
      where: { user: { id: userId } },
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async getTicketById(id: number, userId: number, userRole?: string) {
    const normalizedRole = (userRole || '').toLowerCase().replace(/\s+/g, '');
    const isSuperAdmin = normalizedRole === 'superadmin';

    const ticket = await this.ticketRepository.findOne({
      where: isSuperAdmin ? { id } : { id, user: { id: userId } },
      relations: { user: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async addReply(id: number, userId: number, message: string) {
    const ticket = await this.ticketRepository.findOne({
      where: { id, user: { id: userId } },
      relations: { user: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    const name = user ? (user.name || 'Client') : 'Client';

    const newReply = {
      sender: 'user' as const,
      name,
      message,
      createdAt: new Date(),
    };

    ticket.replies = [...(ticket.replies || []), newReply];
    if (ticket.status === 'resolved') {
      ticket.status = 'in_progress';
    }

    return this.ticketRepository.save(ticket);
  }

  async getAllTickets() {
    return this.ticketRepository.find({
      relations: { user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async updateTicketStatus(id: number, status: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    ticket.status = status;
    return this.ticketRepository.save(ticket);
  }

  async addAdminReply(id: number, adminUserId: number, message: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const adminUser = await this.userRepository.findOne({ where: { id: adminUserId } });
    const name = adminUser ? (adminUser.name || 'Admin') : 'Admin';

    const newReply = {
      sender: 'admin' as const,
      name,
      message,
      createdAt: new Date(),
    };

    ticket.replies = [...(ticket.replies || []), newReply];
    if (ticket.status === 'pending') {
      ticket.status = 'in_progress';
    }

    return this.ticketRepository.save(ticket);
  }
}
