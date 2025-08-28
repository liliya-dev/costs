import {
  CreateRCDto,
  CreateRCTransactionDto,
  IIRPDates,
  IRC,
  IRCWithTransactions,
  RCTransaction,
} from '@/types';
import { Method } from '@/types/request-action';

import { apiHelperPublic } from './axios';

export const getRCsByAccountId = (accountId: number) =>
  apiHelperPublic<IRC[]>({ url: `/rcs/account/${accountId}` });

export const getRCsById = (id: number) =>
  apiHelperPublic<IRCWithTransactions>({ url: `/rcs/${id}` });

export const createRC = (dto: CreateRCDto) =>
  apiHelperPublic({ url: 'rcs/create', method: Method.POST, data: dto });

export const updateRC = (id: number, dto: Partial<CreateRCDto>) =>
  apiHelperPublic({ url: `rcs/update/${id}`, method: Method.PUT, data: dto });

export const deleteRC = (id: number) =>
  apiHelperPublic({ url: `rcs/delete/${id}`, method: Method.DELETE });

export const getDatesForTheRC = (id: number, startDate: string, endDate: string) =>
  apiHelperPublic<IIRPDates[]>({
    url: `rc-transactions/dates/${id}?startDate=${startDate}&endDate=${endDate}`,
  });

export const createRCTransaction = (dto: CreateRCTransactionDto) =>
  apiHelperPublic({ url: 'rc-transactions/create', method: Method.POST, data: dto });

export const getRCTransactions = (accountId: number, startDate: string, endDate: string) =>
  apiHelperPublic<RCTransaction[]>({
    url: `/rc-transactions/period/${accountId}?startDate=${startDate}&endDate=${endDate}`,
  });
