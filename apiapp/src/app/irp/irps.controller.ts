import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiOkResponseDecorator } from 'src/common/decorators/api-ok-response.decorator';
import { AvailableDatesDto } from 'src/common/dtos/dates-available.dto';
import { PeriodOptionsDto } from 'src/common/dtos/period-options.dto';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { IIncomePaymentsController } from 'src/common/interfaces/controllers/income-payments-controller.interface';

import { IRPsDoneAndUpcomingDto } from './irps.dto';
import { IRPsService } from './irps.service';

@ApiTags('Income regular payments from the customers')
@Controller('irp')
@UseInterceptors(FormatResponseInterceptor)
export class IRPsController implements IIncomePaymentsController {
  constructor(private irpsService: IRPsService) {}

  @ApiOperation({
    summary:
      'Get all payments in billing period with status for the specific account',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(IRPsDoneAndUpcomingDto, true)
  @Get('/period/:id')
  async getIncomePaymentsInPeriod(
    @Query() dto: PeriodOptionsDto,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<IRPsDoneAndUpcomingDto[]> {
    return await this.irpsService.getIRPsInPeriod(dto, id);
  }

  @ApiOperation({
    summary:
      'Get all available payment dates in the period for the specific customer',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(AvailableDatesDto, true)
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
  ): Promise<AvailableDatesDto[]> {
    return await this.irpsService.getPaymentDatesAvailableForThePeriod(id, dto);
  }
}
