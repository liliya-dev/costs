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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';

import { FormatResponseInterceptor } from 'src/common/interceptors/format-response.interceptor';

import { WorkActEntity } from './work-act.entity';
import { CreateWorkActDto } from './work-acts.dto';
import { WorkActsService } from './work-acts.service';

@ApiTags('Work acts')
@Controller('work-acts')
@UseInterceptors(FormatResponseInterceptor)
export class WorkActsController {
  constructor(private readonly workActsService: WorkActsService) {}

  @Post('create')
  async createAct(@Body() dto: CreateWorkActDto): Promise<WorkActEntity> {
    return this.workActsService.createAct(dto);
  }

  @Get(':id/download')
  async downloadAct(@Param('id') id: string, @Res() res: FastifyReply) {
    const act = await this.workActsService.findById(+id);
    if (!act.filePath || !fs.existsSync(act.filePath)) {
      throw new NotFoundException('Work act file not found');
    }

    const fileName = path.basename(act.filePath);
    res.header(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(fileName)}`,
    );
    res.header('Content-Type', 'application/pdf');

    const stream = fs.createReadStream(act.filePath);
    return res.send(stream);
  }
}
