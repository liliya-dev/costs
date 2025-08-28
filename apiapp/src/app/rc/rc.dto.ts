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

export class CreateRCDto {
  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  accountId: number;

  @ApiProperty({
    example: 'Servers payments',
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
  isPermanentAmount: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive?: boolean;

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

  @ApiProperty({ example: [1, 3] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  tags: number[];
}

export class UpdateRCDto {
  @ApiProperty({
    example: 'Servers payments',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 500 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  monthlyPayment: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ example: Currency.USD })
  @IsEnum(Currency)
  @IsDefined()
  @IsNotEmpty()
  currency: Currency;

  @ApiProperty({ example: false })
  @IsBoolean()
  @IsDefined()
  isPermanentAmount: boolean;

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

  @ApiProperty({ example: [1, 3] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  tags: number[];
}
