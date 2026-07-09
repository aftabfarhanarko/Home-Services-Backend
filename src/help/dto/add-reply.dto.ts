import { IsNotEmpty, IsString } from 'class-validator';

export class AddReplyDto {
  @IsNotEmpty()
  @IsString()
  message: string;
}
