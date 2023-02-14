import { PickType } from '@nestjs/swagger';
import { Users } from 'src/user/domain/entity/user.entity';

export class LoginUserDto extends PickType(Users, [
  'method',
  'signname',
  'password',
] as const) {}
