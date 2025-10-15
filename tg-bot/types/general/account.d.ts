import type { IOTI } from '../payments/oti';
import type { IOTP } from '../payments/otp';
import type { IPBI } from '../payments/pbi';
import type { IRC } from '../payments/rc';
import type { ISubscription } from '../payments/subscription';
import type { BaseEntityType } from './base';
import type { ICustomer } from './customer';
export interface IAccount extends BaseEntityType {
    customers: ICustomer[];
    rcs: IRC[];
    subscriptions: ISubscription[];
    pbis: IPBI[];
    otps: IOTP[];
    otis: IOTI[];
    name: string;
    fopFullName?: string;
    directorName?: string;
    iban?: string;
    bankName?: string;
    ipn?: string;
    bankEdrpou?: string;
    mfo?: string;
    address?: string;
    taxSystem?: string;
    phone?: string;
}
//# sourceMappingURL=account.d.ts.map