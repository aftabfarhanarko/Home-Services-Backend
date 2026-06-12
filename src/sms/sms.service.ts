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
    const apiKey = this.configService.get<string>('UivVa73bujGUIqNCr6s6');
    const senderId = this.configService.get<string>('8809617625025');
    const baseUrl = 'http://bulksmsbd.net/api/smsapi';

    if (!apiKey || !senderId) {
      this.logger.warn('Bulk SMS BD credentials not found. Simulating OTP send.');
      this.logger.log(`[SIMULATED SMS] To: ${phone}, OTP: ${otp}`);
      return true;
    }

    const message = `Your OTP code for Rajsheba is ${otp}. It will expire in 5 minutes.`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(baseUrl, {
          api_key: apiKey,
          senderid: senderId,
          number: phone,
          message: message,
        }),
      );

      // Check response based on Bulk SMS BD documentation. Usually returns success status.
      if (response.data && response.data.response_code === 202) {
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
