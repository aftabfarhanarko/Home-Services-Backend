import { Test, TestingModule } from '@nestjs/testing';
import { HeroController } from './hero.controller';
import { HeroService } from './hero.service';

describe('HeroController', () => {
  let controller: HeroController;

  const mockHeroService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HeroController],
      providers: [
        {
          provide: HeroService,
          useValue: mockHeroService,
        },
      ],
    }).compile();

    controller = module.get<HeroController>(HeroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
