import { Test, TestingModule } from "@nestjs/testing";
import { VerificationsController } from "./verificationsController";

describe("VarificationsController", () => {
  let controller: VerificationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerificationsController],
    }).compile();

    controller = module.get<VerificationsController>(VerificationsController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
