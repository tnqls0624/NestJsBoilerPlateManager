import { PickType } from '@nestjs/swagger';
import { Users } from 'src/user/domain/entity/user.entity';

export class FindPasswordDto extends PickType(Users, ['email'] as const) {}
