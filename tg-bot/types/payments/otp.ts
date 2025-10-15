import type { BasePayment } from '../general/base';
import type { ITag } from '../general/tag';

export interface IOTP extends BasePayment {
  description?: string;
  tags: ITag[];
}
