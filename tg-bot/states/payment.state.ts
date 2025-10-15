import { Currency } from '../types';

export const selectedDatesMap: Record<string, string[]> = {};

export interface PaymentState {
  step: 'currency' | 'amount';
  customerId: string;
  dates: string[];
  currency?: Currency;
}

export const paymentStates: Record<number, PaymentState> = {};
