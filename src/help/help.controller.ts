import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { HelpService } from './help.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { AddReplyDto } from './dto/add-reply.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { RoleType } from '../roles/entities/role.entity';

@Controller('help')
export class HelpController {
  constructor(private readonly helpService: HelpService) {}

  @Get('articles')
  async getArticles(
    @Query('search') search?: string,
    @Query('category') category?: string,
  ) {
    const data = await this.helpService.getArticles(search, category);
    return {
      success: true,
      data,
    };
  }

  @Post('tickets')
  @UseGuards(JwtAuthGuard)
  async createTicket(@Req() req: any, @Body() dto: CreateTicketDto) {
    const userId = req.user.sub || req.user.userId || req.user.id;
    const data = await this.helpService.createTicket(userId, dto);
    return {
      success: true,
      data,
    };
  }

  @Get('tickets')
  @UseGuards(JwtAuthGuard)
  async getTickets(@Req() req: any) {
    const userId = req.user.sub || req.user.userId || req.user.id;
    const data = await this.helpService.getTicketsByUser(userId);
    return {
      success: true,
      data,
    };
  }

  @Get('tickets/:id')
  @UseGuards(JwtAuthGuard)
  async getTicketDetails(@Req() req: any, @Param('id') id: string) {
    const userId = req.user.sub || req.user.userId || req.user.id;
    const userRole = req.user.role;
    const data = await this.helpService.getTicketById(+id, userId, userRole);
    return {
      success: true,
      data,
    };
  }

  @Post('tickets/:id/reply')
  @UseGuards(JwtAuthGuard)
  async addReply(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: AddReplyDto,
  ) {
    const userId = req.user.sub || req.user.userId || req.user.id;
    const data = await this.helpService.addReply(+id, userId, dto.message);
    return {
      success: true,
      data,
    };
  }

  // Admin endpoints
  @Get('admin/tickets')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async getAdminTickets() {
    const data = await this.helpService.getAllTickets();
    return {
      success: true,
      data,
    };
  }

  @Patch('admin/tickets/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async updateAdminTicketStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    const data = await this.helpService.updateTicketStatus(+id, status);
    return {
      success: true,
      data,
    };
  }

  @Post('admin/tickets/:id/reply')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleType.SUPER_ADMIN)
  async addAdminReply(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: AddReplyDto,
  ) {
    const adminUserId = req.user.sub || req.user.userId || req.user.id;
    const data = await this.helpService.addAdminReply(+id, adminUserId, dto.message);
    return {
      success: true,
      data,
    };
  }
}
