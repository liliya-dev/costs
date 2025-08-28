import { BaseEntityPaymentData, BaseRegularPayment } from '../general/base';
import { Status } from '../general/enums';
import { ITag } from '../general/tag';

export interface IPBITransaction extends BaseRegularPayment {
  pbiId: number;
  pbiName: string;
  pbiTags: ITag[];
  status: Status;
}

export interface IPBI extends BaseEntityPaymentData {
  isFullyPaid: boolean;
  numberOfPayments: number;
  description?: string;
  tags: ITag[];
  transactions: IPBITransaction[];
}
