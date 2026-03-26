import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';
import { Column } from 'typeorm';

import { CreateOutgoingTransactionDto } from 'src/common/dtos/outgoing-transaction.dto';
import { PaymentDto } from 'src/common/dtos/payments.dto';
import { DateStatus, Status } from 'src/common/enums/status.enum';

import { TagEntity } from '../tags/tag.entity';

export class CreatePBITransactionDto extends CreateOutgoingTransactionDto {
  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  pbiId: number;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Date when the payment should be done',
  })
  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  readonly dateShouldBePaid: string;
}

export class PBIsDoneAndUpcomingDto extends PaymentDto {
  @ApiProperty({ example: 'Medium' })
  @IsNotEmpty()
  @IsString()
  pbiName: string;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @IsString()
  pbiId: number;

  @ApiProperty({ example: Status.PAID_IN_ADVANCE })
  @IsNotEmpty()
  @IsString()
  status: Status;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @IsArray()
  pbiTags: TagEntity[];
}

export class PBIsPaySpecificNumberDto {
  @ApiProperty({
    example: ['2025-08-03T00:00:00.000Z'],
    type: [String],
    description: 'Array of ISO date strings',
  })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  datesShouldBePaid: string[];

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @IsNumber()
  pbiId: number;
}

export class PBIDatesDto {
  @ApiProperty({ example: '2026-06-15T00:00:00.000Z' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: DateStatus.PAID })
  @IsNotEmpty()
  @IsString()
  status: DateStatus;
}
