import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { OutgoingTransactionEntity } from 'src/common/entities/outgoing-transaction.entity';

import { CustomerEntity } from '../customers/customer.entity';
import { IRPEntity } from '../irp/irp.entity';

@Entity('income_transactions')
export class IncomeTransactionEntity extends OutgoingTransactionEntity {
  @ApiProperty({
    example: 1,
    description: 'Amount paid by customer per month',
  })
  @Column({ type: 'integer', nullable: false, default: 1 })
  numberOfPayments?: number;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => CustomerEntity, (customer) => customer.transactions)
  customer: Relation<CustomerEntity>;

  @OneToMany(() => IRPEntity, (payment) => payment.transaction, {
    onDelete: 'CASCADE',
  })
  readonly irps: Relation<IRPEntity[]>;
}
