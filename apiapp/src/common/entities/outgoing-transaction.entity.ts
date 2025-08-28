import { ApiProperty } from '@nestjs/swagger';
import { Column } from 'typeorm';

import { Currency } from '../enums/currency.enum';

import { AbstractEntity } from './abstract.entity';
import { ColumnNumericTransformer } from './column-numeric-transformer';

export abstract class OutgoingTransactionEntity extends AbstractEntity {
  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Date paid at',
  })
  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  readonly datePaid: string;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  rateUahToUsd: number;

  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  rateUahToEur: number;

  @ApiProperty({
    example: 500,
    description: 'Amount paid',
  })
  @Column({
    type: 'decimal',
    nullable: false,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @ApiProperty({
    enum: Currency,
    example: Currency.USD,
    description: 'Currency in which payment was made',
  })
  @Column({
    type: 'enum',
    enum: Currency,
  })
  readonly currency: Currency;
}
