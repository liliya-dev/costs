import { IIRP } from '..';

import { BaseEntityPaymentData, BaseRegularPayment } from './base';

export interface ICustomer extends BaseRegularPayment, BaseEntityPaymentData {
  isCancelled: boolean;
  phone?: string;
  tgId?: number;
}

export interface ICustomerWithPayments extends ICustomer {
  payments: IIRP[];
}
