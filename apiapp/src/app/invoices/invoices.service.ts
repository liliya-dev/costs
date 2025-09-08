import * as fs from 'fs';
import * as path from 'path';

import { Injectable, NotFoundException } from '@nestjs/common';
import numberToString from 'number-to-cyrillic';
import PDFDocument from 'pdfkit';

import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';

import { FOPCustomerEntity } from '../fop-customers/fop-customer.entity';
import { FOPCustomersService } from '../fop-customers/fop-customers.service';

import { InvoiceEntity } from './invoice.entity';
import { CreateInvoiceDto } from './invoices.dto';
import { InvoicesRepository } from './invoices.repository';

function formatUah(amount: string | number, itemsCount: number = 1): string {
  const parts = amount.toString().replace(',', '.').split('.');
  const hryvnias = parts[0];
  const kopeks = parts[1] ? parts[1].padEnd(2, '0') : '00';
  return `Усього наименувань ${itemsCount}, на суму ${hryvnias} грн. ${kopeks} коп.`;
}

@Injectable()
export class InvoicesService {
  constructor(
    private readonly invoicesRepository: InvoicesRepository,
    private readonly fopCustomersService: FOPCustomersService,
  ) {}

  async createInvoice(dto: CreateInvoiceDto): Promise<InvoiceEntity> {
    const fopCustomer = await this.fopCustomersService.getOneById(
      dto.customerId,
    );
    if (!fopCustomer) throw new NotFoundException('FOP Customer not found');

    const pdfPath = await this.generatePdf(fopCustomer, dto);

    const totalAmount = dto.hours * dto.price;

    const invoice = this.invoicesRepository.create({
      customer: fopCustomer,
      month: dto.month,
      year: dto.year,
      totalAmount,
      status: InvoiceStatus.PENDING,
      filePath: pdfPath,
    });

    return await this.invoicesRepository.save(invoice);
  }

  private async generatePdf(
    fopCustomer: FOPCustomerEntity,
    dto: CreateInvoiceDto,
  ): Promise<string> {
    const invoicesDir = path.join(__dirname, '../../invoices');
    if (!fs.existsSync(invoicesDir))
      fs.mkdirSync(invoicesDir, { recursive: true });

    const fileName = `invoice-${fopCustomer.id}-${dto.month}666.pdf`;
    const filePath = path.join(invoicesDir, fileName);

    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    const fontPath = path.join(
      __dirname,
      '../../../src/assets/fonts/Roboto-Regular.ttf',
    );
    const boldFontPath = path.join(
      __dirname,
      '../../../src/assets/fonts/Roboto-Medium.ttf',
    );

    doc.font(fontPath);

    const totalAmount = dto.hours * dto.price;

    doc.fontSize(6).table({
      data: [
        ['Одержувач', 'ФОП Сезанович Вікторія ПетрівнаAAA'],
        ['ЕГРПОУ/ІПН', '359690428'],
        ['Банк одержувача', 'Акціонерне Товариство "А-Банк"'],
        [
          'IBAN',
          {
            text: 'UA10 307770 00000 26004611213372',
            font: boldFontPath,
            textStroke: 0.4,
          },
        ],
      ],
      defaultStyle: { width: 110, border: 0 },
    });

    doc.moveDown(4);
    doc
      .font(boldFontPath)
      .fontSize(11)
      .text(
        `Рахунок на сплату № ${dto.month}/${dto.year} від ${new Date().toLocaleDateString('uk-UA')}`,
        { align: 'left' },
      );

    doc.x = 50;
    doc.moveDown(5);
    doc.font(fontPath).fontSize(7).text(`Виконавець:`);

    doc
      .font(fontPath)
      .fontSize(7)
      .text(
        `        ФОП Сезанович Вікторія Петрівна
        IBAN UA10 307770 00000 26004611213372
        Акціонерне Товариство "А-Банк"
        ІПН 3596903428 ,
        ЄДРПОУ Банка 14360080 МФО 307770
        08132, Київська обл., Бучанський р-н, місто Вишневе вул. Південна, будинок 9, квартира 68
        Платник єдиного податку 3 групи`,
        doc.x + 50,
        doc.y - 30,
      );

    doc.x = 50;
    doc.moveDown(5);
    doc.font(fontPath).fontSize(7).text(`Замовник:`);

    doc
      .font(fontPath)
      .fontSize(7)
      .text(
        `        Товариство з обмеженою відповідальністю "ТОТ ГРУП"
        65085, м. Одеса, вул. Самарська, 4
        П/р в форматі IBAN: UA763052990000026007030110502
        ПАТ КБ "ПРИВАТБАНК", МФО 305299
        код по ЄДРПОУ 37118337
        ІПН 371183326531
        Свід. ПДВ № 200155465
        Є платником податку на прибуток на загальних підставах
        096-318-25-01
        totgroup@hlebod.com:`,
        doc.x + 50,
        doc.y - 30,
      );

    doc.x = 50;
    doc.moveDown(3);
    doc.font(fontPath).fontSize(7).text(`Договір:`);

    doc
      .font(fontPath)
      .fontSize(7)
      .text(
        `        ${fopCustomer.bankDetails?.contract_description}  № 1/25-TOT від 14.03.2025р`,
        doc.x + 50,
        doc.y - 8,
      );

    doc.x = 50;
    doc.moveDown(3);
    doc
      .fontSize(8)
      .table()
      .row([
        { text: '№', backgroundColor: '#f2f2c0' },
        {
          text: 'Товари (роботи, послуги)',
          backgroundColor: '#f2f2c0',
          colSpan: 3,
        },
        { text: 'Кількість', backgroundColor: '#f2f2c0' },
        { text: 'о/в', backgroundColor: '#f2f2c0' },
        { text: 'Ціна', backgroundColor: '#f2f2c0' },
        { text: 'Сума', backgroundColor: '#f2f2c0' },
      ])
      .row([
        '1',
        {
          text: `Консультування з питань інформатизації за ${dto.month}.${dto.year}р.`,
          colSpan: 3,
        },
        dto.hours.toString(),
        'год',
        dto.price.toFixed(2),
        totalAmount.toFixed(2),
      ]);

    doc.moveDown(2);
    doc.text(formatUah(totalAmount));
    doc
      .font(boldFontPath)
      .fontSize(8)
      .text(`Разом: ${totalAmount.toFixed(2)}`, { align: 'right' });

    const words = numberToString.convert(totalAmount.toFixed(2));
    doc.text(`${words.convertedInteger} ${words.integerCurrency}`, {
      align: 'left',
    });

    doc.moveDown(4);
    doc.font(fontPath).fontSize(7);
    doc.text(
      'Виписав:       ______________________________________',
      400,
      doc.y,
      { align: 'center' },
    );
    doc.moveDown(1);
    doc.text('Сезанович В. П.      ', 450, doc.y, { align: 'center' });

    doc.end();

    return new Promise((resolve, reject) => {
      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    });
  }

  async findById(id: number): Promise<InvoiceEntity> {
    const invoice = await this.invoicesRepository.findOne({
      where: { id },
      relations: ['customer', 'customer.bankDetails'],
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }
}
