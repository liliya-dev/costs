import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { RCTransactionEntity } from './rc-transaction.entity';

@CustomEntityRepository(RCTransactionEntity)
export class RCTransactionsRepository extends Repository<RCTransactionEntity> {}
