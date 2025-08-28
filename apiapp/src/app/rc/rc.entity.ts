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
import { RCTransactionEntity } from '../rc-transactions/rc-transaction.entity';
import { TagEntity } from '../tags/tag.entity';

@Entity('rcs')
export class RCEntity extends PaymentEntity {
  @ApiProperty({
    example: false,
    description:
      'Is amount permanent or should be predicted from the previous month',
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  readonly isPermanentAmount: boolean;

  @ApiProperty({
    example: true,
    description: 'Is regular cost active',
  })
  @Column({
    type: 'boolean',
    default: true,
  })
  readonly isActive?: boolean;

  @ApiProperty({
    example: 'This payment is made to ...',
    description: 'Some payment details and descriptions',
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => TagEntity)
  @JoinTable({
    name: 'rc_tags',
    joinColumn: {
      name: 'rc_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];

  @ManyToOne(() => AccountEntity, (account) => account.rcs)
  readonly account: Relation<Partial<AccountEntity>>;

  @OneToMany(() => RCTransactionEntity, (rcTransaction) => rcTransaction.rc)
  readonly transactions: Relation<RCTransactionEntity[]>;
}
