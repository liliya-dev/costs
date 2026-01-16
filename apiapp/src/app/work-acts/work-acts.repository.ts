import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { WorkActEntity } from './work-act.entity';

@CustomEntityRepository(WorkActEntity)
export class WorkActsRepository extends Repository<WorkActEntity> {}
