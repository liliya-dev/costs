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
import { ICustomerController } from 'src/common/interfaces/controllers/customer-controller.interface';

import { CustomerDto, CustomerDtoWithPayments } from './customer.dto';
import { CustomerEntity } from './customer.entity';
import { CustomersService } from './customers.service';

@ApiTags('Customers with monthly payments')
@Controller('customers')
@UseInterceptors(FormatResponseInterceptor)
export class CustomersController implements ICustomerController {
  constructor(private customerService: CustomersService) {}
  @ApiOperation({
    summary: 'Get customer info by id',
  })
  @ApiNotFoundResponse({
    description: 'The customer with this id was not found',
  })
  @ApiParam({ name: 'id', type: 'integer', example: 134567, required: true })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(CustomerEntity)
  @Get('/:id')
  async getOne(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<CustomerEntity> {
    return await this.customerService.getOneById(id);
  }

  @ApiOperation({
    summary: 'Get customers info by account id',
  })
  @ApiNotFoundResponse({
    description: 'Customers for this account id were not found',
  })
  @ApiParam({ name: 'id', type: 'integer', example: 134567, required: true })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(CustomerEntity)
  @Get('/account/:id')
  async getAllByAccountId(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<CustomerEntity[]> {
    return await this.customerService.getAllByAccountId(id);
  }

  @ApiOperation({
    summary: 'Create customer',
  })
  @ApiNotFoundResponse({
    description: 'Customer was not created',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(CustomerEntity)
  @Post('/create')
  async create(@Body() createDto: CustomerDto): Promise<CustomerEntity> {
    return await this.customerService.create(createDto);
  }

  @ApiOperation({
    summary: 'Delete customer by its id',
  })
  @ApiNotFoundResponse({
    description: 'The customer was not deleted',
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
    return await this.customerService.deleteById(id);
  }

  @ApiOperation({
    summary: 'Update customer item by id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(CustomerEntity)
  @Put('/update/:id')
  async update(
    @Body() updateDto: Partial<CustomerDto>,
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<CustomerEntity> {
    return await this.customerService.update(updateDto, id);
  }

  @ApiOperation({
    summary: 'Get one customer by its id with all payments',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(CustomerDtoWithPayments, false)
  @Get('/payments/:id')
  async getByIdWithTransactions(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<CustomerDtoWithPayments> {
    return await this.customerService.getOneWithPayments(id);
  }
}
