import { Test, TestingModule } from '@nestjs/testing';
import { GetwayService } from './getway.service';

describe('GetwayService', () => {
  let service: GetwayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GetwayService],
    }).compile();

    service = module.get<GetwayService>(GetwayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
