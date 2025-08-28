import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class ResponseDto<T> {
  @ApiProperty()
  data: T;

  @ApiProperty({ example: 200 })
  @IsInt()
  statusCode: 200;

  constructor(data: T) {
    this.data = data;
    this.statusCode = 200;
  }
}
