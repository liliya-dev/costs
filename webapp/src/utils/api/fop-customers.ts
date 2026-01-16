import { CreateFOPCustomerDto, IFOPCustomer } from '@/types';
import { Method } from '@/types/request-action';

import { apiHelperPublic } from './axios';

export const getFopCustomer = (id: number) =>
  apiHelperPublic<IFOPCustomer>({ url: `fop-customers/${id}`, method: Method.GET });

export const getFopCustomersByAccountId = (accountId: number) =>
  apiHelperPublic<IFOPCustomer[]>({
    url: `fop-customers/account/${accountId}`,
    method: Method.GET,
  });

export const createFopCustomer = (dto: CreateFOPCustomerDto) =>
  apiHelperPublic<IFOPCustomer>({ url: `fop-customers/create`, method: Method.POST, data: dto });

export const updateFopCustomer = (id: number, dto: Partial<CreateFOPCustomerDto>) =>
  apiHelperPublic<IFOPCustomer>({
    url: `fop-customers/update/${id}`,
    method: Method.PUT,
    data: dto,
  });

export const deleteFopCustomer = (id: number) =>
  apiHelperPublic<number>({ url: `fop-customers/delete/${id}`, method: Method.DELETE });
