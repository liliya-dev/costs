import { Currency } from '.';

export interface CreateAccountDto {
  name: string;
}

export interface CreateCustomerDto {
  name: string;
  currency: Currency;
  isCashless: boolean;
  monthlyPayment: number;
  approximatelyPaymentDay: number;
  accountId: number;
  isCancelled?: boolean;
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
