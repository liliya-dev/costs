import { CreateSubscriptionTransactionDto } from 'src/app/subscription-transactions/subscription-transaction.dto';
import { SubscriptionTransactionEntity } from 'src/app/subscription-transactions/subscription-transaction.entity';

export interface ISubscriptionTransactionsController {
  create(
    data: CreateSubscriptionTransactionDto,
  ): Promise<SubscriptionTransactionEntity>;
}
