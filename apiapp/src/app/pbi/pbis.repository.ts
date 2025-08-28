import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { PBIEntity } from './pbi.entity';

@CustomEntityRepository(PBIEntity)
export class PBIsRepository extends Repository<PBIEntity> {}
