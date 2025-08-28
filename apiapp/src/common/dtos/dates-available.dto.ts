import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

import { DateStatus } from '../enums/status.enum';

export class AvailableDatesDto {
  @ApiProperty({ example: '2026-06-15T00:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: DateStatus.PAID })
  @IsNotEmpty()
  @IsString()
  status: DateStatus;
}
