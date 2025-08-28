import { IncomeTransactionEntity } from 'src/app/income-transactions/income-transaction.entity';
import { IncomeTransactionsCreateDto } from 'src/app/income-transactions/income-transactions.dto';

export interface IIncomeTransactionsController {
  create(data: IncomeTransactionsCreateDto): Promise<IncomeTransactionEntity>;
}
