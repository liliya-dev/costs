import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Currency } from 'src/common/enums/currency.enum';

export class CreateSubscriptionDto {
  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  accountId: number;

  @ApiProperty({
    example: 'Medium',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 500 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  monthlyPayment: number;

  @ApiProperty({ example: Currency.USD })
  @IsEnum(Currency)
  @IsDefined()
  @IsNotEmpty()
  currency: Currency;

  @ApiProperty({
    example: 'Servers payments made for...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 18 })
  @Type(() => Number)
  @Min(1)
  @Max(28)
  @IsInt()
  approximatelyPaymentDay: number;

  @ApiProperty({ example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  tags: number[];
}

export class UpdateSubscriptionDto {
  @ApiProperty({
    example: 'Medium',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 500 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  monthlyPayment: number;

  @ApiProperty({ example: Currency.USD })
  @IsEnum(Currency)
  @IsDefined()
  @IsNotEmpty()
  currency: Currency;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsDefined()
  isCancelled: boolean;

  @ApiProperty({
    example: 'Servers payments made for...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 18 })
  @Type(() => Number)
  @Min(1)
  @Max(28)
  @IsInt()
  approximatelyPaymentDay: number;

  @ApiProperty({ example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  tags: number[];
}
