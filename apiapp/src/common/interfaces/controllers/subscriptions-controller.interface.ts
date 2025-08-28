import { CreateSubscriptionDto } from 'src/app/subscriptions/subscription.dto';
import { SubscriptionEntity } from 'src/app/subscriptions/subscription.entity';

export interface ISubscriptionsController {
  create(data: CreateSubscriptionDto): Promise<SubscriptionEntity>;
}
