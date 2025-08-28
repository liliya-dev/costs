import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';

import { AvailableDatesDto } from 'src/common/dtos/dates-available.dto';
import { PeriodOptionsDto } from 'src/common/dtos/period-options.dto';
import { DateStatus } from 'src/common/enums/status.enum';
import { convertCurrency } from 'src/common/helpers/convert-currency.helper';
import {
  convertRCsPaymentsToPaymentsPerPeriod,
  convertRcToPaymentsPerPeriod,
} from 'src/common/helpers/convert-object-to-payments-per-period.helper';
import { findSpecificDatesInRange } from 'src/common/helpers/find-specific-date-in-range.helper';
import { getRates } from 'src/common/helpers/get-rates.helper';
import { HttpPrivatBankService } from 'src/common/http/http-privat-bank.service';

import { AccountsService } from '../accounts/accounts.service';
import { RCsService } from '../rc/rcs.service';

import {
  CreateRCTransactionDto,
  RCsDoneAndUpcomingDto,
} from './rc-transaction.dto';
import { RCTransactionEntity } from './rc-transaction.entity';
import { RCTransactionsRepository } from './rc-transactions.repository';

@Injectable()
export class RCTransactionsService {
  constructor(
    @InjectRepository(RCTransactionsRepository)
    private readonly rctransactionsRepository: RCTransactionsRepository,
    private readonly rcsService: RCsService,
    private readonly httpPrivatBankService: HttpPrivatBankService,
    private readonly accountsService: AccountsService,
  ) {}

  async create({
    amount,
    currency,
    rcId,
    dateShouldBePaid,
  }: CreateRCTransactionDto): Promise<RCTransactionEntity> {
    try {
      let rc = await this.rcsService.getOne({ id: rcId });
      if (!rc) throw new HttpException('RC with this id does not exists', 400);
      const ratesRes = await this.httpPrivatBankService.get('');
      const { rateUahToEur, rateUahToUsd } = getRates(ratesRes.data);

      if (!rc.isPermanentAmount) {
        let updatedAmount = amount;
        if (currency !== rc.currency) {
          updatedAmount = convertCurrency({
            amount,
            rateUahToEur,
            rateUahToUsd,
            paymentCurrency: currency,
            baseCurrency: rc.currency,
          });
        }
        rc = await this.rcsService.update(
          { monthlyPayment: updatedAmount },
          rcId,
        );
      }
      return await this.rctransactionsRepository.save({
        amount,
        currency,
        rateUahToEur,
        rateUahToUsd,
        datePaid: new Date().toISOString(),
        dateShouldBePaid,
        rc,
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async getInPeriod(
    dto: PeriodOptionsDto,
    id: number,
  ): Promise<RCsDoneAndUpcomingDto[]> {
    try {
      const isAccountExists = await this.accountsService.checkIsExists({ id });
      if (!isAccountExists)
        throw new HttpException('Account with this id does not exists', 400);
      const doneRcsPayments = await this.rctransactionsRepository.find({
        relations: ['rc', 'rc.tags'],
        where: [
          {
            datePaid: Between(dto.startDate, dto.endDate),
            rc: {
              account: {
                id,
              },
            },
          },
          {
            dateShouldBePaid: Between(dto.startDate, dto.endDate),
            rc: {
              account: {
                id,
              },
            },
          },
        ],
      });
      const ratesRes = await this.httpPrivatBankService.get('');
      const rates = getRates(ratesRes.data);
      const rcs = await this.rcsService.getMany({
        account: {
          id,
        },
      });
      const paymentsForThePeriodDone: RCsDoneAndUpcomingDto[] =
        doneRcsPayments.map((item) =>
          convertRCsPaymentsToPaymentsPerPeriod(
            item,
            dto.startDate,
            dto.endDate,
          ),
        );
      const paymentsForThePeriodShouldBeDone: RCsDoneAndUpcomingDto[] = rcs
        .map((rc) => {
          const excludedDatesWherePaymentsAlreadyDone: string[] =
            doneRcsPayments
              .filter((payment) => payment.rc.id === rc.id)
              .map((payment) => payment.dateShouldBePaid);
          const datesOfPaymentsInRange = findSpecificDatesInRange(
            dto.startDate,
            dto.endDate,
            rc.approximatelyPaymentDay,
            excludedDatesWherePaymentsAlreadyDone,
            rc.createdAt,
          );
          return datesOfPaymentsInRange.map((paymentDate) =>
            convertRcToPaymentsPerPeriod(rc, rates, paymentDate),
          );
        })
        .flat();
      return [...paymentsForThePeriodDone, ...paymentsForThePeriodShouldBeDone];
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async getPaymentDatesAvailableForThePeriod(
    id: number,
    dto: PeriodOptionsDto,
  ): Promise<AvailableDatesDto[]> {
    const rc = await this.rcsService.getOne({ id });
    const donePayments = await this.rctransactionsRepository.find({
      where: {
        dateShouldBePaid: Between(dto.startDate, dto.endDate),
        rc: { id },
      },
    });
    const excludedDatesWherePaymentsAlreadyDone: string[] = donePayments.map(
      (payment) => payment.dateShouldBePaid,
    );
    const datesNotPaidInRange = findSpecificDatesInRange(
      dto.startDate,
      dto.endDate,
      rc.approximatelyPaymentDay,
      excludedDatesWherePaymentsAlreadyDone,
      rc.createdAt,
    );
    const allDatesWithTheStatus = excludedDatesWherePaymentsAlreadyDone
      .map((date) => ({
        date,
        status: DateStatus.PAID,
      }))
      .concat(
        datesNotPaidInRange.map((date) => ({
          date,
          status: DateStatus.NOT_PAID,
        })),
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return allDatesWithTheStatus;
  }
}
