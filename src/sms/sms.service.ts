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
    const apiKey = 'C30009696a2fb72e7cc260.50730368';
    const senderId = '8809601013613';
    const baseUrl = 'https://sms.mram.com.bd/smsapi';

    if (!apiKey || !senderId) {
      this.logger.warn('SMS credentials not found. Simulating OTP send.');
      this.logger.log(`[SIMULATED SMS] To: ${phone}, OTP: ${otp}`);
      return true;
    }

    const message = `Your OTP code for Rajsheba is ${otp}. It will expire in 5 minutes.`;

    try {
      // Following the API documentation provided
      // MRAM expects the number with 88 prefix
      const formattedPhone = phone.length === 11 && phone.startsWith('01') ? `88${phone}` : phone;

      // Construct the exact URL to avoid any axios encoding issues with the PHP backend
      const requestUrl = `${baseUrl}?api_key=${apiKey}&type=text&contacts=${formattedPhone}&senderid=${senderId}&msg=${encodeURIComponent(message)}`;

      // Send the GET request
      const response = await firstValueFrom(
        this.httpService.get(requestUrl),
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
