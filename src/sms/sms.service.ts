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
    const apiKey = this.configService.get<string>('SMS_API_KEY', 'C3000969672258e72e9e57.58245160');
    const senderId = this.configService.get<string>('SMS_SENDER_ID', '8809617625025');
    const baseUrl = 'https://sms.mram.com.bd/smsapi';

    if (!apiKey || !senderId) {
      this.logger.warn('SMS credentials not found. Simulating OTP send.');
      this.logger.log(`[SIMULATED SMS] To: ${phone}, OTP: ${otp}`);
      return true;
    }

    const message = `Your OTP code for Rajsheba is ${otp}. It will expire in 5 minutes.`;

    try {
      // Following the API documentation provided
      const response = await firstValueFrom(
        this.httpService.post(baseUrl, {
          api_key: apiKey,
          type: 'text',
          contacts: phone,
          senderid: senderId,
          msg: message,
          label: 'transactional',
        }),
      );

      // API returns an SMS ID on success or a 4-digit error code (e.g., 1002, 1003)
      const dataStr = String(response.data);
      if (response.status === 200 && !dataStr.startsWith('10')) {
        this.logger.log(`OTP sent to ${phone} successfully. SMS ID: ${dataStr}`);
        return true;
      } else {
        this.logger.error(`Failed to send OTP to ${phone}. Error Code: ${dataStr}`);
        return false;
      }
    } catch (error) {
      this.logger.error(`Error sending SMS to ${phone}`, error.message);
      return false;
    }
  }
}
