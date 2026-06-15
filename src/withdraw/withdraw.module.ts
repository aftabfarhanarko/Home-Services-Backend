import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WithdrawService } from './withdraw.service';
import { WithdrawController } from './withdraw.controller';
import { Withdraw } from './entities/withdraw.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Withdraw])],
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule {}
