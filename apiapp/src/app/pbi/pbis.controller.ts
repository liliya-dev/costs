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
import { IPBIsController } from 'src/common/interfaces/controllers/pbi-controller.interface';

import { CreatePBIDto, UpdatePBIDto } from './pbi.dto';
import { PBIEntity } from './pbi.entity';
import { PBIsService } from './pbis.service';

@ApiTags('Payments by installments')
@Controller('pbis')
@UseInterceptors(FormatResponseInterceptor)
export class PBIsController implements IPBIsController {
  constructor(private pbisService: PBIsService) {}

  @ApiOperation({
    summary: 'Update pbi item by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(PBIEntity)
  @Put('/update/:id')
  async update(
    @Body() updateDto: Partial<UpdatePBIDto>,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<PBIEntity> {
    return await this.pbisService.update(updateDto, id);
  }

  @ApiOperation({
    summary: 'Create pbi item',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(CreatePBIDto)
  @Post('/create')
  async create(@Body() createDto: CreatePBIDto): Promise<PBIEntity> {
    return await this.pbisService.create(createDto);
  }

  @ApiOperation({
    summary: 'Get all pbis for account',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(PBIEntity, true)
  @Get('/account/:id')
  async getByAccountId(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<PBIEntity[]> {
    return await this.pbisService.getByAccountId(id);
  }

  @ApiOperation({
    summary: 'Delete pbi by its id',
  })
  @ApiNotFoundResponse({
    description: 'The pbi was not deleted',
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
    return await this.pbisService.deleteById(id);
  }

  @ApiOperation({
    summary: 'Get one pbi by its id with all transactions',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(PBIEntity, false)
  @Get('/:id')
  async getByIdWithTransactions(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<PBIEntity> {
    return await this.pbisService.getOne({ id });
  }
}
