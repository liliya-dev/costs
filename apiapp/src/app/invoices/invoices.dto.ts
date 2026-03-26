import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  Min,
  Max,
  IsEnum,
  IsDefined,
  IsNotEmpty,
} from 'class-validator';

import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';

export class CreateInvoiceDto {
  @ApiProperty({
    example: 5,
    description: 'ID клієнта, який отримує рахунок',
  })
  @IsInt()
  customerId: number;

  @ApiProperty({
    example: 9,
    description: 'Місяць рахунку (1-12)',
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    example: 2025,
    description: 'Рік рахунку',
  })
  @IsInt()
  year: number;

  @ApiProperty({
    example: 28,
    description: 'День рахунку',
  })
  @IsInt()
  day: number;
}

export class UpdateInvoiceStatusDto {
  @ApiProperty({ example: InvoiceStatus.PAID })
  @IsEnum(InvoiceStatus)
  @IsDefined()
  @IsNotEmpty()
  status: InvoiceStatus;
}
