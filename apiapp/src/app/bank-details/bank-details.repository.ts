import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { BankDetailsEntity } from './bank-details.entity';

@CustomEntityRepository(BankDetailsEntity)
export class BankDetailsRepository extends Repository<BankDetailsEntity> {}
