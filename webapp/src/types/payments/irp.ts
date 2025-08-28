import { BaseRegularPayment } from '../general/base';
import { Status, DateStatus } from '../general/enums';

export interface IIRP extends BaseRegularPayment {
  customerName: string;
  customerId: number;
  status: Status;
  transactionId?: number;
}

export interface IIRPDates {
  date: string;
  status: DateStatus;
}
