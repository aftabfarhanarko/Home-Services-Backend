import { IsNotEmpty, IsString, IsIn } from 'class-validator';

export class CreateTicketDto {
  @IsNotEmpty()
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['booking', 'payment', 'account', 'other'])
  category: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(['low', 'medium', 'high'])
  priority: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
