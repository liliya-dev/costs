import { CreateAccountDto, IAccount } from '@/types';
import { Method } from '@/types/request-action';

import { apiHelperPublic } from './axios';

export const getAccounts = () => apiHelperPublic<IAccount[]>({ url: 'accounts' });

export const getAccount = (id: number) => apiHelperPublic<IAccount>({ url: `accounts/${id}` });

export const createAccount = (dto: CreateAccountDto) =>
  apiHelperPublic<IAccount>({ url: 'accounts/create', method: Method.POST, data: dto });

export const deleteAccount = (id: number) =>
  apiHelperPublic<{ id: number }>({ url: `accounts/${id}`, method: Method.DELETE });
