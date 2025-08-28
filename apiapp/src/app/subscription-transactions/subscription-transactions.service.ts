import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';

import { PeriodOptionsDto } from 'src/common/dtos/period-options.dto';
import {
  convertSubscriptionsPaymentsToPaymentsPerPeriod,
  convertSubscriptionToPaymentsPerPeriod,
} from 'src/common/helpers/convert-object-to-payments-per-period.helper';
import { findSpecificDatesInRange } from 'src/common/helpers/find-specific-date-in-range.helper';
import { getRates } from 'src/common/helpers/get-rates.helper';
import { HttpPrivatBankService } from 'src/common/http/http-privat-bank.service';

import { AccountsService } from '../accounts/accounts.service';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';

import {
  CreateSubscriptionTransactionDto,
  SubscriptionsDoneAndUpcomingDto,
} from './subscription-transaction.dto';
import { SubscriptionTransactionEntity } from './subscription-transaction.entity';
import { SubscriptionTransactionsRepository } from './subscription-transactions.repository';

@Injectable()
export class SubscriptionTransactionsService {
  constructor(
    @InjectRepository(SubscriptionTransactionsRepository)
    private readonly subscriptionTransactionsRepository: SubscriptionTransactionsRepository,
    private readonly httpPrivatBankService: HttpPrivatBankService,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly accountsService: AccountsService,
  ) {}

  async create(
    createDto: CreateSubscriptionTransactionDto,
  ): Promise<SubscriptionTransactionEntity> {
    try {
      const subscription = await this.subscriptionsService.getOne({
        id: createDto.subscriptionId,
      });
      if (!subscription)
        throw new HttpException(
          'Subscription with this id does not exists',
          400,
        );
      const ratesRes = await this.httpPrivatBankService.get('');
      const rates = getRates(ratesRes.data);
      return await this.subscriptionTransactionsRepository.save({
        amount: createDto.amount,
        currency: createDto.currency,
        rateUahToEur: rates.rateUahToEur,
        rateUahToUsd: rates.rateUahToUsd,
        datePaid: new Date().toISOString(),
        subscription,
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async getInPeriod(
    dto: PeriodOptionsDto,
    id: number,
  ): Promise<SubscriptionsDoneAndUpcomingDto[]> {
    try {
      const isAccountExists = await this.accountsService.checkIsExists({ id });
      if (!isAccountExists)
        throw new HttpException('Account with this id does not exists', 400);
      const doneSubscriptionsPayments =
        await this.subscriptionTransactionsRepository.find({
          relations: ['subscription', 'subscription.tags'],
          where: {
            datePaid: Between(dto.startDate, dto.endDate),
            subscription: {
              account: {
                id,
              },
            },
          },
        });
      const ratesRes = await this.httpPrivatBankService.get('');
      const rates = getRates(ratesRes.data);
      const subscriptions = await this.subscriptionsService.getMany({
        account: {
          id,
        },
      });
      const paymentsForThePeriodDone: SubscriptionsDoneAndUpcomingDto[] =
        doneSubscriptionsPayments.map((item) =>
          convertSubscriptionsPaymentsToPaymentsPerPeriod(
            item,
            dto.startDate,
            dto.endDate,
          ),
        );
      const paymentsForThePeriodShouldBeDone: SubscriptionsDoneAndUpcomingDto[] =
        subscriptions
          .map((subscription) => {
            const excludedDatesWherePaymentsAlreadyDone: string[] =
              doneSubscriptionsPayments
                .filter(
                  (payment) => payment.subscription.id === subscription.id,
                )
                .map((payment) => payment.datePaid);
            const datesOfPaymentsInRange = findSpecificDatesInRange(
              dto.startDate,
              dto.endDate,
              subscription.approximatelyPaymentDay,
              excludedDatesWherePaymentsAlreadyDone,
              subscription.createdAt,
            );
            return datesOfPaymentsInRange.map((paymentDate) =>
              convertSubscriptionToPaymentsPerPeriod(
                subscription,
                rates,
                paymentDate,
              ),
            );
          })
          .flat();

      return [...paymentsForThePeriodDone, ...paymentsForThePeriodShouldBeDone];
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }
}
