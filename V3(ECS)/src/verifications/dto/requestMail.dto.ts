import { PickType } from '@nestjs/swagger';
import { Verification } from '../domain/entity/verifications.entity';

export class RequestMailDto extends PickType(Verification, ['to'] as const) {}
