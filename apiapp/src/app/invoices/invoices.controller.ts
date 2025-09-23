import * as fs from 'fs';
import * as path from 'path';

import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  UseInterceptors,
  NotFoundException,
  Res,
  HttpStatus,
  ParseIntPipe,
  HttpCode,
  Delete,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';

import { InvoiceEntity } from './invoice.entity';
import { CreateInvoiceDto } from './invoices.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('Invoices')
@Controller('invoices')
@UseInterceptors(FormatResponseInterceptor)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('create')
  async createInvoice(@Body() dto: CreateInvoiceDto): Promise<InvoiceEntity> {
    return this.invoicesService.createInvoice(dto);
  }

  @Get(':id/download')
  async downloadInvoice(@Param('id') id: string, @Res() res: FastifyReply) {
    const invoice = await this.invoicesService.findById(+id);
    if (!invoice.filePath || !fs.existsSync(invoice.filePath)) {
      throw new NotFoundException('Invoice file not found');
    }

    const fileName = path.basename(invoice.filePath);
    res.header(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    );
    res.header('Content-Type', 'application/pdf');

    const stream = fs.createReadStream(invoice.filePath);
    return res.send(stream);
  }

  @ApiOperation({
    summary: 'Delete invoice by its id',
  })
  @ApiNotFoundResponse({
    description: 'The invoice customer was not deleted',
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
    return await this.invoicesService.deleteById(id);
  }
}
