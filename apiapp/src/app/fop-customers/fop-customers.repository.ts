import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { FOPCustomerEntity } from './fop-customer.entity';

@CustomEntityRepository(FOPCustomerEntity)
export class FOPCustomersRepository extends Repository<FOPCustomerEntity> {}
