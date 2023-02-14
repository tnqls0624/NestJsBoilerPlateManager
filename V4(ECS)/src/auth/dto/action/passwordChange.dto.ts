import { PickType } from "@nestjs/swagger";
import { Users } from "@user/domain/entity/user.entity";

export class PasswordChangeDto extends PickType(Users, ["password"] as const) {}
