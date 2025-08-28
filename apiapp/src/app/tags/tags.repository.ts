import { Repository } from 'typeorm';

import { CustomEntityRepository } from 'src/common/decorators/typeorm-ex.decorator';

import { TagEntity } from './tag.entity';

@CustomEntityRepository(TagEntity)
export class TagsRepository extends Repository<TagEntity> {}
