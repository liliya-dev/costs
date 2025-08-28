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
import { ISubscriptionTransactionsController } from 'src/common/interfaces/controllers/subscription-transactions-controller.interface';

import {
  CreateSubscriptionTransactionDto,
  SubscriptionsDoneAndUpcomingDto,
} from './subscription-transaction.dto';
import { SubscriptionTransactionEntity } from './subscription-transaction.entity';
import { SubscriptionTransactionsService } from './subscription-transactions.service';

@ApiTags('Subscriptions transactions')
@Controller('subscriptions-transactions')
@UseInterceptors(FormatResponseInterceptor)
export class SubscriptionTransactionsController
  implements ISubscriptionTransactionsController
{
  constructor(
    private subscriptionTransactionsService: SubscriptionTransactionsService,
  ) {}
  @ApiOperation({
    summary: 'Create regular subscription transaction item',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(SubscriptionTransactionEntity)
  @Post('/create')
  async create(
    @Body() createDto: CreateSubscriptionTransactionDto,
  ): Promise<SubscriptionTransactionEntity> {
    return await this.subscriptionTransactionsService.create(createDto);
  }

  @ApiOperation({
    summary:
      'Get all subscription payments in billing period with status for the specific account',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(SubscriptionsDoneAndUpcomingDto, true)
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
  ): Promise<SubscriptionsDoneAndUpcomingDto[]> {
    return await this.subscriptionTransactionsService.getInPeriod(dto, id);
  }
}
