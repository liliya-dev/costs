import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { ColumnNumericTransformer } from 'src/common/entities/column-numeric-transformer';
import { Currency } from 'src/common/enums/currency.enum';

import { IncomeTransactionEntity } from '../income-transactions/income-transaction.entity';

@Entity('irp')
export class IRPEntity extends AbstractEntity {
  @ApiProperty({
    example: 500,
    description: 'Amount paid by customer per month',
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

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Date when the payment was done',
  })
  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  readonly datePaid: string;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Date when the payment should be done',
  })
  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  readonly dateShouldBePaid: string;

  @ManyToOne(() => IncomeTransactionEntity, (transaction) => transaction.irps, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  transaction: Relation<IncomeTransactionEntity>;
}
