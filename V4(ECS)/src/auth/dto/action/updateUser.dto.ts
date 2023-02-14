import { PickType } from "@nestjs/swagger";
import { Users } from "@user/domain/entity/user.entity";

export class UpdateUserDto extends PickType(Users, [
  "name",
  "email",
] as const) {}
