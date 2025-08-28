import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { OTIEntity } from './otis.entity';

@CustomEntityRepository(OTIEntity)
export class OTIsRepository extends Repository<OTIEntity> {}
