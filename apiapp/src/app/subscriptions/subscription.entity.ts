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
import { SubscriptionTransactionEntity } from '../subscription-transactions/subscription-transaction.entity';
import { TagEntity } from '../tags/tag.entity';

@Entity('subscriptions')
export class SubscriptionEntity extends PaymentEntity {
  @ApiProperty({
    example: false,
    description: 'Is subscription cancelled',
  })
  @Column({
    type: 'boolean',
    default: false,
  })
  readonly isCancelled: boolean;

  @ApiProperty({
    example: 'This subscription is made to ...',
    description: 'Some subscription details and descriptions',
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToMany(() => TagEntity)
  @JoinTable({
    name: 'subscriptions_tags',
    joinColumn: {
      name: 'subscription_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];

  @ManyToOne(() => AccountEntity, (account) => account.subscriptions)
  readonly account: Relation<Partial<AccountEntity>>;

  @OneToMany(
    () => SubscriptionTransactionEntity,
    (subscriptionTransaction) => subscriptionTransaction.subscription,
  )
  readonly transactions: Relation<SubscriptionTransactionEntity[]>;
}
