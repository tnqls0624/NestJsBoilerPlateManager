import { PickType } from '@nestjs/swagger';
import { Auth } from 'src/auth/domain/entity/auth.entity';

export class ReissueTokenDto extends PickType(Auth, [
  'refreshToken',
] as const) {}
