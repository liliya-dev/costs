import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';

import { PaymentDto } from 'src/common/dtos/payments.dto';
import { Currency } from 'src/common/enums/currency.enum';
import { Status } from 'src/common/enums/status.enum';

export class IRPCreateDto {
  @ApiProperty({ example: 200.5 })
  @Type(() => Number)
  @Min(1)
  amount: number;

  @ApiProperty({ example: Currency.USD })
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

  constructor(numberOfPayments = 1) {
    this.numberOfPayments = numberOfPayments;
  }
}

export class IRPsDoneAndUpcomingDto extends PaymentDto {
  @ApiProperty({ example: 'Customer' })
  @IsNotEmpty()
  @IsString()
  customerName: string;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @IsString()
  customerId: number;

  @ApiProperty({ example: Status.PAID_IN_ADVANCE })
  @IsNotEmpty()
  @IsString()
  status: Status;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  transactionId?: number;
}

export class IRPUpdateDto {
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
}
