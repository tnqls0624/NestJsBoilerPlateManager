import { Test, TestingModule } from '@nestjs/testing';
import { VarificationsController } from './varifications.controller';

describe('VarificationsController', () => {
  let controller: VarificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VarificationsController],
    }).compile();

    controller = module.get<VarificationsController>(VarificationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
