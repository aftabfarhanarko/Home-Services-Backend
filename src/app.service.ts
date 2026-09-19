import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as https from 'https';
import * as http from 'http';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(AppService.name);
  private keepAliveInterval: NodeJS.Timeout | null = null;

  constructor(private dataSource: DataSource) {}

  onModuleInit() {
    this.startKeepAlivePing();
  }

  onModuleDestroy() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
  }

  private startKeepAlivePing() {
    const rawUrl =
      process.env.RENDER_EXTERNAL_URL ||
      process.env.BACKEND_URL ||
      'https://home-services-backend-m3pm.onrender.com';

    const baseUrl = rawUrl.replace(/\/$/, '');
    const pingUrl = `${baseUrl}/health`;

    // Ping every 10 minutes (Render free tier turns off after 15 minutes of inactivity)
    const PING_INTERVAL_MS = 10 * 60 * 1000;

    this.logger.log(`[KeepAlive] Self-ping service started for: ${pingUrl}`);

    // Send immediate ping on startup
    this.pingEndpoint(pingUrl);

    this.keepAliveInterval = setInterval(() => {
      this.pingEndpoint(pingUrl);
    }, PING_INTERVAL_MS);
  }

  private pingEndpoint(url: string) {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, (res) => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          this.logger.log(`[KeepAlive] Self-ping status (${res.statusCode})`);
        } else {
          this.logger.warn(`[KeepAlive] Self-ping returned status ${res.statusCode}`);
        }
      });

      req.on('error', (err) => {
        this.logger.error(`[KeepAlive] Self-ping network error: ${err.message}`);
      });

      req.setTimeout(10000, () => {
        req.destroy();
      });
    } catch (e) {
      this.logger.error(`[KeepAlive] Exception during ping: ${e?.message || e}`);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  async getPublicStats() {
    try {
      const [clientData] = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM users u INNER JOIN roles r ON u."roleId" = r.id WHERE r.name = 'Client'`,
      );
      const [vendorData] = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM users u INNER JOIN roles r ON u."roleId" = r.id WHERE r.name = 'Vendor'`,
      );
      const [bookingData] = await this.dataSource.query(
        `SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'`,
      );
      const [reviewData] = await this.dataSource.query(
        `SELECT AVG(rating) as avg_rating FROM reviews`,
      );

      const parsedClientCount = parseInt(clientData?.count || '0');
      const parsedVendorCount = parseInt(vendorData?.count || '0');
      const parsedBookingCount = parseInt(bookingData?.count || '0');
      const parsedAvgRating = parseFloat(reviewData?.avg_rating || '4.8');

      return {
        happyCustomers: parsedClientCount,
        servicesCompleted: parsedBookingCount,
        verifiedExperts: parsedVendorCount,
        averageRating: isNaN(parsedAvgRating)
          ? 4.8
          : Number(parsedAvgRating.toFixed(1)),
      };
    } catch (e) {
      // Fallback in case tables don't exist yet
      return {
        happyCustomers: 0,
        servicesCompleted: 0,
        verifiedExperts: 0,
        averageRating: 4.8,
      };
    }
  }
}

