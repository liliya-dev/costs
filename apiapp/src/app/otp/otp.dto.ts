import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { CreateOutgoingTransactionDto } from 'src/common/dtos/outgoing-transaction.dto';

export class CreateOTPDto extends CreateOutgoingTransactionDto {
  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  accountId: number;

  @ApiProperty({
    example: 'Pharmacy',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'I bouht this for...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: [1, 3] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  tags: number[];
}

export class UpdateOTPDto extends CreateOutgoingTransactionDto {
  @ApiProperty({
    example: 'Pharmacy',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'I bouht this for...',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: [] })
  @IsArray()
  @IsOptional()
  @IsNumber({}, { each: true })
  tags: number[];
}
