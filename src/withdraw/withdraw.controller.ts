import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { WithdrawStatus } from './entities/withdraw.entity';

@Controller('withdraws')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Post('request')
  async create(@Body() createWithdrawDto: CreateWithdrawDto) {
    const vendorId = 1; // placeholder: use @Request() req, req.user.id
    const data = await this.withdrawService.create(createWithdrawDto, vendorId);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Withdraw requested successfully',
      data,
    };
  }

  @Get()
  async findAll() {
    const data = await this.withdrawService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Withdraws retrieved successfully',
      data,
    };
  }

  @Get('vendor/:vendorId')
  async findByVendor(@Param('vendorId') vendorId: string) {
    const data = await this.withdrawService.findByVendor(+vendorId);
    return {
      statusCode: HttpStatus.OK,
      message: 'Vendor withdraws retrieved successfully',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.withdrawService.findOne(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Withdraw retrieved successfully',
      data,
    };
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: WithdrawStatus) {
    const data = await this.withdrawService.updateStatus(+id, status);
    return {
      statusCode: HttpStatus.OK,
      message: 'Withdraw status updated successfully',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.withdrawService.remove(+id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Withdraw deleted successfully',
    };
  }
}
