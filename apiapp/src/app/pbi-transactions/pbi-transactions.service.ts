import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';

import { AvailableDatesDto } from 'src/common/dtos/dates-available.dto';
import { PeriodOptionsDto } from 'src/common/dtos/period-options.dto';
import { DateStatus } from 'src/common/enums/status.enum';
import {
  convertPBIsPaymentsToPaymentsPerPeriod,
  convertPBIToPaymentsPerPeriod,
} from 'src/common/helpers/convert-object-to-payments-per-period.helper';
import { findSpecificDatesInRange } from 'src/common/helpers/find-specific-date-in-range.helper';
import { getRates } from 'src/common/helpers/get-rates.helper';
import { HttpPrivatBankService } from 'src/common/http/http-privat-bank.service';

import { AccountsService } from '../accounts/accounts.service';
import { PBIEntity } from '../pbi/pbi.entity';
import { PBIsService } from '../pbi/pbis.service';

import {
  CreatePBITransactionDto,
  PBIsDoneAndUpcomingDto,
} from './pbi-transaction.dto';
import { PBITransactionEntity } from './pbi-transaction.entity';
import { PBITransactionsRepository } from './pbi-transactions.repository';

@Injectable()
export class PBITransactionsService {
  constructor(
    @InjectRepository(PBITransactionsRepository)
    private readonly pbitransactionsRepository: PBITransactionsRepository,
    private readonly pbisService: PBIsService,
    private readonly httpPrivatBankService: HttpPrivatBankService,
    private readonly accountsService: AccountsService,
  ) {}

  async payOff(id: number): Promise<PBIEntity> {
    const pbi = await this.pbisService.getOne({ id });
    if (!pbi) throw new HttpException('PBI with this id does not exists', 400);
    const dates = await this.getPaymentDatesAvailableForThePeriod(id);
    const filteredDates = dates.filter(
      (date) => date.status === DateStatus.NOT_PAID,
    );

    for (let i = 0; i < filteredDates.length; i++) {
      await this.create({
        pbiId: id,
        amount: pbi.monthlyPayment,
        currency: pbi.currency,
        dateShouldBePaid: filteredDates[i].date,
      });
    }
    return await this.pbisService.update({ isFullyPaid: true }, id);
  }

  async create(
    createDto: CreatePBITransactionDto,
  ): Promise<PBITransactionEntity> {
    try {
      const pbi = await this.pbisService.getOne({ id: createDto.pbiId });
      if (!pbi)
        throw new HttpException('PBI with this id does not exists', 400);
      const ratesRes = await this.httpPrivatBankService.get('');
      const rates = getRates(ratesRes.data);
      return await this.pbitransactionsRepository.save({
        amount: createDto.amount,
        currency: createDto.currency,
        rateUahToEur: rates.rateUahToEur,
        rateUahToUsd: rates.rateUahToUsd,
        datePaid: new Date().toISOString(),
        dateShouldBePaid: createDto.dateShouldBePaid,
        pbi,
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async getInPeriod(
    dto: PeriodOptionsDto,
    id: number,
  ): Promise<PBIsDoneAndUpcomingDto[]> {
    try {
      const isAccountExists = await this.accountsService.checkIsExists({ id });
      if (!isAccountExists)
        throw new HttpException('Account with this id does not exists', 400);
      const donePBIPayments = await this.pbitransactionsRepository.find({
        relations: ['pbi', 'pbi.transactions'],
        where: {
          datePaid: Between(dto.startDate, dto.endDate),
          pbi: {
            account: {
              id,
            },
          },
        },
      });
      const ratesRes = await this.httpPrivatBankService.get('');
      const rates = getRates(ratesRes.data);

      const pbisNotFullyPaid = await this.pbisService.getMany({
        isFullyPaid: false,
        account: {
          id,
        },
      });

      const pbisFullyPaid = Array.from(
        new Map(
          donePBIPayments
            .filter((item) => item.pbi.isFullyPaid)
            .map((item) => [item.pbi.id, item.pbi]),
        ).values(),
      );

      const paymentsForThePeriodDone: PBIsDoneAndUpcomingDto[] =
        donePBIPayments.map((item) =>
          convertPBIsPaymentsToPaymentsPerPeriod(
            item,
            dto.startDate,
            dto.endDate,
          ),
        );
      const paymentsForThePeriodShouldBeDone: PBIsDoneAndUpcomingDto[] = [
        ...pbisNotFullyPaid,
        ...pbisFullyPaid,
      ]
        .map((pbi) => {
          const excludedDatesWherePaymentsAlreadyDone: string[] =
            donePBIPayments
              .filter((payment) => payment.pbi.id === pbi.id)
              .map((payment) => payment.datePaid);
          const datesOfPaymentsInRange = findSpecificDatesInRange(
            dto.startDate,
            dto.endDate,
            pbi.approximatelyPaymentDay,
            excludedDatesWherePaymentsAlreadyDone,
            pbi.createdAt,
          );

          const payments = datesOfPaymentsInRange.map((paymentDate) =>
            convertPBIToPaymentsPerPeriod(pbi, rates, paymentDate),
          );
          const numberOfDonePayments = pbi.transactions?.length || 0;
          const totalNumberOfPayments = numberOfDonePayments + payments.length;
          return totalNumberOfPayments <= pbi.numberOfPayments
            ? payments
            : payments.slice(0, pbi.numberOfPayments - numberOfDonePayments);
        })
        .flat();
      return [...paymentsForThePeriodDone, ...paymentsForThePeriodShouldBeDone];
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async getPaymentDatesAvailableForThePeriod(
    id: number,
  ): Promise<AvailableDatesDto[]> {
    const pbi = await this.pbisService.getOne({ id });
    const startDate = new Date(pbi.createdAt).toISOString();
    const end = new Date(startDate);
    end.setMonth(end.getMonth() + pbi.numberOfPayments + 1);
    const endDate = end.toISOString();
    const donePayments = await this.pbitransactionsRepository.find({
      where: {
        dateShouldBePaid: Between(startDate, endDate),
        pbi: { id },
      },
    });
    const excludedDatesWherePaymentsAlreadyDone: string[] = donePayments.map(
      (payment) => payment.dateShouldBePaid,
    );
    const datesNotPaidInRange = findSpecificDatesInRange(
      startDate,
      endDate,
      pbi.approximatelyPaymentDay,
      excludedDatesWherePaymentsAlreadyDone,
      pbi.createdAt,
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
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, pbi.numberOfPayments);
    return allDatesWithTheStatus;
  }
}
