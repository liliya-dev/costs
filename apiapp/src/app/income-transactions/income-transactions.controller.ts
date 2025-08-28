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
import { IIncomeTransactionsController } from 'src/common/interfaces/controllers/income-transactions-controller.interface';

import { IncomeTransactionsService } from '../income-transactions/income-transactions.service';
import { IRPEntity } from '../irp/irp.entity';

import { IncomeTransactionEntity } from './income-transaction.entity';
import { IncomeTransactionsCreateDto } from './income-transactions.dto';

@ApiTags('Income regular transactions from the customers')
@Controller('income-transactions')
@UseInterceptors(FormatResponseInterceptor)
export class IncomeTransactionsController
  implements IIncomeTransactionsController
{
  constructor(private incomeTransactionsService: IncomeTransactionsService) {}

  @ApiOperation({
    summary: 'Create income transaction from the specific customer',
  })
  @ApiNotFoundResponse({
    description: 'The transaction was not created',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(IncomeTransactionEntity)
  @Post('/create')
  async create(
    @Body() createDto: IncomeTransactionsCreateDto,
  ): Promise<IncomeTransactionEntity> {
    return await this.incomeTransactionsService.create(createDto);
  }

  @ApiOperation({
    summary: 'Delete transaction by its id',
  })
  @ApiNotFoundResponse({
    description: 'The transaction was not deleted',
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
    return await this.incomeTransactionsService.deleteById(id);
  }

  @ApiOperation({
    summary: 'Get transaction by its id',
  })
  @ApiNotFoundResponse({
    description: 'The transaction was not found',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(IncomeTransactionEntity)
  @Get('/:id')
  async findById(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<IncomeTransactionEntity> {
    return await this.incomeTransactionsService.findById(id);
  }

  @ApiOperation({
    summary: 'Edit irp item by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(IRPEntity)
  @Put('/update/:id')
  async update(
    @Body() updateDto: IncomeTransactionsCreateDto,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<IncomeTransactionEntity> {
    return await this.incomeTransactionsService.updateTransactionById(
      id,
      updateDto,
    );
  }
}
