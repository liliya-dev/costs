import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { IncomeTransactionEntity } from './income-transaction.entity';

@CustomEntityRepository(IncomeTransactionEntity)
export class IncomeTransactionsRepository extends Repository<IncomeTransactionEntity> {}
