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
import { ISubscriptionsController } from 'src/common/interfaces/controllers/subscriptions-controller.interface';

import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './subscription.dto';
import { SubscriptionEntity } from './subscription.entity';
import { SubscriptionsService } from './subscriptions.service';

@ApiTags('Subscriptions')
@Controller('subscriptions')
@UseInterceptors(FormatResponseInterceptor)
export class SubscriptionsController implements ISubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @ApiOperation({
    summary: 'Update subscription item by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(SubscriptionEntity)
  @Put('/update/:id')
  async update(
    @Body() updateDto: Partial<UpdateSubscriptionDto>,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<SubscriptionEntity> {
    return await this.subscriptionsService.update(updateDto, id);
  }

  @ApiOperation({
    summary: 'Create subscription item',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(SubscriptionEntity)
  @Post('/create')
  async create(
    @Body() createDto: CreateSubscriptionDto,
  ): Promise<SubscriptionEntity> {
    return await this.subscriptionsService.create(createDto);
  }

  @ApiOperation({
    summary: 'Get all subscriptions for account',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(SubscriptionEntity, true)
  @Get('/account/:id')
  async getByAccountId(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<SubscriptionEntity[]> {
    return await this.subscriptionsService.getByAccountId(id);
  }

  @ApiOperation({
    summary: 'Get one subscription by its id with all transactions',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(SubscriptionEntity, false)
  @Get('/:id')
  async getByIdWithTransactions(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<SubscriptionEntity> {
    return await this.subscriptionsService.getOneWithTransactions({ id });
  }

  @ApiOperation({
    summary: 'Delete subscription by its id',
  })
  @ApiNotFoundResponse({
    description: 'The subscription was not deleted',
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
    return await this.subscriptionsService.deleteById(id);
  }
}
