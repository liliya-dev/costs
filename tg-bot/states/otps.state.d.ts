import { Currency } from '../types';
export interface OtpState {
    step: 'amount' | 'currency' | 'name' | 'description' | 'done';
    accountId: number;
    amount?: number;
    currency?: Currency;
    name?: string;
    description?: string;
}
export declare const otpStates: Record<number, OtpState>;
//# sourceMappingURL=otps.state.d.ts.map