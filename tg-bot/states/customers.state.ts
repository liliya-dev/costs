import { getCustomersByAccount, getFopCustomersByAccount } from '../services/apiService';
import { type IFOPCustomer, type ICustomer, Role } from '../types';

export interface CustomerState {
  role: Role;
  customer?: ICustomer;
  fopCustomer?: IFOPCustomer;
}

export const customerStates: Record<number, CustomerState> = {};

export function setCustomerState(chatId: number, state: CustomerState): void {
  const cleanedState = Object.fromEntries(
    Object.entries(state).filter(([, v]) => v !== undefined),
  ) as CustomerState;

  customerStates[chatId] = cleanedState;
}

export function getCustomerState(chatId: number): CustomerState | undefined {
  return customerStates[chatId];
}

export function clearCustomerState(chatId: number): void {
  delete customerStates[chatId];
}

export async function initializeCustomerStates(): Promise<void> {
  console.log('🔄 Initializing customer states...');
  const accountId = Number(process.env.ACCOUNT_ID ?? 1);

  const [customers, fopCustomers] = await Promise.all([
    getCustomersByAccount(accountId),
    getFopCustomersByAccount(accountId),
  ]);

  for (const customer of customers) {
    if (customer.tgId && customer.isTgSubscribed) {
      setCustomerState(customer.tgId, {
        role: Role.CUSTOMER,
        customer,
      });
    }
  }

  for (const fopCustomer of fopCustomers) {
    if (fopCustomer.tgId && fopCustomer.isTgSubscribed) {
      setCustomerState(fopCustomer.tgId, {
        role: Role.FOP_CUSTOMER,
        fopCustomer,
      });
    }
  }

  console.log(customerStates);
  console.log(`✅ Loaded ${Object.keys(customerStates).length} customers into memory`);
}