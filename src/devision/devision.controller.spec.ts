import { Test, TestingModule } from '@nestjs/testing';
import { DevisionController } from './devision.controller';
import { DevisionService } from './devision.service';

describe('DevisionController', () => {
  let controller: DevisionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DevisionController],
      providers: [DevisionService],
    }).compile();

    controller = module.get<DevisionController>(DevisionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
