import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { SubscriptionEntity } from './subscription.entity';

@CustomEntityRepository(SubscriptionEntity)
export class SubscriptionsRepository extends Repository<SubscriptionEntity> {}
