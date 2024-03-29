import { PickType } from "@nestjs/swagger";
import { Users } from "@user/domain/entity/user.entity";

export class FindPasswordChangeDto extends PickType(Users, [
  "signname",
  "password",
] as const) {}
