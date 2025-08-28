import { BaseEntityPaymentData, BaseRegularPayment } from '../general/base';
import { ITag } from '../general/tag';

export interface ISubscription extends BaseEntityPaymentData {
  isCancelled: boolean;
  description?: string;
  tags: ITag[];
}

export interface ISubscriptionTransaction extends BaseRegularPayment {
  subscriptionId: number;
  subscriptionName: string;
  subscriptionTags: ITag[];
}

export interface ISubscriptionWithTransactions extends ISubscription {
  transactions: ISubscriptionTransaction[];
}
