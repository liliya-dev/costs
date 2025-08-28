import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDefined, IsEnum, IsNotEmpty, Min } from 'class-validator';

import { Currency } from '../enums/currency.enum';

export class CreateOutgoingTransactionDto {
  @ApiProperty({ example: 500.15 })
  @Type(() => Number)
  @Min(1)
  amount: number;

  @ApiProperty({ example: Currency.UAH })
  @IsEnum(Currency)
  @IsDefined()
  @IsNotEmpty()
  currency: Currency;
}
