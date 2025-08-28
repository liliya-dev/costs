import { Entity, ManyToOne, Relation } from 'typeorm';

import { OutgoingTransactionEntity } from 'src/common/entities/outgoing-transaction.entity';

import { SubscriptionEntity } from '../subscriptions/subscription.entity';

@Entity('subscription-transactions')
export class SubscriptionTransactionEntity extends OutgoingTransactionEntity {
  @ManyToOne(
    () => SubscriptionEntity,
    (subscription) => subscription.transactions,
    { onDelete: 'CASCADE' },
  )
  readonly subscription: Relation<SubscriptionEntity>;
}
