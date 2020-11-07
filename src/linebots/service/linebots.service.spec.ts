import { Test, TestingModule } from '@nestjs/testing';
import { LinebotsService } from './linebots.service';

describe('LinebotsService', () => {
  let service: LinebotsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinebotsService],
    }).compile();

    service = module.get<LinebotsService>(LinebotsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
