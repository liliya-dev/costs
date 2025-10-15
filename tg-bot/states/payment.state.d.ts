import { Currency } from '../types';
export declare const selectedDatesMap: Record<string, string[]>;
export interface PaymentState {
    step: 'currency' | 'amount';
    customerId: string;
    dates: string[];
    currency?: Currency;
}
export declare const paymentStates: Record<number, PaymentState>;
//# sourceMappingURL=payment.state.d.ts.map