import {ApiProperty} from '@nestjs/swagger';
import {IsArray} from 'class-validator';

export class CursorDto<T> {
  constructor(data: T[], next_cursor: number | string, totalCount: number) {
    this.data = data;
    this.next_cursor = next_cursor;
    this.totalCount = totalCount;
  }
  @ApiProperty({isArray: true})
  @IsArray()
  readonly data: T[];

  @ApiProperty({
    additionalProperties: {oneOf: [{type: 'number'}, {type: 'string'}]},
  })
  readonly next_cursor: number | string;

  @ApiProperty({type: 'number'})
  readonly totalCount: number;
}
