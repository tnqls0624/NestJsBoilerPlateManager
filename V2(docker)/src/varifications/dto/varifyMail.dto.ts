import { PickType } from '@nestjs/swagger';
import { Varification } from '../domain/entity/varifications.entity';

export class VarifyMailDto extends PickType(Varification, [
  'token',
  'key',
] as const) {}
