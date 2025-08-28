import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

import { Currency } from '../enums/currency.enum';

import { AbstractEntity } from './abstract.entity';
import { ColumnNumericTransformer } from './column-numeric-transformer';

export abstract class PaymentEntity extends AbstractEntity {
  @ApiProperty({
    example: 'Meduim',
  })
  @Column({ type: 'text', unique: true })
  name: string;

  @ApiProperty({
    example: 500,
    description: 'Amount should be paid per month',
  })
  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  monthlyPayment: number;

  @ApiProperty({
    enum: Currency,
    example: Currency.USD,
    description: 'Currency in which payment is made',
  })
  @Column({
    type: 'enum',
    enum: Currency,
  })
  readonly currency: Currency;

  @ApiProperty({
    example: 500,
    description:
      'Approximately date of month , when the payment should be done',
  })
  @Column({ type: 'integer', nullable: false })
  approximatelyPaymentDay: number;
}
