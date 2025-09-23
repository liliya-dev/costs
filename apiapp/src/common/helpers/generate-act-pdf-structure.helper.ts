import * as fs from 'fs';

import numberToString from 'number-to-cyrillic';
import PDFDocument from 'pdfkit';

import { InvoiceEntity } from 'src/app/invoices/invoice.entity';
import { CreateWorkActDto } from 'src/app/work-acts/work-acts.dto';

import { Currency } from '../enums/currency.enum';

import {
  getUkrainianMonthName,
  MonthCase,
} from './get-ukrainian-month-name.helper';

function formatUah(amount: string | number): string {
  const parts = amount.toString().replace(',', '.').split('.');
  const words = numberToString.convert((+amount).toFixed(2));
  const kopeks = parts[1] ? parts[1].padEnd(2, '0') : '00';
  return `Загальна вартість робіт (послуг) склала ${words.convertedInteger} ${words.integerCurrency} ${kopeks} коп.`;
}

export async function generateActPdfStructure({
  invoice,
  dto,
  totalAmount,
  rateUahToEur,
  rateUahToUsd,
  filePath,
  fontPath,
  boldFontPath,
}: {
  filePath: string;
  boldFontPath: string;
  fontPath: string;
  invoice: InvoiceEntity;
  dto: CreateWorkActDto;
  totalAmount: number;
  rateUahToEur: number;
  rateUahToUsd: number;
}): Promise<string> {
  const fopCustomer = invoice.customer;
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.font(fontPath);

  doc.fontSize(8).table({
    rowStyles: [25, 15, 25, 12, 15],
    data: [
      ['ЗАТВЕРДЖУЮ', 'ЗАТВЕРДЖУЮ'],
      ['Директор', 'Директор'],
      [fopCustomer.account.fopFullName, fopCustomer.name],
      [
        '_______________________________________________________',
        '_______________________________________________________',
      ],
      [fopCustomer.account.directorName, fopCustomer.bankDetails.director],
    ],
    defaultStyle: { width: 240, border: 0 },
  });

  doc.moveDown(4);
  doc
    .font(boldFontPath)
    .fontSize(11)
    .text(`АКТ здачі-приймання робіт (надання послуг)`, { align: 'left' });
  doc
    .font(boldFontPath)
    .fontSize(11)
    .text(
      `№ ${dto.year === 2025 ? dto.month - 2 : dto.month}/${dto.year.toString().substring(2)}-${fopCustomer.bankDetails.invoice_prefix} від ${dto.day} ${getUkrainianMonthName(dto.month, MonthCase.Genitive)} ${dto.year} року`,
      { align: 'left' },
    );

  doc.moveDown(3);
  doc
    .font(fontPath)
    .fontSize(8)
    .text(
      `Ми, що нижче підписалися, представники Замовника ${fopCustomer.name}, з одного боку, і представник Виконавця ${fopCustomer.account.fopFullName}, з іншого боку, склали цей акт про те, що на підставі наведених документів:`,
    );
  doc.moveDown();
  doc
    .font(fontPath)
    .fontSize(7)
    .text(
      `                   Договір:                ${fopCustomer.bankDetails?.contract_description}  № ${fopCustomer.bankDetails.contract_number} від ${fopCustomer.bankDetails.contract_date} р.`,
    );
  doc.moveDown(1);
  doc
    .font(fontPath)
    .fontSize(8)
    .text(`Виконавцем були проведені такі роботи (надані такі послуги):`);

  doc.moveDown(3);
  doc
    .fontSize(8)
    .table()
    .row([
      { text: '№', backgroundColor: '#f2f2c0' },
      {
        text: 'Найменування робіт, послуг',
        backgroundColor: '#f2f2c0',
        colSpan: 3,
      },
      { text: 'Кількість', backgroundColor: '#f2f2c0' },
      { text: 'Од.', backgroundColor: '#f2f2c0' },
      { text: 'Ціна', backgroundColor: '#f2f2c0' },
      { text: 'Сума', backgroundColor: '#f2f2c0' },
    ])
    .row([
      '1',
      {
        text: `${fopCustomer.bankDetails.invoice_description} за ${getUkrainianMonthName(dto.month)} ${dto.year} р.`,
        colSpan: 3,
      },
      fopCustomer.currency === Currency.EUR
        ? rateUahToEur.toFixed(2)
        : rateUahToUsd.toFixed(2),
      'год',
      `${fopCustomer.monthlyPayment}`,
      totalAmount.toFixed(2),
    ]);

  doc.moveDown(2);
  doc
    .font(boldFontPath)
    .fontSize(8)
    .text(`Разом: ${totalAmount.toFixed(2)}`, { align: 'right' });
  doc.moveDown(2);
  doc.font(fontPath).text(formatUah(totalAmount));
  doc.text(
    'Замовник претензій за обсягом, якості і термінів надання послуг (робіт) не має.',
  );

  const linesCustomer: string[] = [];
  const { bankDetails, account } = fopCustomer;

  if (bankDetails?.address) linesCustomer.push(bankDetails.address);
  if (bankDetails?.iban) linesCustomer.push(`IBAN: ${bankDetails.iban}`);
  if (bankDetails?.bank_name || bankDetails?.mfo) {
    linesCustomer.push(
      `${bankDetails?.bank_name || ''}${bankDetails?.mfo ? `, МФО ${bankDetails.mfo}` : ''}`,
    );
  }
  if (bankDetails?.edrpou)
    linesCustomer.push(`код по ЄДРПОУ ${bankDetails.edrpou}`);
  if (bankDetails?.ipn) linesCustomer.push(`ІПН ${bankDetails.ipn}`);
  if (bankDetails?.vat_certificate)
    linesCustomer.push(`Свід. ПДВ № ${bankDetails.vat_certificate}`);
  if (bankDetails?.tax_system) linesCustomer.push(bankDetails.tax_system);
  if (bankDetails?.phone) linesCustomer.push(bankDetails.phone);
  if (bankDetails?.email) linesCustomer.push(bankDetails.email);

  const linesAccount: string[] = [];

  if (account?.address) linesAccount.push(account.address);
  if (account?.iban) linesAccount.push(`IBAN: ${account.iban}`);
  if (account?.bankName || account?.mfo) {
    linesAccount.push(
      `${account?.bankName || ''}${account?.mfo ? `, МФО ${account.mfo}` : ''}`,
    );
  }
  if (account?.bankEdrpou)
    linesAccount.push(`код по ЄДРПОУ ${account.bankEdrpou}`);
  if (account?.ipn) linesAccount.push(`ІПН ${account.ipn}`);
  if (account?.taxSystem) linesAccount.push(account.taxSystem);
  if (account?.phone) linesCustomer.push(account.phone);

  doc.moveDown(2);
  doc.fontSize(8).table({
    rowStyles: [25, 15, 25, 12, 15],
    data: [
      ['Від виконавця*', 'Від замовника'],
      [
        '_______________________________________________________',
        '_______________________________________________________',
      ],
      [fopCustomer.account.directorName, fopCustomer.bankDetails.director],
      [
        `${dto.day}.${`${dto.month}`.length === 1 ? `0${dto.month}` : dto.month}.${dto.year}p.`,
        `${dto.day}.${`${dto.month}`.length === 1 ? `0${dto.month}` : dto.month}.${dto.year}p.`,
      ],
      [fopCustomer.account.fopFullName, fopCustomer.name],
      [linesAccount.join('\n'), linesCustomer.join('\n')],
    ],
    defaultStyle: { width: 240, border: 0 },
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}
