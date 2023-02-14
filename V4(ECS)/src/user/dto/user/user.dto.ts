import { PickType } from "@nestjs/swagger";
import { Users } from "@user/domain/entity/user.entity";

export class UserDto extends PickType(Users, [
  "id",
  "signname",
  "password",
  "name",
  "email",
  "created_at",
  "updated_at",
  "withdraw_at",
] as const) {}
