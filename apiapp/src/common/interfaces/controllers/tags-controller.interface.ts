import { CreatedTagDto, CreateTagDto } from 'src/app/tags/tag.dto';

export interface ITagsController {
  create(data: CreateTagDto): Promise<CreatedTagDto>;
}
