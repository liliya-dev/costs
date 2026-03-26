import { Currency } from '../types';

export interface OtpState {
  step: 'amount' | 'currency' | 'name' | 'description' | 'done';
  accountId: number;
  amount?: number;
  currency?: Currency;
  name?: string;
  description?: string;
}

export const otpStates: Record<number, OtpState> = {};
