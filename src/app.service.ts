import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private dataSource: DataSource) {}

  getHello(): string {
    return 'Hello World!';
  }

  async getPublicStats() {
    try {
      const [userCount] = await this.dataSource.query(`SELECT COUNT(*) as count FROM users`);
      const [bookingCount] = await this.dataSource.query(`SELECT COUNT(*) as count FROM bookings`);
      const [reviewData] = await this.dataSource.query(`SELECT AVG(rating) as avg_rating FROM reviews`);
      
      const parsedUserCount = parseInt(userCount?.count || '0');
      const parsedBookingCount = parseInt(bookingCount?.count || '0');
      const parsedAvgRating = parseFloat(reviewData?.avg_rating || '4.8');

      return {
        happyCustomers: 50000 + parsedUserCount,
        servicesCompleted: 120000 + parsedBookingCount,
        verifiedExperts: 2500, // You can also make this dynamic if needed
        averageRating: isNaN(parsedAvgRating) ? 4.8 : Number(parsedAvgRating.toFixed(1)),
      };
    } catch (e) {
      // Fallback in case tables don't exist yet
      return {
        happyCustomers: 50000,
        servicesCompleted: 120000,
        verifiedExperts: 2500,
        averageRating: 4.8,
      };
    }
  }
}
