import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiOkResponseDecorator } from 'src/common/decorators/api-ok-response.decorator';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { ITagsController } from 'src/common/interfaces/controllers/tags-controller.interface';

import { CreatedTagDto, CreateTagDto, UpdateTagDto } from './tag.dto';
import { TagEntity } from './tag.entity';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
@UseInterceptors(FormatResponseInterceptor)
export class TagsController implements ITagsController {
  constructor(private tagsService: TagsService) {}

  @ApiOperation({
    summary: 'Create tag to attach after for costs and expenses',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(CreatedTagDto)
  @Post('/create')
  async create(@Body() createDto: CreateTagDto): Promise<CreatedTagDto> {
    return await this.tagsService.create(createDto);
  }

  @ApiOperation({
    summary: 'Update tag item by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(CreatedTagDto)
  @Post('/update/:id')
  async update(
    @Body() updateDto: UpdateTagDto,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<TagEntity> {
    return await this.tagsService.updateById(updateDto, id);
  }

  @ApiOperation({
    summary: 'Get all tags for the specific account',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(TagEntity, true)
  @Get('/:id')
  async getInPeriod(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<TagEntity[]> {
    return await this.tagsService.findAll(id);
  }
}
