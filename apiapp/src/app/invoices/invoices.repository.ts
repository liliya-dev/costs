import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { InvoiceEntity } from './invoice.entity';

@CustomEntityRepository(InvoiceEntity)
export class InvoicesRepository extends Repository<InvoiceEntity> {}
