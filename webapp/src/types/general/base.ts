import { IIRP } from '../payments/irp';

import { ICustomer } from './customer';
import { Currency } from './enums';

export type BaseEntityType = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
};

export interface BaseEntityPaymentData extends BaseEntityType {
  monthlyPayment: number;
  currency: Currency;
  approximatelyPaymentDay: number;
}

export interface BasePayment extends BaseEntityType {
  id: number;
  amount: number;
  currency: Currency;
  datePaid: string;
  rateUahToEur: number;
  rateUahToUsd: number;
}

export interface BaseRegularPayment extends BasePayment {
  dateShouldBePaid: string;
  isPaidInCurrentPeriod: boolean;
}

export interface ITransaction {
  id: number;
  amount: number;
  currency: Currency;
  numberOfPayments: number;
  datePaid: string;
  customer: ICustomer;
  irps: IIRP[];
}
