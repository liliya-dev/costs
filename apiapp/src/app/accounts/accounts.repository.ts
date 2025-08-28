import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { AccountEntity } from './accounts.entity';

@CustomEntityRepository(AccountEntity)
export class AccountsRepository extends Repository<AccountEntity> {}
