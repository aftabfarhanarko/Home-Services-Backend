import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, phone, email, password, roleId } = registerDto;

    if (email) {
      const existingUser = await this.usersService.findByEmail(email);
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
    }

    if (phone) {
      const existingPhoneUser = await this.usersService.findByPhone(phone);
      if (existingPhoneUser) {
        throw new BadRequestException('User with this phone number already exists');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create({
      name,
      phone,
      email,
      password: hashedPassword,
      roleId,
    });

    await this.usersService.markPhoneAsVerified(user.id);
    await this.usersService.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user.id, user.role?.name);
    return {
      user,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    // Allow login by email or phone (using email property as identifier)
    const user = await this.usersService.findByEmailOrPhone(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email address or password');
    }

    if (!user.password) {
      throw new UnauthorizedException('Please set up a password or contact support');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email address or password');
    }

    if (user.status === 'blocked' || user.status === 'inactive') {
      throw new BadRequestException('User account is deactivated or blocked');
    }

    await this.usersService.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user.id, user.role?.name);
    return {
      user,
      ...tokens,
    };
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
