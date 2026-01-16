import { Currency } from '.';

export interface CreateAccountDto {
  name: string;
}

export interface CreateCustomerDto {
  name: string;
  currency: Currency;
  monthlyPayment: number;
  approximatelyPaymentDay: number;
  accountId: number;
  isCancelled?: boolean;
  phone?: string;
}

export interface CreateTransactionDto {
  amount: number;
  customerId: number;
  numberOfPayments: number;
  currency: Currency;
  datesShouldBePaid: string[];
}

export interface CreateOTIDto {
  amount: number;
  accountId: number;
  name: string;
  description?: string;
  currency: Currency;
}

export interface UpdateOTIDto {
  amount: number;
  name: string;
  description?: string;
  currency: Currency;
}

export interface CreateTagDto {
  accountId: number;
  name: string;
}

export interface CreateSubscriptionDto {
  accountId: number;
  name: string;
  monthlyPayment: number;
  currency: Currency;
  description?: string;
  approximatelyPaymentDay: number;
  tags: number[];
  isCancelled: boolean;
}

export interface CreatePBIDto {
  accountId: number;
  name: string;
  monthlyPayment: number;
  currency: Currency;
  isFullyPaid: boolean;
  description?: string;
  approximatelyPaymentDay: number;
  numberOfPayments: number;
  numberOfDownpayments?: number;
  tags?: number[];
}

export interface CreateOTPDto {
  accountId: number;
  amount: number;
  currency: Currency;
  name: string;
  description?: string;
  tags?: number[];
}

export interface CreateRCDto {
  accountId: number;
  name: string;
  monthlyPayment: number;
  currency: Currency;
  isPermanentAmount: boolean;
  description?: string;
  approximatelyPaymentDay: number;
  tags?: number[];
  isActive?: boolean;
}

export interface CreateRCTransactionDto {
  rcId: number;
  dateShouldBePaid: string;
  amount: number;
  currency: Currency;
}

export interface CreatePBIPaymentsDto {
  pbiId: number;
  datesShouldBePaid: string[];
}

export interface CreateFOPCustomerDto {
  name: string;
  currency: Currency;
  isCancelled: boolean;
  monthlyPayment: number;
  accountId: number;
  approximatelyPaymentDay: number;

  bankDetails: {
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
    invoice_prefix: string;
    invoice_description?: string;
    director: string;
  };
}

export interface AccountUpdateDto {
  fopFullName?: string;
  directorName?: string;
  iban?: string;
  bankName?: string;
  ipn?: string;
  bankEdrpou?: string;
  mfo?: string;
  address?: string;
  taxSystem?: string;
  phone?: string;
}

export interface CreateInvoiceDto {
  customerId: number;
  month: number;
  year: number;
  day: number;
}

export interface CreateActDto {
  invoiceId: number;
  month: number;
  year: number;
  day: number;
}
