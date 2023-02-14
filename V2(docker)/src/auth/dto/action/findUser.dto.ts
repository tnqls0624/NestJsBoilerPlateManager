import { PickType } from '@nestjs/swagger';
import { Users } from 'src/user/domain/entity/user.entity';

export class FindUserDto extends PickType(Users, ['signname'] as const) {}
