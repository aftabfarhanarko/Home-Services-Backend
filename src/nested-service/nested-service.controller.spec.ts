import { Test, TestingModule } from '@nestjs/testing';
import { NestedServiceController } from './nested-service.controller';
import { NestedServiceService } from './nested-service.service';

describe('NestedServiceController', () => {
  let controller: NestedServiceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NestedServiceController],
      providers: [NestedServiceService],
    }).compile();

    controller = module.get<NestedServiceController>(NestedServiceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
