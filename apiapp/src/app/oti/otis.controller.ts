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
import { IOTIsController } from 'src/common/interfaces/controllers/oti.controller.interface';

import { CreateOTIDto, UpdateOTIDto } from './oti.dto';
import { OTIEntity } from './otis.entity';
import { OTIsService } from './otis.service';

@ApiTags('One time (income) payment transactions')
@Controller('otis')
@UseInterceptors(FormatResponseInterceptor)
export class OTIsController implements IOTIsController {
  constructor(private otisService: OTIsService) {}
  @ApiOperation({
    summary: 'Create oti transaction item',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(OTIEntity)
  @Post('/create')
  async create(@Body() createDto: CreateOTIDto): Promise<OTIEntity> {
    return await this.otisService.create(createDto);
  }

  @ApiOperation({
    summary: 'Edit oti transaction item',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(OTIEntity)
  @Put('/update/:id')
  async update(
    @Param(
      'id',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE,
      }),
    )
    id: number,
    @Body() updateDto: UpdateOTIDto,
  ): Promise<OTIEntity> {
    return await this.otisService.update(id, updateDto);
  }

  @ApiOperation({
    summary: 'Delete oti by its id',
  })
  @ApiNotFoundResponse({
    description: 'The oti was not deleted',
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
    return await this.otisService.deleteById(id);
  }

  @ApiOperation({
    summary:
      'Get all one time payments in billing period with status for the specific account',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponseDecorator(OTIEntity, true)
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
  ): Promise<OTIEntity[]> {
    return await this.otisService.getInPeriod(dto, id);
  }
}
