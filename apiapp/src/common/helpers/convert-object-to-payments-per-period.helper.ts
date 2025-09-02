import { CustomerEntity } from 'src/app/customers/customer.entity';
import { IRPEntity } from 'src/app/irp/irp.entity';
import { IRPsDoneAndUpcomingDto } from 'src/app/irp/irps.dto';
import { PBIEntity } from 'src/app/pbi/pbi.entity';
import { PBIsDoneAndUpcomingDto } from 'src/app/pbi-transactions/pbi-transaction.dto';
import { PBITransactionEntity } from 'src/app/pbi-transactions/pbi-transaction.entity';
import { RCEntity } from 'src/app/rc/rc.entity';
import { RCsDoneAndUpcomingDto } from 'src/app/rc-transactions/rc-transaction.dto';
import { RCTransactionEntity } from 'src/app/rc-transactions/rc-transaction.entity';
import { SubscriptionsDoneAndUpcomingDto } from 'src/app/subscription-transactions/subscription-transaction.dto';
import { SubscriptionTransactionEntity } from 'src/app/subscription-transactions/subscription-transaction.entity';
import { SubscriptionEntity } from 'src/app/subscriptions/subscription.entity';

import { Status } from '../enums/status.enum';

import { checkIsDateInRange } from './check-is-date-in-range.helper';
import { getRandomId } from './get-random-id.helper';
import { IConvertedRates } from './get-rates.helper';

export const convertPaymentsToPaymentsPerPeriod = (
  item: IRPEntity,
  startDate: string,
  endDate: string,
): IRPsDoneAndUpcomingDto => ({
  id: item.id,
  amount: item.amount,
  currency: item.currency,
  dateShouldBePaid: item.dateShouldBePaid,
  datePaid: item.datePaid,
  rateUahToEur: item.transaction.rateUahToEur,
  rateUahToUsd: item.transaction.rateUahToUsd,
  customerId: item.transaction.customer.id,
  customerName: item.transaction.customer.name,
  isPaidInCurrentPeriod: checkIsDateInRange(startDate, endDate, item.datePaid),
  transactionId: item.transaction.id,
  status:
    checkIsDateInRange(startDate, endDate, item.datePaid) &&
    checkIsDateInRange(startDate, endDate, item.dateShouldBePaid)
      ? Status.PAID_IN_PERIOD
      : checkIsDateInRange(startDate, endDate, item.dateShouldBePaid) &&
          !checkIsDateInRange(startDate, endDate, item.datePaid)
        ? Status.PAID_BEFORE
        : Status.PAID_IN_ADVANCE,
});

export const convertSubscriptionsPaymentsToPaymentsPerPeriod = (
  item: SubscriptionTransactionEntity,
  startDate: string,
  endDate: string,
): SubscriptionsDoneAndUpcomingDto => ({
  id: item.id,
  amount: item.amount,
  currency: item.currency,
  datePaid: item.datePaid,
  dateShouldBePaid: item.datePaid,
  rateUahToEur: item.rateUahToEur,
  rateUahToUsd: item.rateUahToUsd,
  subscriptionId: item.subscription.id,
  subscriptionName: item.subscription.name,
  isPaidInCurrentPeriod: checkIsDateInRange(startDate, endDate, item.datePaid),
  subscriptionTags: item.subscription.tags,
});

export const convertRCsPaymentsToPaymentsPerPeriod = (
  item: RCTransactionEntity,
  startDate: string,
  endDate: string,
): RCsDoneAndUpcomingDto => ({
  id: item.id,
  amount: item.amount,
  currency: item.currency,
  datePaid: item.datePaid,
  dateShouldBePaid: item.dateShouldBePaid,
  rateUahToEur: item.rateUahToEur,
  rateUahToUsd: item.rateUahToUsd,
  rcId: item.rc.id,
  rcName: item.rc.name,
  rcTags: item.rc.tags,
  isPaidInCurrentPeriod: checkIsDateInRange(startDate, endDate, item.datePaid),
  status:
    checkIsDateInRange(startDate, endDate, item.datePaid) &&
    checkIsDateInRange(startDate, endDate, item.dateShouldBePaid)
      ? Status.PAID_IN_PERIOD
      : checkIsDateInRange(startDate, endDate, item.dateShouldBePaid) &&
          !checkIsDateInRange(startDate, endDate, item.datePaid)
        ? Status.PAID_BEFORE
        : Status.PAID_IN_ADVANCE,
});

