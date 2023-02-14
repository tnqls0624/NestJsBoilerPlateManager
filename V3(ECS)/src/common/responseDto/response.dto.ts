import { ApiProperty } from '@nestjs/swagger';

export class ResponseDto {
  @ApiProperty({
    required: true,
    example: true,
    description: 'success',
  })
  success: boolean = false;

  @ApiProperty({
    required: true,
    example: [{}],
    description: 'data',
  })
  data: Array<object> = [];

  @ApiProperty({
    required: true,
    example: '2022-04-21T09:50:24.675Z',
    description: 'timestamp',
  })
  timestamp!: Date;
}
