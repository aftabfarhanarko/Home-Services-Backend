import { Test, TestingModule } from '@nestjs/testing';
import { NestedServiceService } from './nested-service.service';

describe('NestedServiceService', () => {
  let service: NestedServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestedServiceService],
    }).compile();

    service = module.get<NestedServiceService>(NestedServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
