import { IOTI } from '../payments/oti';
import { IOTP } from '../payments/otp';
import { IPBI } from '../payments/pbi';
import { IRC } from '../payments/rc';
import { ISubscription } from '../payments/subscription';

import { BaseEntityType } from './base';
import { ICustomer } from './customer';

export interface IAccount extends BaseEntityType {
  customers: ICustomer[];
  rcs: IRC[];
  subscriptions: ISubscription[];
  pbis: IPBI[];
  otps: IOTP[];
  otis: IOTI[];
}
