import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { PBITransactionEntity } from './pbi-transaction.entity';

@CustomEntityRepository(PBITransactionEntity)
export class PBITransactionsRepository extends Repository<PBITransactionEntity> {}
