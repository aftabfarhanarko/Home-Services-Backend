import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, IsNull } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UsersService } from '../users/users.service';
import { SmsService } from '../sms/sms.service';
import { Otp } from './entities/otp.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
    private readonly usersService: UsersService,
    private readonly smsService: SmsService,
    private readonly jwtService: JwtService,
  ) {}

  async sendOtp(sendOtpDto: SendOtpDto) {
    const { phone } = sendOtpDto;

    // Check rate limit: user can't request OTP if they have an active one generated within last 1 minute
    const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000);
    const recentOtp = await this.otpRepository.findOne({
      where: { phone, createdAt: MoreThan(oneMinuteAgo) },
    });

    if (recentOtp) {
      throw new BadRequestException('Please wait 1 minute before requesting another OTP');
    }

    const otpCode = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit OTP
    const hashedOtp = await bcrypt.hash(otpCode, 10);
    
    // Expires in 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const otpRecord = this.otpRepository.create({
      phone,
      otpCode: hashedOtp,
      expiresAt,
    });
    
    await this.otpRepository.save(otpRecord);
    
    await this.smsService.sendOtp(phone, otpCode);

    return { message: 'OTP sent successfully' };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { phone, otpCode } = verifyOtpDto;

    // Find the latest unverified OTP for this phone
    const otpRecord = await this.otpRepository.findOne({
      where: { phone, verifiedAt: IsNull() },
      order: { createdAt: 'DESC' },
    });

    if (!otpRecord) {
      throw new BadRequestException('No active OTP found for this phone number');
    }

    if (new Date() > otpRecord.expiresAt) {
      throw new BadRequestException('OTP has expired');
    }

    if (otpRecord.attempts >= 3) {
      throw new BadRequestException('Too many failed attempts. Please request a new OTP');
    }

    const isMatch = await bcrypt.compare(otpCode, otpRecord.otpCode);

    if (!isMatch) {
      otpRecord.attempts += 1;
      await this.otpRepository.save(otpRecord);
      throw new BadRequestException('Invalid OTP code');
    }

    // Mark OTP as verified
    otpRecord.verifiedAt = new Date();
    await this.otpRepository.save(otpRecord);

    // Find or create user
    let user = await this.usersService.findByPhone(phone);
    if (!user) {
      user = await this.usersService.create({
        name: 'User', // Default name
        phone,
      });
    }

    await this.usersService.markPhoneAsVerified(user.id);
    await this.usersService.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user.id, user.role?.name);
    return {
      user,
      ...tokens
    };
  }

  async resendOtp(sendOtpDto: SendOtpDto) {
    return this.sendOtp(sendOtpDto);
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
      });

      const user = await this.usersService.findOne(payload.sub);
      
      const isMatch = await bcrypt.compare(refreshToken, user.refreshToken);
      if (!isMatch) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user.id, user.role?.name);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: number) {
    await this.usersService.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }

  private async generateTokens(userId: number, roleName?: string) {
    const payload = { sub: userId, role: roleName };
    
    const accessToken = this.jwtService.sign(payload);
    
    const refreshTokenPlain = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret',
      expiresIn: '7d',
    });

    const hashedRefreshToken = await bcrypt.hash(refreshTokenPlain, 10);
    await this.usersService.updateRefreshToken(userId, hashedRefreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenPlain,
    };
  }
}
