import { CreatePBIDto, IPBI, IPBITransaction } from '@/types';
import { Method } from '@/types/request-action';

import { apiHelperPublic } from './axios';

export const getPBIsByAccountId = (accountId: number) =>
  apiHelperPublic<IPBI[]>({ url: `/pbis/account/${accountId}` });

export const getPBIById = (id: number) => apiHelperPublic<IPBI>({ url: `/pbis/${id}` });

export const createPBI = (dto: CreatePBIDto) =>
  apiHelperPublic({ url: 'pbis/create', method: Method.POST, data: dto });

export const updatePBI = (id: number, dto: Partial<CreatePBIDto>) =>
  apiHelperPublic({ url: `pbis/update/${id}`, method: Method.PUT, data: dto });

export const deletePBI = (id: number) =>
  apiHelperPublic({ url: `pbis/delete/${id}`, method: Method.DELETE });

export const payPBI = (id: number) =>
  apiHelperPublic<IPBI>({ url: `pbi-transactions/pay-off/${id}`, method: Method.POST });

export const getPBITransactions = (accountId: number, startDate: string, endDate: string) =>
  apiHelperPublic<IPBITransaction[]>({
    url: `/pbi-transactions/period/${accountId}?startDate=${startDate}&endDate=${endDate}`,
  });
