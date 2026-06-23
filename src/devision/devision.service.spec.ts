import { Test, TestingModule } from '@nestjs/testing';
import { DevisionService } from './devision.service';

describe('DevisionService', () => {
  let service: DevisionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DevisionService],
    }).compile();

    service = module.get<DevisionService>(DevisionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
