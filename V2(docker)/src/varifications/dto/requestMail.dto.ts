import { PickType } from '@nestjs/swagger';
import { Varification } from '../domain/entity/varifications.entity';

export class RequestMailDto extends PickType(Varification, ['to'] as const) {}
