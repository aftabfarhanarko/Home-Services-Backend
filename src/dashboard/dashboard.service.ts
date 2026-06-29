import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Booking, BookingStatus } from '../booking/entities/booking.entity';
import { User } from '../users/entities/user.entity';
import { Withdraw, WithdrawStatus } from '../withdraw/entities/withdraw.entity';
import { Role, RoleType } from '../roles/entities/role.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Withdraw)
    private readonly withdrawRepository: Repository<Withdraw>,
  ) {}

  async getOverviewStats() {
    const now = new Date();
    
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start of week
    
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const sevenDaysAgo = new Date(startOfToday);
    sevenDaysAgo.setDate(startOfToday.getDate() - 6);

    // 1. Revenue
    const totalRevQuery = await this.bookingRepository.createQueryBuilder('booking')
      .select('SUM(booking.total_price)', 'total')
      .getRawOne();
      
    const monthlyRevQuery = await this.bookingRepository.createQueryBuilder('booking')
      .select('SUM(booking.total_price)', 'total')
      .where('booking.createdAt >= :start', { start: startOfMonth })
      .getRawOne();
      
    const weeklyRevQuery = await this.bookingRepository.createQueryBuilder('booking')
      .select('SUM(booking.total_price)', 'total')
      .where('booking.createdAt >= :start', { start: startOfWeek })
      .getRawOne();
      
    const todayRevQuery = await this.bookingRepository.createQueryBuilder('booking')
      .select('SUM(booking.total_price)', 'total')
      .where('booking.createdAt >= :start AND booking.createdAt <= :end', { start: startOfToday, end: endOfToday })
      .getRawOne();

    // Chart Data (Last 7 days revenue)
    // PostgreSQL uses DATE() or cast to date. We'll extract year, month, day or cast.
    const chartDataRaw = await this.bookingRepository.createQueryBuilder('booking')
      .select('CAST(booking.createdAt AS DATE)', 'date')
      .addSelect('SUM(booking.total_price)', 'total')
      .where('booking.createdAt >= :start', { start: sevenDaysAgo })
      .groupBy('CAST(booking.createdAt AS DATE)')
      .orderBy('CAST(booking.createdAt AS DATE)', 'ASC')
      .getRawMany();

    const chartData = chartDataRaw.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: Number(item.total) || 0
    }));

    // Fill missing days
    const fullChartData: { date: string; amount: number; }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(sevenDaysAgo.getDate() + i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const existing = chartData.find(c => c.date === dateStr);
      fullChartData.push({
        date: dateStr,
        amount: existing ? existing.amount : 0
      });
    }

    // 2. Booking Stats
    const todayAssigned = await this.bookingRepository.count({
      where: {
        status: BookingStatus.ASSIGNED,
        createdAt: Between(startOfToday, endOfToday)
      }
    });
    
    const completedBookings = await this.bookingRepository.count({
      where: { status: BookingStatus.COMPLETED }
    });
    
    const pendingBookings = await this.bookingRepository.count({
      where: { status: BookingStatus.PENDING }
    });

    // 3. User Stats
    const totalClients = await this.userRepository.createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .where('role.name = :roleName', { roleName: RoleType.CLIENT })
      .getCount();
      
    const totalVendors = await this.userRepository.createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .where('role.name = :roleName', { roleName: RoleType.VENDOR })
      .getCount();
      
    const totalAgents = await this.userRepository.createQueryBuilder('user')
      .leftJoin('user.role', 'role')
      .where('role.name = :roleName', { roleName: RoleType.AGENT })
      .getCount();

    // 4. Withdraw Stats
    const totalWithdraw = await this.withdrawRepository.createQueryBuilder('withdraw')
      .select('SUM(withdraw.amount)', 'total')
      .getRawOne();
      
    const todayWithdraw = await this.withdrawRepository.createQueryBuilder('withdraw')
      .select('SUM(withdraw.amount)', 'total')
      .where('withdraw.createdAt >= :start AND withdraw.createdAt <= :end', { start: startOfToday, end: endOfToday })
      .getRawOne();
      
    const weeklyWithdraw = await this.withdrawRepository.createQueryBuilder('withdraw')
      .select('SUM(withdraw.amount)', 'total')
      .where('withdraw.createdAt >= :start', { start: startOfWeek })
      .getRawOne();
      
    const monthlyWithdraw = await this.withdrawRepository.createQueryBuilder('withdraw')
      .select('SUM(withdraw.amount)', 'total')
      .where('withdraw.createdAt >= :start', { start: startOfMonth })
      .getRawOne();

    return {
      revenue: {
        total: Number(totalRevQuery?.total) || 0,
        monthly: Number(monthlyRevQuery?.total) || 0,
        weekly: Number(weeklyRevQuery?.total) || 0,
        today: Number(todayRevQuery?.total) || 0,
        chart: fullChartData
      },
      bookings: {
        todayAssigned,
        completed: completedBookings,
        pending: pendingBookings
      },
      users: {
        totalClients,
        totalVendors,
        totalAgents
      },
      withdraws: {
        totalAmount: Number(totalWithdraw?.total) || 0,
        todayAmount: Number(todayWithdraw?.total) || 0,
        weeklyAmount: Number(weeklyWithdraw?.total) || 0,
        monthlyAmount: Number(monthlyWithdraw?.total) || 0,
      }
    };
  }
}
