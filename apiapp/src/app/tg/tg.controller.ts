import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiOkResponseDecorator } from 'src/common/decorators/api-ok-response.decorator';
import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';

import { CustomerWithRoleDto } from './tg.dto';
import { TgService } from './tg.service';

@ApiTags('TG')
@Controller('tg')
@UseInterceptors(FormatResponseInterceptor)
export class TgController {
  constructor(private tgsService: TgService) {}

  @ApiOperation({
    summary: 'Get customer by tg id',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(CustomerWithRoleDto)
  @Get('/customer/:id')
  async findCustomerByTgId(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    tgId: number,
  ): Promise<CustomerWithRoleDto> {
    return await this.tgsService.findCustomerByTgId(tgId);
  }
}
