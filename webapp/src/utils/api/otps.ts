import { CreateOTPDto, IOTP } from '@/types';
import { Method } from '@/types/request-action';

import { apiHelperPublic } from './axios';

export const getOTPsByAccountId = (accountId: number) =>
  apiHelperPublic<IOTP[]>({ url: `/otps/account/${accountId}` });

export const createOTP = (dto: CreateOTPDto) =>
  apiHelperPublic<IOTP>({ url: 'otps/create', method: Method.POST, data: dto });

export const updateOTP = (id: number, dto: Partial<CreateOTPDto>) =>
  apiHelperPublic<IOTP>({ url: `otps/update/${id}`, method: Method.PUT, data: dto });

export const deleteOTP = (id: number) =>
  apiHelperPublic<IOTP>({ url: `otps/delete/${id}`, method: Method.DELETE });

export const getOTPTransactions = (accountId: number, startDate: string, endDate: string) =>
  apiHelperPublic<IOTP[]>({
    url: `/otps/period/${accountId}?startDate=${startDate}&endDate=${endDate}`,
  });