export const convertPBIsPaymentsToPaymentsPerPeriod = (
  item: PBITransactionEntity,
  startDate: string,
  endDate: string,
): PBIsDoneAndUpcomingDto => ({
  id: item.id,
  amount: item.amount,
  currency: item.currency,
  datePaid: item.datePaid,
  dateShouldBePaid: item.dateShouldBePaid,
  rateUahToEur: item.rateUahToEur,
  rateUahToUsd: item.rateUahToUsd,
  pbiId: item.pbi.id,
  pbiName: item.pbi.name,
  isPaidInCurrentPeriod: checkIsDateInRange(startDate, endDate, item.datePaid),
  status:
    checkIsDateInRange(startDate, endDate, item.datePaid) &&
    checkIsDateInRange(startDate, endDate, item.dateShouldBePaid)
      ? Status.PAID_IN_PERIOD
      : checkIsDateInRange(startDate, endDate, item.dateShouldBePaid) &&
          !checkIsDateInRange(startDate, endDate, item.datePaid)
        ? Status.PAID_BEFORE
        : Status.PAID_IN_ADVANCE,
});

export const convertPBIToPaymentsPerPeriod = (
  pbi: PBIEntity,
  rates: IConvertedRates,
  paymentDate: string,
): PBIsDoneAndUpcomingDto => ({
  id: getRandomId(9),
  amount: pbi.monthlyPayment,
  currency: pbi.currency,
  dateShouldBePaid: paymentDate,
  rateUahToEur: rates.rateUahToEur,
  rateUahToUsd: rates.rateUahToUsd,
  pbiId: pbi.id,
  pbiName: pbi.name,
  isPaidInCurrentPeriod: false,
  status: Status.NOT_PAID,
});

export const convertRcToPaymentsPerPeriod = (
  rc: RCEntity,
  rates: IConvertedRates,
  paymentDate: string,
): RCsDoneAndUpcomingDto => ({
  id: getRandomId(9),
  amount: rc.monthlyPayment,
  currency: rc.currency,
  dateShouldBePaid: paymentDate,
  rateUahToEur: rates.rateUahToEur,
  rateUahToUsd: rates.rateUahToUsd,
  rcId: rc.id,
  rcName: rc.name,
  isPaidInCurrentPeriod: false,
  status: Status.NOT_PAID,
  rcTags: rc.tags,
});

export const convertSubscriptionToPaymentsPerPeriod = (
  subscription: SubscriptionEntity,
  rates: IConvertedRates,
  paymentDate: string,
): SubscriptionsDoneAndUpcomingDto => ({
  id: getRandomId(9),
  amount: subscription.monthlyPayment,
  currency: subscription.currency,
  dateShouldBePaid: paymentDate,
  rateUahToEur: rates.rateUahToEur,
  rateUahToUsd: rates.rateUahToUsd,
  subscriptionId: subscription.id,
  subscriptionName: subscription.name,
  isPaidInCurrentPeriod: false,
  subscriptionTags: subscription.tags,
});

export const convertCustomerToPaymentsPerPeriod = (
  customer: CustomerEntity,
  rates: IConvertedRates,
  paymentDate: string,
): IRPsDoneAndUpcomingDto => ({
  id: getRandomId(9),
  amount: customer.monthlyPayment,
  currency: customer.currency,
  dateShouldBePaid: paymentDate,
  rateUahToEur: rates.rateUahToEur,
  rateUahToUsd: rates.rateUahToUsd,
  customerId: customer.id,
  customerName: customer.name,
  isPaidInCurrentPeriod: false,
  status: Status.NOT_PAID,
});
