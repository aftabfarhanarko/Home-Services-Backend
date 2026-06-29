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
      const [clientData] = await this.dataSource.query(`SELECT COUNT(*) as count FROM users u INNER JOIN roles r ON u."roleId" = r.id WHERE r.name = 'Client'`);
      const [vendorData] = await this.dataSource.query(`SELECT COUNT(*) as count FROM users u INNER JOIN roles r ON u."roleId" = r.id WHERE r.name = 'Vendor'`);
      const [bookingData] = await this.dataSource.query(`SELECT COUNT(*) as count FROM bookings WHERE status = 'completed'`);
      const [reviewData] = await this.dataSource.query(`SELECT AVG(rating) as avg_rating FROM reviews`);
      
      const parsedClientCount = parseInt(clientData?.count || '0');
      const parsedVendorCount = parseInt(vendorData?.count || '0');
      const parsedBookingCount = parseInt(bookingData?.count || '0');
      const parsedAvgRating = parseFloat(reviewData?.avg_rating || '4.8');

      return {
        happyCustomers: parsedClientCount,
        servicesCompleted: parsedBookingCount,
        verifiedExperts: parsedVendorCount,
        averageRating: isNaN(parsedAvgRating) ? 4.8 : Number(parsedAvgRating.toFixed(1)),
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
