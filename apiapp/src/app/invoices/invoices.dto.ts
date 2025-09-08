import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsPositive, Min, Max } from 'class-validator';

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
    example: 8,
    description: 'Кількість годин (обсяг послуг)',
  })
  @IsNumber()
  @IsPositive()
  hours: number;

  @ApiProperty({
    example: 625.5,
    description: 'Ціна за одну годину послуг у грн',
  })
  @IsNumber()
  @IsPositive()
  price: number;
}
