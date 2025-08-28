import { CreateCustomerDto, ICustomer, ICustomerWithPayments } from '@/types';
import { Method } from '@/types/request-action';

import { apiHelperPublic } from './axios';

export const getCustomers = (accountId: number) =>
  apiHelperPublic<ICustomer[]>({ url: `customers/account/${accountId}` });

export const getCustomerById = (id: number) =>
  apiHelperPublic<ICustomerWithPayments>({ url: `customers/payments/${id}` });

export const createCustomer = (dto: CreateCustomerDto) =>
  apiHelperPublic<ICustomer>({ url: 'customers/create', method: Method.POST, data: dto });

export const deleteCustomer = (id: number) =>
  apiHelperPublic<ICustomer>({ url: `customers/delete/${id}`, method: Method.DELETE });

export const updateCustomer = (id: number, dto: Partial<CreateCustomerDto>) =>
  apiHelperPublic<ICustomer>({ url: `customers/update/${id}`, method: Method.PUT, data: dto });
