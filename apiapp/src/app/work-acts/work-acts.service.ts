import * as fs from 'fs';
import * as path from 'path';

import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { generateActPdfStructure } from 'src/common/helpers/generate-act-pdf-structure.helper';
import { getRates } from 'src/common/helpers/get-rates.helper';
import {
  getUkrainianMonthName,
  MonthCase,
} from 'src/common/helpers/get-ukrainian-month-name.helper';
import { HttpPrivatBankService } from 'src/common/http/http-privat-bank.service';

import { InvoiceEntity } from '../invoices/invoice.entity';
import { InvoicesService } from '../invoices/invoices.service';

import { WorkActEntity } from './work-act.entity';
import { CreateWorkActDto } from './work-acts.dto';
import { WorkActsRepository } from './work-acts.repository';

@Injectable()
export class WorkActsService {
  constructor(
    private readonly workActsRepository: WorkActsRepository,
    private readonly invoicesService: InvoicesService,
    private readonly httpPrivatBankService: HttpPrivatBankService,
  ) {}

  async createAct(dto: CreateWorkActDto): Promise<WorkActEntity> {
    const invoice = await this.invoicesService.findById(dto.invoiceId);
    if (!invoice) throw new NotFoundException('Invoice not found');
    const actName = `Act № ${dto.year === 2025 ? dto.month - 2 : dto.month}/${dto.year}-${invoice.customer.bankDetails.invoice_prefix}`;
    const existingAct = await this.workActsRepository.findOne({
      where: {
        invoice: { id: dto.invoiceId },
        name: actName,
      },
      relations: ['invoice'],
    });

    if (existingAct) {
      return existingAct;
    }
    const ratesRes = await this.httpPrivatBankService.get('');
    const { rateUahToEur, rateUahToUsd } = getRates(ratesRes.data);

    const totalAmount = invoice.amount;

    const pdfPath = await this.generatePdf({
      rateUahToEur,
      rateUahToUsd,
      invoice,
      dto,
      totalAmount,
    });

    const act = this.workActsRepository.create({
      invoice,
      filePath: pdfPath,
      name: `Act № ${dto.year === 2025 ? dto.month - 2 : dto.month}/${dto.year}-${invoice.customer.bankDetails.invoice_prefix}`,
    });
    const savedAct = await this.workActsRepository.save(act);
    await this.invoicesService.updateInvoice(invoice.id, { act: savedAct });
    return savedAct;
  }

  private async generatePdf({
    invoice,
    dto,
    totalAmount,
    rateUahToEur,
    rateUahToUsd,
  }: {
    invoice: InvoiceEntity;
    dto: CreateWorkActDto;
    totalAmount: number;
    rateUahToEur: number;
    rateUahToUsd: number;
  }): Promise<string> {
    try {
      const actsDir = path.join(__dirname, '../../acts');
      const fontsBasePath = '../../../src/assets/fonts';
      const fopCustomer = invoice.customer;
      if (!fs.existsSync(actsDir)) fs.mkdirSync(actsDir, { recursive: true });

      const fileName = `Акт ${dto.year === 2025 ? dto.month - 2 : dto.month}_${dto.year.toString().substring(2)}_${fopCustomer.bankDetails.invoice_prefix}_від_${dto.day}_${getUkrainianMonthName(dto.month, MonthCase.Genitive)}_${dto.year}р.pdf`;
      const filePath = path.join(actsDir, fileName);

      const fontPath = path.join(
        __dirname,
        `${fontsBasePath}/Roboto-Regular.ttf`,
      );
      const boldFontPath = path.join(
        __dirname,
        `${fontsBasePath}/Roboto-Medium.ttf`,
      );
      return await generateActPdfStructure({
        invoice,
        dto,
        totalAmount,
        rateUahToEur,
        rateUahToUsd,
        filePath,
        boldFontPath,
        fontPath,
      });
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException('Failed to generate PDF');
    }
  }

  async findById(id: number): Promise<WorkActEntity> {
    const act = await this.workActsRepository.findOne({
      where: { id },
      relations: [
        'invoice',
        'invoice.customer',
        'invoice.customer.bankDetails',
        'invoice.customer.account',
      ],
    });
    if (!act) throw new NotFoundException('Act not found');
    return act;
  }
}
