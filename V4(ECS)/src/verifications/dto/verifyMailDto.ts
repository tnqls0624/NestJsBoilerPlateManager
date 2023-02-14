import { PickType } from "@nestjs/swagger";
import { Verification } from "@verifications/domain/entity/verifications.entity";

export class VerifyMailDto extends PickType(Verification, [
  "token",
  "key",
] as const) {}
