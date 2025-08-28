import { CreateOTIDto, UpdateOTIDto, IOTI, ITransaction } from '@/types';
import { Method } from '@/types/request-action';

import { apiHelperPublic } from './axios';

export const getOtis = (id: number, startDate: string, endDate: string) =>
  apiHelperPublic<IOTI[]>({ url: `otis/period/${id}?endDate=${endDate}&startDate=${startDate}` });

export const createOTI = (dto: CreateOTIDto) =>
  apiHelperPublic<ITransaction>({ url: 'otis/create', method: Method.POST, data: dto });

export const updateOti = (id: number, dto: UpdateOTIDto) =>
  apiHelperPublic<ITransaction>({ url: `otis/update/${id}`, method: Method.PUT, data: dto });

export const deleteOti = (id: number) =>
  apiHelperPublic<IOTI>({ url: `otis/delete/${id}`, method: Method.DELETE });
