import {
  CreateActDto,
  CreateInvoiceDto,
  IFOPAct,
  IFOPInvoice,
  InvoiceStatus,
  Method,
} from '@/types';

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

export const updateInvoiceStatus = (id: number, status: InvoiceStatus) =>
  apiHelperPublic<IFOPInvoice>({
    url: `invoices/update-status/${id}`,
    method: Method.PUT,
    data: {
      status,
    },
  });

export const createAct = (dto: CreateActDto) =>
  apiHelperPublic<IFOPAct>({
    url: `work-acts/create`,
    method: Method.POST,
    data: dto,
  });
