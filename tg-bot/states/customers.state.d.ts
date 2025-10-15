import { type IFOPCustomer, type ICustomer, Role } from '../types';
export interface CustomerState {
    role: Role;
    customer?: ICustomer;
    fopCustomer?: IFOPCustomer;
}
export declare const customerStates: Record<number, CustomerState>;
export declare function setCustomerState(chatId: number, state: CustomerState): void;
export declare function getCustomerState(chatId: number): CustomerState | undefined;
export declare function clearCustomerState(chatId: number): void;
export declare function initializeCustomerStates(): Promise<void>;
//# sourceMappingURL=customers.state.d.ts.map