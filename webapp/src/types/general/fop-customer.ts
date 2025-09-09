import { BaseEntityPaymentData, BaseEntityType } from './base';
import { InvoiceStatus } from './enums';

export interface IBaseFOPCustomer extends BaseEntityType, BaseEntityPaymentData {
  isCancelled: boolean;
}

export interface IBankDetails {
  id: number;
  edrpou?: string;
  ipn?: string;
  vat_certificate?: string;
  tax_system?: string;
  iban?: string;
  bank_name?: string;
  mfo?: string;
  address?: string;
  phone?: string;
  email?: string;
  contract_number?: string;
  contract_date?: string;
  contract_description?: string;
  invoice_description?: string;
  director: string;
}

export interface IFOPInvoice {
  id: number;
  createdAt: string;
  updatedAt: string;
  month: number;
  year: number;
  totalAmount: number;
  status: InvoiceStatus;
  filePath?: string;
}

export interface IFOPCustomer extends IBaseFOPCustomer {
  bankDetails?: IBankDetails;
  invoices?: IFOPInvoice[];
}
