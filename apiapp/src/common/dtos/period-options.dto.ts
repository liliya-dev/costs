import { ApiProperty } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';

export class PeriodOptionsDto {
  @ApiProperty({ example: '2025-06-15T00:00:54.000Z' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-07-15T00:00:00.000Z' })
  @IsDateString()
  endDate: string;
}
