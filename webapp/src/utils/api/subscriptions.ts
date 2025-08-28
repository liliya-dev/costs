import {
  CreateSubscriptionDto,
  ISubscription,
  ISubscriptionWithTransactions,
  ISubscriptionTransaction,
} from '@/types';
import { Method } from '@/types/request-action';

import { apiHelperPublic } from './axios';

export const getSubscriptionsByAccountId = (accountId: number) =>
  apiHelperPublic<ISubscription[]>({ url: `subscriptions/account/${accountId}` });

export const getSubscriptionById = (id: number) =>
  apiHelperPublic<ISubscriptionWithTransactions>({ url: `subscriptions/${id}` });

export const getSubscriptionsTransactions = (
  accountId: number,
  startDate: string,
  endDate: string,
) =>
  apiHelperPublic<ISubscriptionTransaction[]>({
    url: `/subscriptions-transactions/period/${accountId}?startDate=${startDate}&endDate=${endDate}`,
  });

export const createSubscription = (dto: CreateSubscriptionDto) =>
  apiHelperPublic({ url: 'subscriptions/create', method: Method.POST, data: dto });

export const updateSubscription = (id: number, dto: Partial<CreateSubscriptionDto>) =>
  apiHelperPublic({ url: `subscriptions/update/${id}`, method: Method.PUT, data: dto });

export const deleteSubscription = (id: number) =>
  apiHelperPublic({ url: `subscriptions/delete/${id}`, method: Method.DELETE });
