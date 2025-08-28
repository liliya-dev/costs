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
import { IRCTransactionsController } from 'src/common/interfaces/controllers/rc-transactions-controller.interface';

import {
  CreateRCTransactionDto,
  RCDatesDto,
  RCsDoneAndUpcomingDto,
} from './rc-transaction.dto';
import { RCTransactionEntity } from './rc-transaction.entity';
import { RCTransactionsService } from './rc-transactions.service';

@ApiTags('Regular costs transactions')
@Controller('rc-transactions')
@UseInterceptors(FormatResponseInterceptor)
export class RCTransactionsController implements IRCTransactionsController {
  constructor(private rctransactionsService: RCTransactionsService) {}
  @ApiOperation({
    summary: 'Create regular costs transaction item',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(RCTransactionEntity)
  @Post('/create')
  async create(
    @Body() createDto: CreateRCTransactionDto,
  ): Promise<RCTransactionEntity> {
    return await this.rctransactionsService.create(createDto);
  }

  @ApiOperation({
    summary:
      'Get all rc payments in billing period with status for the specific account',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(RCsDoneAndUpcomingDto, true)
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
  ): Promise<RCsDoneAndUpcomingDto[]> {
    return await this.rctransactionsService.getInPeriod(dto, id);
  }

  @ApiOperation({
    summary:
      'Get all available rc payment dates in the period for the specific rc',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(RCDatesDto, true)
  @Get('/dates/:id')
  async getPaymentDatesAvailableForThePeriod(
    @Query() dto: PeriodOptionsDto,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<RCDatesDto[]> {
    return await this.rctransactionsService.getPaymentDatesAvailableForThePeriod(
      id,
      dto,
    );
  }
}
