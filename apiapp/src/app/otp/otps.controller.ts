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
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiOkResponseDecorator } from 'src/common/decorators/api-ok-response.decorator';
import { PeriodOptionsDto } from 'src/common/dtos/period-options.dto';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';
import { IOTPsController } from 'src/common/interfaces/controllers/otp.controller.interface';

import { CreateOTPDto, UpdateOTPDto } from './otp.dto';
import { OTPEntity } from './otps.entity';
import { OTPsService } from './otps.service';

@ApiTags('One time (expences) payment transactions')
@Controller('otps')
@UseInterceptors(FormatResponseInterceptor)
export class OTPsController implements IOTPsController {
  constructor(private otpsService: OTPsService) {}
  @ApiOperation({
    summary: 'Create otp transaction item',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(OTPEntity)
  @Post('/create')
  async create(@Body() createDto: CreateOTPDto): Promise<OTPEntity> {
    return await this.otpsService.create(createDto);
  }

  @ApiOperation({
    summary:
      'Get all one time payments in billing period with status for the specific account',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(OTPEntity, true)
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
  ): Promise<OTPEntity[]> {
    return await this.otpsService.getInPeriod(dto, id);
  }

  @ApiOperation({
    summary: 'Get all otps for account',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(OTPEntity, true)
  @Get('/account/:id')
  async getByAccountId(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<OTPEntity[]> {
    return await this.otpsService.getByAccountId(id);
  }

  @ApiOperation({
    summary: 'Delete otp by its id',
  })
  @ApiNotFoundResponse({
    description: 'The otp was not deleted',
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
    return await this.otpsService.deleteById(id);
  }

  @ApiOperation({
    summary: 'Update otp item by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(OTPEntity)
  @Put('/update/:id')
  async update(
    @Body() updateDto: Partial<UpdateOTPDto>,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<OTPEntity> {
    return await this.otpsService.update(updateDto, id);
  }
}
