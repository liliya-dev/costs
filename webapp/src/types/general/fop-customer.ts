import { BaseEntityPaymentData, BaseEntityType } from './base';
import { InvoiceStatus } from './enums';

export interface IBaseFOPCustomer extends BaseEntityType, BaseEntityPaymentData {
  tgId?: string;
  isCancelled: boolean;
  isTgSubscribed?: boolean;
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
  invoice_prefix: string;
  director: string;
}

export interface IFOPAct extends BaseEntityType {
  filePath?: string;
}

export interface IFOPInvoice extends BaseEntityType {
  datePaid?: string;
  amount: number;
  status: InvoiceStatus;
  filePath?: string;
  act: IFOPAct;
}

export interface IFOPCustomer extends IBaseFOPCustomer {
  bankDetails?: IBankDetails;
  invoices: IFOPInvoice[];
}
