import { Test, TestingModule } from '@nestjs/testing';
import { PercentService } from './percent.service';

describe('PercentService', () => {
  let service: PercentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PercentService],
    }).compile();

    service = module.get<PercentService>(PercentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
