import { IIRP } from '..';
import { BaseEntityPaymentData, BaseRegularPayment } from './base';

export interface ICustomer extends BaseRegularPayment, BaseEntityPaymentData {
  isCashless: boolean;
  isCancelled: boolean;
}

export interface ICustomerWithPayments extends ICustomer {
  payments: IIRP[]
}
