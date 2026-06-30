import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../roles/guards/roles.guard';
import { Roles } from '../roles/decorators/roles.decorator';
import { RoleType } from '../roles/entities/role.entity';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { WithdrawStatus } from './entities/withdraw.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('withdraws')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) { }

  @Post('request')
  async create(@Body() createWithdrawDto: CreateWithdrawDto, @Req() req: any) {
    const vendorId = req.user.sub || req.user.id;
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

  @Roles(RoleType.SUPER_ADMIN)
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: WithdrawStatus,
    @Body('admin_note') admin_note?: string,
  ) {
    const data = await this.withdrawService.updateStatus(+id, status, admin_note);
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
