import * as fs from 'fs';

import numberToString from 'number-to-cyrillic';
import PDFDocument from 'pdfkit';

import { FOPCustomerEntity } from 'src/app/fop-customers/fop-customer.entity';
import { CreateInvoiceDto } from 'src/app/invoices/invoices.dto';

import { Currency } from '../enums/currency.enum';

import {
  getUkrainianMonthName,
  MonthCase,
} from './get-ukrainian-month-name.helper';

function formatUah(amount: string | number, itemsCount: number = 1): string {
  const parts = amount.toString().replace(',', '.').split('.');
  const hryvnias = parts[0];
  const kopeks = parts[1] ? parts[1].padEnd(2, '0') : '00';
  return `Усього наименувань ${itemsCount}, на суму ${hryvnias} грн. ${kopeks} коп.`;
}

export async function generateInvoicePdfStructure({
  fopCustomer,
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
  fopCustomer: FOPCustomerEntity;
  dto: CreateInvoiceDto;
  totalAmount: number;
  rateUahToEur: number;
  rateUahToUsd: number;
}): Promise<string> {
  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  doc.font(fontPath);

  doc.fontSize(8).table({
    data: [
      ['Одержувач', fopCustomer.account.fopFullName],
      ['ІПН', fopCustomer.account.ipn],
      ['Банк одержувача', fopCustomer.account.bankName],
      [
        'IBAN',
        {
          text: fopCustomer.account.iban,
          font: boldFontPath,
          textStroke: 0.4,
        },
      ],
    ],
    defaultStyle: { width: 180, border: 0 },
  });

  doc.moveDown(4);
  doc
    .font(boldFontPath)
    .fontSize(11)
    .text(
      `Рахунок на сплату № ${dto.month}/${dto.year.toString().substring(2)}-${fopCustomer.bankDetails.invoice_prefix} від ${dto.day} ${getUkrainianMonthName(dto.month, MonthCase.Genitive)} ${dto.year} року`,
      { align: 'left' },
    );

  doc.x = 50;
  doc.moveDown(5);
  doc.font(fontPath).fontSize(8).text(`Виконавець:`);

  doc
    .font(fontPath)
    .fontSize(8)
    .text(
      `        ${fopCustomer.account.fopFullName}
        IBAN ${fopCustomer.account.iban}
        ${fopCustomer.account.bankName}
        ІПН ${fopCustomer.account.ipn} ,
        ЄДРПОУ Банка ${fopCustomer.account.bankEdrpou} МФО ${fopCustomer.account.mfo}
        ${fopCustomer.account.address}
        ${fopCustomer.account.taxSystem}`,
      doc.x + 50,
      doc.y - 30,
    );

  doc.x = 50;
  doc.moveDown(5);
  doc.font(fontPath).fontSize(8).text(`Замовник:`);

  const { bankDetails } = fopCustomer;

  const lines: string[] = [];

  if (fopCustomer.name) lines.push(fopCustomer.name);
  if (bankDetails?.address) lines.push(bankDetails.address);
  if (bankDetails?.iban) lines.push(`П/р в форматі IBAN: ${bankDetails.iban}`);
  if (bankDetails?.bank_name || bankDetails?.mfo) {
    lines.push(
      `${bankDetails?.bank_name || ''}${bankDetails?.mfo ? `, МФО ${bankDetails.mfo}` : ''}`,
    );
  }
  if (bankDetails?.edrpou) lines.push(`код по ЄДРПОУ ${bankDetails.edrpou}`);
  if (bankDetails?.ipn) lines.push(`ІПН ${bankDetails.ipn}`);
  if (bankDetails?.vat_certificate)
    lines.push(`Свід. ПДВ № ${bankDetails.vat_certificate}`);
  if (bankDetails?.tax_system) lines.push(bankDetails.tax_system);
  if (bankDetails?.phone) lines.push(bankDetails.phone);
  if (bankDetails?.email) lines.push(bankDetails.email);

  doc
    .font(fontPath)
    .fontSize(8)
    .text(`        ${lines.join('\n        ')}`, doc.x + 50, doc.y - 30);

  doc.x = 50;
  doc.moveDown(3);
  doc.font(fontPath).fontSize(8).text(`Договір:`);

  doc
    .font(fontPath)
    .fontSize(8)
    .text(
      `        ${fopCustomer.bankDetails?.contract_description}  № ${fopCustomer.bankDetails.contract_number} від ${fopCustomer.bankDetails.contract_date} р`,
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
  doc.text(formatUah(totalAmount));
  doc
    .font(boldFontPath)
    .fontSize(8)
    .text(`Разом: ${totalAmount.toFixed(2)}`, { align: 'right' });

  const words = numberToString.convert(totalAmount.toFixed(2));
  doc.text(
    `${words.convertedInteger} ${words.integerCurrency} ${words.fractionalString} ${words.fractionalCurrency}`,
    {
      align: 'left',
    },
  );

  doc.moveDown(4);
  doc.font(fontPath).fontSize(7);
  doc.text(
    'Виписав:       ______________________________________',
    400,
    doc.y,
    { align: 'center' },
  );
  doc.moveDown(1);
  doc.text(`${fopCustomer.account.directorName}      `, 450, doc.y, {
    align: 'center',
  });

  doc.end();
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}
