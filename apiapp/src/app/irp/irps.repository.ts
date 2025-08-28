import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { IRPEntity } from './irp.entity';

@CustomEntityRepository(IRPEntity)
export class IRPsRepository extends Repository<IRPEntity> {}
