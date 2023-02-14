import { Test, TestingModule } from '@nestjs/testing';
import { VarificationsService } from './varifications.service';

describe('VarificationsService', () => {
  let service: VarificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VarificationsService],
    }).compile();

    service = module.get<VarificationsService>(VarificationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
