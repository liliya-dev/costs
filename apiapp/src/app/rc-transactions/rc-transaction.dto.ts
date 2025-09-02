import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

import { CreateOutgoingTransactionDto } from 'src/common/dtos/outgoing-transaction.dto';
import { PaymentDto } from 'src/common/dtos/payments.dto';
import { DateStatus, Status } from 'src/common/enums/status.enum';

import { TagEntity } from '../tags/tag.entity';

export class CreateRCTransactionDto extends CreateOutgoingTransactionDto {
  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  rcId: number;

  @ApiProperty({
    example: '2025-08-03T00:00:00.000Z',
    type: String,
    description: 'ISO date string',
  })
  @IsString()
  dateShouldBePaid: string;
}

export class RCsDoneAndUpcomingDto extends PaymentDto {
  @ApiProperty({ example: 'Servers' })
  @IsNotEmpty()
  @IsString()
  rcName: string;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @IsString()
  rcId: number;

  @ApiProperty({ example: Status.PAID_IN_ADVANCE })
  @IsNotEmpty()
  @IsString()
  status: Status;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @IsArray()
  rcTags: TagEntity[];
}

export class RCDatesDto {
  @ApiProperty({ example: '2026-06-15T00:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: DateStatus.PAID })
  @IsNotEmpty()
  @IsString()
  status: DateStatus;
}
