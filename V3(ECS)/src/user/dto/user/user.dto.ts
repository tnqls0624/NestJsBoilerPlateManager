import { PickType } from '@nestjs/swagger';
import { Users } from 'src/user/domain/entity/user.entity';

export class UserDto extends PickType(Users, [
  'signname',
  'password',
  'name',
  'email',
  'phone',
  'created_at',
  'updated_at',
  'withdraw_at',
] as const) {}
