import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiOkResponseDecorator } from 'src/common/decorators/api-ok-response.decorator';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { IRCsController } from 'src/common/interfaces/controllers/rc-controller.interface';

import { CreateRCDto, UpdateRCDto } from './rc.dto';
import { RCEntity } from './rc.entity';
import { RCsService } from './rcs.service';

@ApiTags('Regular costs')
@Controller('rcs')
@UseInterceptors(FormatResponseInterceptor)
export class RCsController implements IRCsController {
  constructor(private rcsService: RCsService) {}

  @ApiOperation({
    summary: 'Update regular costs item by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(UpdateRCDto)
  @Put('/update/:id')
  async update(
    @Body() updateDto: Partial<UpdateRCDto>,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<RCEntity> {
    return await this.rcsService.update(updateDto, id);
  }

  @ApiOperation({
    summary: 'Create regular costs item',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(CreateRCDto)
  @Post('/create')
  async create(@Body() createDto: CreateRCDto): Promise<RCEntity> {
    return await this.rcsService.create(createDto);
  }

  @ApiOperation({
    summary: 'Get all regular costs for account',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(RCEntity, true)
  @Get('/account/:id')
  async getByAccountId(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<RCEntity[]> {
    return await this.rcsService.getByAccountId(id);
  }

  @ApiOperation({
    summary: 'Delete rc by its id',
  })
  @ApiNotFoundResponse({
    description: 'The rc was not deleted',
  })
  @HttpCode(HttpStatus.OK)
  @Delete('/delete/:id')
  async delete(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<number> {
    return await this.rcsService.deleteById(id);
  }

  @ApiOperation({
    summary: 'Get one rc by its id with all transactions',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(RCEntity, false)
  @Get('/:id')
  async getByIdWithTransactions(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<RCEntity> {
    return await this.rcsService.getOneWithTransactions({ id });
  }
}
