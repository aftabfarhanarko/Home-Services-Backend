import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'success',
      message: 'API is up and running!',
      timestamp: new Date().toISOString()
    };
  }

  @Get('stats')
  async getStats() {
    return {
      success: true,
      message: 'Platform statistics retrieved successfully',
      data: await this.appService.getPublicStats()
    };
  }
}
