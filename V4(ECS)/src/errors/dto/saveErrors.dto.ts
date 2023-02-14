import { PickType } from "@nestjs/swagger";
import { Errors } from "@errors/domain/entity/errors.entity";

export class SaveErrorsDto extends PickType(Errors, [
  "userId",
  "projectId",
  "content",
  "sender",
  "reason",
] as const) {}
