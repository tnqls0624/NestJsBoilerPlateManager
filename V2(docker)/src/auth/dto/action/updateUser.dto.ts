import { PickType } from '@nestjs/swagger';
import { Users } from 'src/user/domain/entity/user.entity';

export class UpdateUserDto extends PickType(Users, [
  'name',
  'email',
  'phone',
] as const) {}
