import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { RoleType } from '../roles/entities/role.entity';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  @Roles(RoleType.SUPER_ADMIN, RoleType.VENDOR, RoleType.AGENT, RoleType.CLIENT)
  async getOverview(@Req() req: any) {
    const data = await this.dashboardService.getOverviewStats();
    return {
      success: true,
      data
    };
  }

  @Get('analytics')
  @Roles(RoleType.SUPER_ADMIN)
  async getAnalytics() {
    const data = await this.dashboardService.getAnalyticsStats();
    return {
      success: true,
      data
    };
  }

  @Get('ai-insights')
  @Roles(RoleType.SUPER_ADMIN)
  async getAIInsights() {
    const data = await this.dashboardService.getAIInsights();
    return {
      success: true,
      data
    };
  }
}
