import { IIRP, IIRPDates } from '@/types';

import { apiHelperPublic } from './axios';

export const getIrps = (id: number, startDate: string, endDate: string) =>
  apiHelperPublic<IIRP[]>({ url: `irp/period/${id}?endDate=${endDate}&startDate=${startDate}` });

export const getDatesForTheIrp = (id: number, startDate: string, endDate: string) =>
  apiHelperPublic<IIRPDates[]>({
    url: `irp/dates/${id}?endDate=${endDate}&startDate=${startDate}`,
  });
