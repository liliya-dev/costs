import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { OutgoingTransactionEntity } from 'src/common/entities/outgoing-transaction.entity';
import { Currency } from 'src/common/enums/currency.enum';

export class CustomerDto {
  @ApiProperty({ example: 'Customer' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: Currency.USD })
  @IsEnum(Currency)
  @IsDefined()
  @IsNotEmpty()
  currency: Currency;

  @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCancelled: boolean;

  @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isTgSubscribed?: boolean;

  @ApiProperty({ example: 500 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  monthlyPayment: number;

  @ApiProperty({ example: 18 })
  @Type(() => Number)
  @Min(1)
  @Max(28)
  @IsInt()
  approximatelyPaymentDay: number;

  @ApiProperty({
    example: '096-318-25-01',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  accountId: number;

  @ApiProperty({ example: 468546815 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  @IsOptional()
  tgId?: number;
}

export class CustomerPayment extends OutgoingTransactionEntity {
  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Date when the payment should be done',
  })
  readonly dateShouldBePaid: string;
}

export class CustomerDtoWithPayments extends CustomerDto {
  @ApiProperty({ type: () => [CustomerPayment] })
  payments: CustomerPayment[];
}
