import { CreateRCTransactionDto } from 'src/app/rc-transactions/rc-transaction.dto';
import { RCTransactionEntity } from 'src/app/rc-transactions/rc-transaction.entity';

export interface IRCTransactionsController {
  create(data: CreateRCTransactionDto): Promise<RCTransactionEntity>;
}
