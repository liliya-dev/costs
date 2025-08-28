import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { SubscriptionTransactionEntity } from './subscription-transaction.entity';

@CustomEntityRepository(SubscriptionTransactionEntity)
export class SubscriptionTransactionsRepository extends Repository<SubscriptionTransactionEntity> {}
