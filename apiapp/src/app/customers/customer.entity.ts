import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

import { PaymentEntity } from 'src/common/entities/payment.entity';

import { AccountEntity } from '../accounts/accounts.entity';
import { IncomeTransactionEntity } from '../income-transactions/income-transaction.entity';

@Entity('customer')
export class CustomerEntity extends PaymentEntity {
  @ApiProperty({
    example: false,
    description: 'Does customer pays cashless',
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  readonly isCashless: boolean;

  @ApiProperty({
    example: false,
    description: 'Is customer cancelled',
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  readonly isCancelled: boolean;

  @OneToMany(
    () => IncomeTransactionEntity,
    (donePayment) => donePayment.customer,
  )
  readonly transactions: Relation<IncomeTransactionEntity[]>;

  @ManyToOne(() => AccountEntity, (account) => account.customers)
  readonly account: Relation<AccountEntity>;
}
