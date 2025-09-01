import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Relation,
} from 'typeorm';

import { PaymentEntity } from 'src/common/entities/payment.entity';

import { AccountEntity } from '../accounts/accounts.entity';
import { PBITransactionEntity } from '../pbi-transactions/pbi-transaction.entity';
import { TagEntity } from '../tags/tag.entity';

@Entity('pbi')
export class PBIEntity extends PaymentEntity {
  @ApiProperty({
    example: false,
    description: 'Is amount fully paid and pbi is considered to be done?',
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  readonly isFullyPaid: boolean;

  @ApiProperty({
    example: 'This payment by installments is made to ...',
    description: 'Some payment details and descriptions',
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    example: 10,
    description: 'Number of payments',
  })
  @Column({ type: 'integer', nullable: false })
  numberOfPayments: number;

  @ApiProperty({
    example: 10,
    description: 'Number of downpayments',
  })
  @Column({ type: 'integer', nullable: false, default: 0 })
  numberOfDownpayments: number;

  @ManyToMany(() => TagEntity)
  @JoinTable({
    name: 'pbi_tags',
    joinColumn: {
      name: 'pbi_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];

  @ManyToOne(() => AccountEntity, (account) => account.pbis)
  readonly account: Relation<Partial<AccountEntity>>;

  @OneToMany(() => PBITransactionEntity, (pbiTransaction) => pbiTransaction.pbi)
  readonly transactions: Relation<PBITransactionEntity[]>;
}
