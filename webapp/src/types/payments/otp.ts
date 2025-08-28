import { BasePayment } from '../general/base';
import { ITag } from '../general/tag';

export interface IOTP extends BasePayment {
  description?: string;
  tags: ITag[];
}
