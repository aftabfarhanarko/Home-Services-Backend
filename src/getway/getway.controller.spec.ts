import { Test, TestingModule } from '@nestjs/testing';
import { GetwayController } from './getway.controller';
import { GetwayService } from './getway.service';

describe('GetwayController', () => {
  let controller: GetwayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GetwayController],
      providers: [GetwayService],
    }).compile();

    controller = module.get<GetwayController>(GetwayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
