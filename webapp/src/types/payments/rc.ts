import { BaseEntityPaymentData, BaseRegularPayment } from '../general/base';
import { Status } from '../general/enums';
import { ITag } from '../general/tag';

export interface IRC extends BaseEntityPaymentData {
  isPermanentAmount: boolean;
  isActive?: boolean;
  description?: string;
  tags: ITag[];
}

export interface RCTransaction extends BaseRegularPayment {
  rcId: number;
  rcName: string;
  rcTags: ITag[];
  status: Status;
}

export interface IRCWithTransactions extends IRC {
  transactions: RCTransaction[];
}
