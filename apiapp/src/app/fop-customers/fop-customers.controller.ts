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
import {
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { ApiOkResponseDecorator } from 'src/common/decorators/api-ok-response.decorator';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';

import { CreateFOPCustomerDto } from './fop-customer.dto';
import { FOPCustomerEntity } from './fop-customer.entity';
import { FOPCustomersService } from './fop-customers.service';

@ApiTags('FOP Customers')
@Controller('fop-customers')
@UseInterceptors(FormatResponseInterceptor)
export class FOPCustomersController {
  constructor(private fopCustomerService: FOPCustomersService) {}
  @ApiOperation({
    summary: 'Get fop customer info by id',
  })
  @ApiNotFoundResponse({
    description: 'The customer with this id was not found',
  })
  @ApiParam({ name: 'id', type: 'integer', example: 134567, required: true })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(FOPCustomerEntity)
  @Get('/:id')
  async getOne(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<FOPCustomerEntity> {
    return await this.fopCustomerService.getOneById(id);
  }

  @ApiOperation({
    summary: 'Get fop customers info by account id',
  })
  @ApiNotFoundResponse({
    description: 'FOP Customers for this account id were not found',
  })
  @ApiParam({ name: 'id', type: 'integer', example: 134567, required: true })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(FOPCustomerEntity)
  @Get('/account/:id')
  async getAllByAccountId(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<FOPCustomerEntity[]> {
    return await this.fopCustomerService.getAllByAccountId(id);
  }

  @ApiOperation({
    summary: 'Create FOP customer',
  })
  @ApiNotFoundResponse({
    description: 'FOP Customer was not created',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(FOPCustomerEntity)
  @Post('/create')
  async create(
    @Body() createDto: CreateFOPCustomerDto,
  ): Promise<FOPCustomerEntity> {
    return await this.fopCustomerService.create(createDto);
  }

  @ApiOperation({
    summary: 'Delete FOP customer by its id',
  })
  @ApiNotFoundResponse({
    description: 'The FOP customer was not deleted',
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
    return await this.fopCustomerService.deleteById(id);
  }

  @ApiOperation({
    summary: 'Update customer item by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(FOPCustomerEntity)
  @Put('/update/:id')
  async update(
    @Body() updateDto: Partial<CreateFOPCustomerDto>,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<FOPCustomerEntity> {
    return await this.fopCustomerService.update(updateDto, id);
  }
}
