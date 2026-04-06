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

  @ManyToOne(() => AccountEntity, (account) => account.customers)
  readonly account: Relation<AccountEntity>;

  @OneToOne(() => BankDetailsEntity, (bankDetails) => bankDetails.customer, {
    cascade: true,
    nullable: true,
  })
  bankDetails: Relation<BankDetailsEntity>;

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.customer)
  readonly invoices: Relation<InvoiceEntity[]>;

  @ApiProperty({
    example: 1234,
    description: 'Tg chat id',
  })
  @Column({ type: 'varchar', nullable: true })
  tgId?: string;

  @ApiProperty({
    example: false,
    description: 'Is customer subscribed to tg bot',
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  readonly isTgSubscribed: boolean;
}
