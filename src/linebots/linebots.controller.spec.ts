import { Test, TestingModule } from '@nestjs/testing';
import { LinebotsController } from './linebots.controller';

describe('Linebots Controller', () => {
  let controller: LinebotsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinebotsController],
    }).compile();

    controller = module.get<LinebotsController>(LinebotsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
