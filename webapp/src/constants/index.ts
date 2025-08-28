import { Currency, Status } from '../types';

export enum ExpencesTypes {
  SUBSCRIPTION = 'SUBSCRIPTION',
  PBI = 'PBI',
  OTE = 'OTE',
  RC = 'RC',
}

export const ExpencesTypesColors: Record<ExpencesTypes, string> = {
  [ExpencesTypes.SUBSCRIPTION]: 'rgba(0, 128, 0, 0.6)',
  [ExpencesTypes.PBI]: 'rgba(211, 211, 211, 0.6)',
  [ExpencesTypes.OTE]: 'rgba(255, 255, 224, 0.6)',
  [ExpencesTypes.RC]: 'rgba(64, 82, 214, 0.6)',
};

export const ExpencesTypesTexts: Record<ExpencesTypes, string> = {
  [ExpencesTypes.SUBSCRIPTION]: 'Subscription',
  [ExpencesTypes.PBI]: 'Payments by installments',
  [ExpencesTypes.OTE]: 'One time expences',
  [ExpencesTypes.RC]: 'Regular costs',
};

export const currencySymbols: { [key in Currency]: string } = {
  [Currency.EUR]: '€',
  [Currency.UAH]: '₴',
  [Currency.USD]: '$',
};

export const StatusColors: Record<Status, string> = {
  [Status.PAID_IN_PERIOD]: 'rgba(0, 128, 0, 0.6)',
  [Status.PAID_BEFORE]: 'rgba(211, 211, 211, 0.6)',
  [Status.NOT_PAID]: 'rgba(255, 0, 0, 0.6)',
  [Status.PAID_IN_ADVANCE]: 'rgba(64, 82, 214, 0.6)',
};

export enum SubscriptionsStatusTypes {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export const SubscriptionsStatusColors: Record<SubscriptionsStatusTypes, string> = {
  ACTIVE: 'rgba(0, 128, 0, 0.6)',
  INACTIVE: 'rgba(211, 211, 211, 0.6)',
};

export const StatusTexts: Record<Status, string> = {
  [Status.PAID_IN_PERIOD]: 'Paid in current period',
  [Status.PAID_BEFORE]: 'Paid in previous periods in advance',
  [Status.NOT_PAID]: 'Not paid yet',
  [Status.PAID_IN_ADVANCE]: 'Paid this period, but in advance',
};
