import type { CreateOTPDto, CreateTransactionDto, CustomerWithRole, ICustomer, IFOPCustomer, IIRP, IIRPDates, IOTP, ITransaction } from '../types';
export declare const getCustomersByAccount: (accountId: number) => Promise<ICustomer[]>;
export declare const getFopCustomersByAccount: (accountId: number) => Promise<IFOPCustomer[]>;
export declare const getCustomer: (customerId: number) => Promise<ICustomer>;
export declare const getCustomerByTgId: (tgId: number) => Promise<CustomerWithRole>;
export declare const getIRPsByDates: (customerId: number) => Promise<IIRPDates[]>;
export declare const getIRPsForAccount: (accountId: number) => Promise<IIRP[]>;
export declare const createTransaction: (dto: CreateTransactionDto) => Promise<ITransaction>;
export declare const createOtp: (dto: CreateOTPDto) => Promise<IOTP>;
export declare const subscribeCustomer: (id: number) => Promise<ICustomer>;
export declare const subscribeFopCustomer: (id: number) => Promise<IFOPCustomer>;
//# sourceMappingURL=apiService.d.ts.map