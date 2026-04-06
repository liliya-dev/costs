import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

import { PaymentEntity } from 'src/common/entities/payment.entity';

import { AccountEntity } from '../accounts/accounts.entity';
import { IncomeTransactionEntity } from '../income-transactions/income-transaction.entity';

@Entity('customer')
export class CustomerEntity extends PaymentEntity {
  @ApiProperty({ example: '096-318-25-01', description: 'Phone number' })
  @Column({ type: 'varchar', nullable: true })
  phone?: string;

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

  @ApiProperty({
    example: '1234',
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
