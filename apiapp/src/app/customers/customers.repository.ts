import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { CustomerEntity } from './customer.entity';

@CustomEntityRepository(CustomerEntity)
export class CustomersRepository extends Repository<CustomerEntity> {}
