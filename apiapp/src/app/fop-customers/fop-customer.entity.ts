import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  Relation,
} from 'typeorm';

import { PaymentEntity } from 'src/common/entities/payment.entity';

import { AccountEntity } from '../accounts/accounts.entity';
import { BankDetailsEntity } from '../bank-details/bank-details.entity';
import { IncomeTransactionEntity } from '../income-transactions/income-transaction.entity';
import { InvoiceEntity } from '../invoices/invoice.entity';

@Entity('fop-customer')
export class FOPCustomerEntity extends PaymentEntity {
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

  @OneToOne(() => BankDetailsEntity, (bankDetails) => bankDetails.customer, {
    cascade: true,
    nullable: true,
  })
  bankDetails?: Relation<BankDetailsEntity>;

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.customer)
  readonly invoices: Relation<InvoiceEntity[]>;
}
