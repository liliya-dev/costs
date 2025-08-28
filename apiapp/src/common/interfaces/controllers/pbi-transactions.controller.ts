import { CreatePBITransactionDto } from 'src/app/pbi-transactions/pbi-transaction.dto';
import { PBITransactionEntity } from 'src/app/pbi-transactions/pbi-transaction.entity';

export interface IPBITransactionsController {
  create(data: CreatePBITransactionDto): Promise<PBITransactionEntity>;
}
