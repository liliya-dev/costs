import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

import { Currency } from 'src/common/enums/currency.enum';

export class IncomeTransactionsCreateDto {
  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  customerId: number;

  @ApiProperty({ example: 500.15 })
  @Type(() => Number)
  @Min(1)
  amount: number;

  @ApiProperty({ example: Currency.UAH })
  @IsEnum(Currency)
  @IsDefined()
  @IsNotEmpty()
  currency: Currency;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  readonly numberOfPayments?: number = 1;

  @ApiProperty({
    example: ['2025-08-03T00:00:00.000Z'],
    type: [String],
    description: 'Array of ISO date strings',
  })
  @IsArray()
  @IsString({ each: true })
  @Type(() => String)
  datesShouldBePaid?: string[];

  constructor(numberOfPayments = 1) {
    this.numberOfPayments = numberOfPayments;
  }
}
