import { PickType } from "@nestjs/swagger";
import { Users } from "@user/domain/entity/user.entity";

export class LoginUserDto extends PickType(Users, [
  "method",
  "signname",
  "password",
] as const) {}
