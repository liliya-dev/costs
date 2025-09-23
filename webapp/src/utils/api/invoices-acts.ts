import { CreateActDto, CreateInvoiceDto, IFOPAct, IFOPInvoice, Method } from '@/types';

import { apiHelperPublic } from './axios';

export const createInvoice = (dto: CreateInvoiceDto) =>
  apiHelperPublic<IFOPInvoice>({
    url: `invoices/create`,
    method: Method.POST,
    data: dto,
  });

export const deleteInvoice = (id: number) =>
  apiHelperPublic<IFOPInvoice>({
    url: `invoices/delete/${id}`,
    method: Method.DELETE,
  });

export const createAct = (dto: CreateActDto) =>
  apiHelperPublic<IFOPAct>({
    url: `work-acts/create`,
    method: Method.POST,
    data: dto,
  });
