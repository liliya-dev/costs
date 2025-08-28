import { CreateTransactionDto, ITransaction } from '@/types';
import { Method } from '@/types/request-action';

import { apiHelperPublic } from './axios';

export const getTransaction = (id: number) =>
  apiHelperPublic<ITransaction>({ url: `income-transactions/${id}` });

export const createTransaction = (dto: CreateTransactionDto) =>
  apiHelperPublic<ITransaction>({
    url: 'income-transactions/create',
    method: Method.POST,
    data: dto,
  });

export const updateTransaction = (id: number, dto: CreateTransactionDto) =>
  apiHelperPublic<ITransaction>({
    url: `income-transactions/update/${id}`,
    method: Method.PUT,
    data: dto,
  });

export const deleteTransaction = (id: number) =>
  apiHelperPublic<ITransaction>({ url: `income-transactions/delete/${id}`, method: Method.DELETE });
