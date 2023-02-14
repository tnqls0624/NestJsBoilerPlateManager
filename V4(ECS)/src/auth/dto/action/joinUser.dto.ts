import { PickType } from "@nestjs/swagger";
import { Users } from "@user/domain/entity/user.entity";

export class JoinUserDto extends PickType(Users, [
  "method",
  "signname",
  "password",
  "name",
  "email",
] as const) {}
