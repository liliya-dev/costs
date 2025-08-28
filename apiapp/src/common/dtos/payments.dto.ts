import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

import { Currency } from '../enums/currency.enum';

export class PaymentDto {
  @ApiProperty({ example: 122 })
  @IsNotEmpty()
  @IsString()
  id: number;

  @ApiProperty({ example: 200.5 })
  @Type(() => Number)
  @Min(1)
  amount: number;

  @ApiProperty({ example: Currency.USD })
  @IsEnum(Currency)
  @IsDefined()
  @IsNotEmpty()
  currency: Currency;

  @ApiProperty({ example: 40.5 })
  @Type(() => Number)
  @Min(1)
  rateUahToUsd: number;

  @ApiProperty({ example: 40.5 })
  @Type(() => Number)
  @Min(1)
  rateUahToEur: number;

  @ApiProperty({ example: '2024-08-15T12:00:00Z' })
  @IsDateString()
  datePaid?: string;

  @ApiProperty({ example: '2024-09-15T12:00:00Z' })
  @IsDateString()
  dateShouldBePaid: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isPaidInCurrentPeriod: boolean;
}
