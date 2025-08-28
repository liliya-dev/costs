import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { OTPEntity } from './otps.entity';

@CustomEntityRepository(OTPEntity)
export class OTPsRepository extends Repository<OTPEntity> {}
