import * as fs from 'fs';
import * as path from 'path';

import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Currency } from 'src/common/enums/currency.enum';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';
import { convertCurrency } from 'src/common/helpers/convert-currency.helper';
import { generateInvoicePdfStructure } from 'src/common/helpers/generate-invoice-pdf-structure.helper';
import { getRates } from 'src/common/helpers/get-rates.helper';
import {
  getUkrainianMonthName,
  MonthCase,
} from 'src/common/helpers/get-ukrainian-month-name.helper';
import { HttpPrivatBankService } from 'src/common/http/http-privat-bank.service';

import { FOPCustomerEntity } from '../fop-customers/fop-customer.entity';
import { FOPCustomersService } from '../fop-customers/fop-customers.service';

import { InvoiceEntity } from './invoice.entity';
import { CreateInvoiceDto } from './invoices.dto';
import { InvoicesRepository } from './invoices.repository';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly invoicesRepository: InvoicesRepository,
    private readonly fopCustomersService: FOPCustomersService,
    private readonly httpPrivatBankService: HttpPrivatBankService,
  ) {}

  async createInvoice(dto: CreateInvoiceDto): Promise<InvoiceEntity> {
    const fopCustomer = await this.fopCustomersService.getOneById(
      dto.customerId,
    );
    if (!fopCustomer) throw new NotFoundException('FOP Customer not found');

    const invoiceName = `№ ${dto.year === 2025 ? dto.month - 2 : dto.month}/${dto.year}-${fopCustomer.bankDetails.invoice_prefix}`;

    const existingInvoice = await this.invoicesRepository.findOne({
      where: {
        customer: { id: dto.customerId },
        name: invoiceName,
      },
      relations: ['customer'],
    });
    if (existingInvoice) {
      return existingInvoice;
    }

    const ratesRes = await this.httpPrivatBankService.get('');
    const { rateUahToEur, rateUahToUsd } = getRates(ratesRes.data);
    const totalAmount = convertCurrency({
      amount: fopCustomer.monthlyPayment,
      baseCurrency: Currency.UAH,
      paymentCurrency: fopCustomer.currency,
      rateUahToEur,
      rateUahToUsd,
    });

    const pdfPath = await this.generatePdf({
      rateUahToEur,
      rateUahToUsd,
      fopCustomer,
      dto,
      totalAmount,
    });

    const invoice = this.invoicesRepository.create({
      customer: fopCustomer,
      amount: totalAmount,
      status: InvoiceStatus.PENDING,
      filePath: pdfPath,
      name: `№ ${dto.year === 2025 ? dto.month - 2 : dto.month}/${dto.year}-${fopCustomer.bankDetails.invoice_prefix}`,
    });

    return await this.invoicesRepository.save(invoice);
  }

  private async generatePdf({
    fopCustomer,
    dto,
    totalAmount,
    rateUahToEur,
    rateUahToUsd,
  }: {
    fopCustomer: FOPCustomerEntity;
    dto: CreateInvoiceDto;
    totalAmount: number;
    rateUahToEur: number;
    rateUahToUsd: number;
  }): Promise<string> {
    try {
      const invoicesDir = path.join(__dirname, '../../invoices');
      const fontsBasePath = '../../../src/assets/fonts';
      if (!fs.existsSync(invoicesDir))
        fs.mkdirSync(invoicesDir, { recursive: true });

      const fileName = `Рахунок_на_сплату_№_${dto.year === 2025 ? dto.month - 2 : dto.month}_${dto.year.toString().substring(2)}_${fopCustomer.bankDetails.invoice_prefix}_від_${dto.day}_${getUkrainianMonthName(dto.month, MonthCase.Genitive)}_${dto.year}р.pdf`;
      const filePath = path.join(invoicesDir, fileName);

      const fontPath = path.join(
        __dirname,
        `${fontsBasePath}/Roboto-Regular.ttf`,
      );
      const boldFontPath = path.join(
        __dirname,
        `${fontsBasePath}/Roboto-Medium.ttf`,
      );
      return await generateInvoicePdfStructure({
        fopCustomer,
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

  async updateInvoice(
    id: number,
    partial: Partial<InvoiceEntity>,
  ): Promise<InvoiceEntity> {
    const invoice = await this.findById(id);
    if (!invoice) throw new NotFoundException('Invoice not found');
    Object.assign(invoice, partial);

    return await this.invoicesRepository.save(invoice);
  }

  async findById(id: number): Promise<InvoiceEntity> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id },
      relations: [
        'customer',
        'customer.bankDetails',
        'customer.account',
        'act',
      ],
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async deleteById(id: number): Promise<number> {
    const res = await this.invoicesRepository.delete(id);
    if (res.affected === 0) {
      throw new HttpException(
        'There is no invoice customer with this id',
        HttpStatus.BAD_REQUEST,
      );
    }
    return id;
  }
}
