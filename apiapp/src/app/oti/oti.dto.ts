import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

import { CreateOutgoingTransactionDto } from 'src/common/dtos/outgoing-transaction.dto';

export class CreateOTIDto extends CreateOutgoingTransactionDto {
  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  accountId: number;

  @ApiProperty({
    example: 'Upwork',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'I was paid for overtime on upwork',
  })
  @IsString()
  @IsOptional()
  description?: string;
}

export class UpdateOTIDto extends CreateOutgoingTransactionDto {
  @ApiProperty({
    example: 'Upwork',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'I was paid for overtime on upwork',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
