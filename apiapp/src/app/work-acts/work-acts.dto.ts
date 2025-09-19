import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class CreateWorkActDto {
  @ApiProperty({
    example: 5,
    description: 'ID інвойса, який отримує акт',
  })
  @IsInt()
  invoiceId: number;

  @ApiProperty({
    example: 9,
    description: 'Місяць акту (1-12)',
  })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({
    example: 2025,
    description: 'Рік акту',
  })
  @IsInt()
  year: number;

  @ApiProperty({
    example: 28,
    description: 'День акту',
  })
  @IsInt()
  day: number;
}
