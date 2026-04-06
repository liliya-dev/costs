import type {
  CreateOTPDto,
  CreateTransactionDto,
  CustomerWithRole,
  ICustomer,
  IFOPCustomer,
  IIRP,
  IIRPDates,
  IOTP,
  ITransaction,
} from '../types';
import { apiHelperPublic, Method } from './apiHelper';
import { safeApiCall } from './safeApiCall';

export const getCustomersByAccount = (accountId: number): Promise<ICustomer[]> =>
  safeApiCall(
    () =>
      apiHelperPublic({
        url: `customers/account/${accountId}`,
        method: Method.GET,
      }),
    'Failed to fetch customers',
  );

export const getFopCustomersByAccount = (accountId: number): Promise<IFOPCustomer[]> =>
  safeApiCall(
    () =>
      apiHelperPublic({
        url: `fop-customers/account/${accountId}`,
        method: Method.GET,
      }),
    'Failed to fetch fop customers',
  );

export const getCustomer = (customerId: number): Promise<ICustomer> =>
  safeApiCall(
    () =>
      apiHelperPublic({
        url: `customers/${customerId}`,
        method: Method.GET,
      }),
    'Failed to fetch the customer',
  );

export const getCustomerByTgId = (tgId: string): Promise<CustomerWithRole> =>
  safeApiCall(
    () =>
      apiHelperPublic({
        url: `tg/customer/${tgId}`,
        method: Method.GET,
      }),
    'Failed to fetch the customer',
  );

export const getIRPsByDates = (customerId: number): Promise<IIRPDates[]> => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 3);
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 9);

  return safeApiCall(
    () =>
      apiHelperPublic({
        url: `irp/dates/${customerId}?endDate=${endDate.toISOString()}&startDate=${startDate.toISOString()}`,
        method: Method.GET,
      }),
    'Failed to fetch IRPs',
  );
};

export const getIRPsForAccount = (accountId: number): Promise<IIRP[]> => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 3);
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 9);

  return safeApiCall(
    () =>
      apiHelperPublic({
        url: `irp/period/${accountId}?endDate=${endDate.toISOString()}&startDate=${startDate.toISOString()}`,
        method: Method.GET,
      }),
    'Failed to fetch IRPs',
  );
};

export const createTransaction = (dto: CreateTransactionDto): Promise<ITransaction> =>
  safeApiCall(
    () =>
      apiHelperPublic({
        url: 'income-transactions/create',
        method: Method.POST,
        data: dto,
      }),
    'Failed to create transaction',
  );

export const createOtp = (dto: CreateOTPDto): Promise<IOTP> =>
  safeApiCall(
    () =>
      apiHelperPublic({
        url: 'otps/create',
        method: Method.POST,
        data: dto,
      }),
    'Failed to create OTP',
  );

export const subscribeCustomer = (id: number): Promise<ICustomer> =>
  safeApiCall(
    () =>
      apiHelperPublic({
        url: `customers/update/${id}`,
        method: Method.PUT,
        data: {
          isTgSubscribed: true,
        },
      }),
    'Failed to subscribe customer',
  );

export const subscribeFopCustomer = (id: number): Promise<IFOPCustomer> =>
  safeApiCall(
    () =>
      apiHelperPublic({
        url: `fop-customers/update/${id}`,
        method: Method.PUT,
        data: {
          isTgSubscribed: true,
        },
      }),
    'Failed to subscribe fop customer',
  );
