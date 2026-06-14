import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) { }

  async sendOtp(phone: string, otp: string): Promise<boolean> {
    const username = this.configService.get<string>('C3000969');
    const password = this.configService.get<string>('1s2s3s4s5s@S');
    const senderId = this.configService.get<string>('8809617625025');
    const baseUrl = 'https://sms.mram.com.bd/smsapi';

    if (!username || !password || !senderId) {
      this.logger.warn('SMS credentials not found. Simulating OTP send.');
      this.logger.log(`[SIMULATED SMS] To: ${phone}, OTP: ${otp}`);
      return true;
    }

    const message = `Your OTP code for Rajsheba is ${otp}. It will expire in 5 minutes.`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(baseUrl, {
          username: username,
          password: password,
          senderid: senderId,
          contacts: phone,
          msg: message,
          type: 'text'
        }),
      );

      // Check response based on the API. Adjust condition if documentation provides specific success codes.
      if (response.data && response.status === 200) {
        this.logger.log(`OTP sent to ${phone} successfully`);
        return true;
      } else {
        this.logger.error(`Failed to send OTP to ${phone}:`, response.data);
        return false;
      }
    } catch (error) {
      this.logger.error(`Error sending SMS to ${phone}`, error.message);
      return false;
    }
  }
}
