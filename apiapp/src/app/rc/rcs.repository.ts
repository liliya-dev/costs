import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { RCEntity } from './rc.entity';

@CustomEntityRepository(RCEntity)
export class RCsRepository extends Repository<RCEntity> {}
