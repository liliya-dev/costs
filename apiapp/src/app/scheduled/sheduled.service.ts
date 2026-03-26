import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { AccountsService } from '../accounts/accounts.service';
import { FOPCustomerEntity } from '../fop-customers/fop-customer.entity';
import { FOPCustomersService } from '../fop-customers/fop-customers.service';
import { InvoicesService } from '../invoices/invoices.service';
import { PBIsService } from '../pbi/pbis.service';
import { PBITransactionsService } from '../pbi-transactions/pbi-transactions.service';
import { SubscriptionTransactionsService } from '../subscription-transactions/subscription-transactions.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { WorkActsService } from '../work-acts/work-acts.service';

@Injectable()
export class SheduledService {
  constructor(
    private readonly subscriptionTransactionsService: SubscriptionTransactionsService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly pbiTransactionsService: PBITransactionsService,
    private readonly invoicesService: InvoicesService,
    private readonly workActsService: WorkActsService,
    private readonly accountsService: AccountsService,
    private readonly fopCustomersService: FOPCustomersService,
    private readonly pbisService: PBIsService,
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  async checkSubscriptions() {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const subscriptions = await this.subscriptionsService.getMany({
      approximatelyPaymentDay: todayDay,
      isCancelled: false,
    });
    for (let i = 0; i < subscriptions.length; i++) {
      const subscription = subscriptions[i];
      const { monthlyPayment, id, currency, transactions } = subscription;
      const isPaymentDoneToday = transactions.some((transaction) => {
        const datePaid = new Date(transaction.datePaid);
        return (
          datePaid.getDate() === todayDay &&
          datePaid.getMonth() + 1 === todayMonth
        );
      });
      if (!isPaymentDoneToday) {
        const createdTransaction =
          await this.subscriptionTransactionsService.create({
            amount: monthlyPayment,
            subscriptionId: id,
            currency,
          });
        console.log(
          `The subscription transaction was created with id ${createdTransaction.id} for transaction ${subscription.id}`,
        );
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkPBIs() {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth() + 1;
    const pbis = await this.pbisService.getMany({
      approximatelyPaymentDay: todayDay,
      isFullyPaid: false,
    });
    for (let i = 0; i < pbis.length; i++) {
      const pbi = pbis[i];
      const { monthlyPayment, id, currency, transactions } = pbi;
      const isPaymentDoneToday = transactions.some((transaction) => {
        const datePaid = new Date(transaction.datePaid);
        return (
          datePaid.getDate() === todayDay &&
          datePaid.getMonth() + 1 === todayMonth
        );
      });
      if (!isPaymentDoneToday) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const createdTransaction = await this.pbiTransactionsService.create({
          amount: monthlyPayment,
          pbiId: id,
          currency,
          dateShouldBePaid: today.toISOString(),
        });
        if (
          transactions.length + 1 ===
          pbi.numberOfPayments - pbi.numberOfDownpayments
        ) {
          await this.pbisService.update({ isFullyPaid: true }, id);
        }
        console.log(
          `The pbi transaction was created with id ${createdTransaction.id} for pbi ${pbi.id}`,
        );
      }
    }
  }

  @Cron('0 0 23 * *')
  async generateInvoicesAndActs() {
    try {
      console.log('Generating acts and invoices was started');
      const date = new Date();
      const accounts = await this.accountsService.getMany();
      let allCustomers: FOPCustomerEntity[] = [];
      for (let i = 0; i < accounts.length; i++) {
        const customers = await this.fopCustomersService.getAllByAccountId(
          accounts[i].id,
        );
        allCustomers = [...allCustomers, ...customers];
      }
      for (let i = 0; i < allCustomers.length; i++) {
        const invoice = await this.invoicesService.createInvoice({
          day: date.getDate(),
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          customerId: allCustomers[i].id,
        });
        if (invoice) {
          const act = await this.workActsService.createAct({
            day: date.getDate(),
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            invoiceId: invoice.id,
          });
          console.log(
            `Invoice and act ${invoice.name}, ${act.name} were created for ${allCustomers[i].name}`,
          );
        }
      }
    } catch (e) {
      console.log(e, 'Error');
    }
  }
}
