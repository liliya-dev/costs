import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
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
import { IAccountsController } from 'src/common/interfaces/controllers/accounts-controller.interface';

import { AccountDto } from './account.dto';
import { AccountEntity } from './accounts.entity';
import { AccountsService } from './accounts.service';

@ApiTags('Accounts')
@Controller('accounts')
@UseInterceptors(FormatResponseInterceptor)
export class AccountsController implements IAccountsController {
  constructor(private accountsService: AccountsService) {}
  @ApiOperation({
    summary: 'Get account info by id',
  })
  @ApiNotFoundResponse({
    description: 'The account with this id wasnt found',
  })
  @ApiParam({ name: 'id', type: 'integer', example: 134567, required: true })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(AccountEntity)
  @Get('/:id')
  async getOne(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
  ): Promise<AccountEntity> {
    return await this.accountsService.getOneById(id);
  }

  @ApiOperation({
    summary: 'Get accounts',
  })
  @ApiNotFoundResponse({
    description: 'Accounts were not found',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(AccountEntity)
  @Get('/')
  async getMany(): Promise<AccountEntity[]> {
    return await this.accountsService.getMany();
  }

  @ApiOperation({
    summary: 'Create account',
  })
  @ApiNotFoundResponse({
    description: 'The account was not created',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(AccountEntity)
  @Post('/create')
  async create(@Body() accountDto: AccountDto): Promise<AccountEntity> {
    return await this.accountsService.create(accountDto);
  }
}
