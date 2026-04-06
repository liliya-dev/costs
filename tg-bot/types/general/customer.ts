import type { IFOPCustomer, IIRP, Role } from '..';

import type { BaseEntityPaymentData, BaseRegularPayment } from './base';

export interface ICustomer extends BaseRegularPayment, BaseEntityPaymentData {
  isCancelled: boolean;
  phone?: string;
  tgId?: string;
  isTgSubscribed: boolean;
}

export interface ICustomerWithPayments extends ICustomer {
  payments: IIRP[];
}

export type CustomerWithRole =
  | (ICustomer & { role: Role.CUSTOMER })
  | (IFOPCustomer & { role: Role.FOP_CUSTOMER });
