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
    return this.sendMessage(phone, `Your Rajsheba OTP is ${otp}`);
  }

  async sendMessage(phone: string, message: string): Promise<boolean> {
    const apiKey = this.configService.get<string>('SMS_API_KEY') || 'C30009696a2fb72e7cc260.50730368';
    const senderId = this.configService.get<string>('SMS_SENDER_ID') || '8809601013613';
    const baseUrl = 'https://sms.mram.com.bd/smsapi';

    if (!apiKey || !senderId) {
      this.logger.warn('SMS credentials not found. Simulating SMS send.');
      this.logger.log(`[SIMULATED SMS] To: ${phone}, Message: ${message}`);
      return true;
    }

    try {
      const formattedPhone =
        phone.length === 11 && phone.startsWith('01') ? `88${phone}` : phone;

      const requestUrl = `${baseUrl}?api_key=${apiKey}&type=text&contacts=${formattedPhone}&senderid=${senderId}&msg=${encodeURIComponent(message)}&label=transactional`;

      const response = await firstValueFrom(this.httpService.get(requestUrl));

      const dataStr = String(response.data);
      if (response.status === 200 && !dataStr.startsWith('10')) {
        this.logger.log(`SMS sent to ${phone} successfully. SMS ID: ${dataStr}`);
        return true;
      }

      this.logger.error(`Failed to send SMS to ${phone}. Error Code: ${dataStr}`);
      return false;
    } catch (error) {
      this.logger.error(`Error sending SMS to ${phone}`, error.message);
      return false;
    }
  }
}
