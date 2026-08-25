import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const data = await this.authService.register(registerDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
      data,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const data = await this.authService.login(loginDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      data,
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    const data = await this.authService.refreshToken(refreshTokenDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Token refreshed successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req) {
    const result = await this.authService.logout(req.user.userId);
    return {
      statusCode: HttpStatus.OK,
      message: result.message,
    };
  }
}
