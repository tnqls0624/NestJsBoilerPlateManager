import {IsInt, IsOptional, Min} from 'class-validator';
import {Type} from 'class-transformer';
import {ApiPropertyOptional} from '@nestjs/swagger';

export class CursorPaginationDto {
  constructor(limit: number, cursor: number | string) {
    this.limit = limit;
    if (cursor) this.cursor = cursor;
  }

  @ApiPropertyOptional({minimum: 1, default: 15})
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly limit: number;

  @ApiPropertyOptional({
    type: 'number | string',
    required: false,
  })
  @IsOptional()
  readonly cursor?: number | string;
}
