import { Test, TestingModule } from '@nestjs/testing';
import { WithdrawController } from './withdraw.controller';
import { WithdrawService } from './withdraw.service';

describe('WithdrawController', () => {
  let controller: WithdrawController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WithdrawController],
      providers: [WithdrawService],
    }).compile();

    controller = module.get<WithdrawController>(WithdrawController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
