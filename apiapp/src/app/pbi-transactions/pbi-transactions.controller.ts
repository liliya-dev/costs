import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiOkResponseDecorator } from 'src/common/decorators/api-ok-response.decorator';
import { PeriodOptionsDto } from 'src/common/dtos/period-options.dto';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { IPBITransactionsController } from 'src/common/interfaces/controllers/pbi-transactions.controller';

import { PBIEntity } from '../pbi/pbi.entity';

import {
  CreatePBITransactionDto,
  PBIsDoneAndUpcomingDto,
} from './pbi-transaction.dto';
import { PBITransactionEntity } from './pbi-transaction.entity';
import { PBITransactionsService } from './pbi-transactions.service';

@ApiTags('Payments by installments transactions')
@Controller('pbi-transactions')
@UseInterceptors(FormatResponseInterceptor)
export class PBITransactionsController implements IPBITransactionsController {
  constructor(private pbistransactionsService: PBITransactionsService) {}
  @ApiOperation({
    summary: 'Create pbi transaction item',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(PBITransactionEntity)
  @Post('/create')
  async create(
    @Body() createDto: CreatePBITransactionDto,
  ): Promise<PBITransactionEntity> {
    return await this.pbistransactionsService.create(createDto);
  }

  @ApiOperation({
    summary:
      'Get all pbi payments in billing period with status for the specific account',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(PBIsDoneAndUpcomingDto, true)
  @Get('/period/:id')
  async getInPeriod(
    @Query() dto: PeriodOptionsDto,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<PBIsDoneAndUpcomingDto[]> {
    return await this.pbistransactionsService.getInPeriod(dto, id);
  }

  @ApiOperation({
    summary: 'Pay off pbi by its id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(PBITransactionEntity)
  @Post('/pay-off/:id')
  async payOff(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<PBIEntity> {
    return await this.pbistransactionsService.payOff(id);
  }
}
