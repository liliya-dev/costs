import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';

import { AvailableDatesDto } from 'src/common/dtos/dates-available.dto';
import { PeriodOptionsDto } from 'src/common/dtos/period-options.dto';
import { DateStatus } from 'src/common/enums/status.enum';
import {
  convertCustomerToPaymentsPerPeriod,
  convertPaymentsToPaymentsPerPeriod,
} from 'src/common/helpers/convert-object-to-payments-per-period.helper';
import { findSpecificDatesInRange } from 'src/common/helpers/find-specific-date-in-range.helper';
import { getRates } from 'src/common/helpers/get-rates.helper';
import { HttpPrivatBankService } from 'src/common/http/http-privat-bank.service';

import { CustomersService } from '../customers/customers.service';

import { IRPEntity } from './irp.entity';
import { IRPsDoneAndUpcomingDto, IRPCreateDto } from './irps.dto';
import { IRPsRepository } from './irps.repository';

@Injectable()
export class IRPsService {
  constructor(
    @InjectRepository(IRPsRepository)
    private readonly irpsRepository: IRPsRepository,
    private readonly customersService: CustomersService,
    private readonly httpPrivatBankService: HttpPrivatBankService,
  ) {}

  async getPaymentDatesAvailableForThePeriod(
    id: number,
    dto: PeriodOptionsDto,
  ): Promise<AvailableDatesDto[]> {
    const customer = await this.customersService.getOneById(id);
    const donePayments = await this.irpsRepository.find({
      where: {
        dateShouldBePaid: Between(dto.startDate, dto.endDate),
        transaction: {
          customer: {
            id,
          },
        },
      },
    });
    const excludedDatesWherePaymentsAlreadyDone: string[] = donePayments.map(
      (payment) => payment.dateShouldBePaid,
    );
    const datesNotPaidInRange = findSpecificDatesInRange(
      dto.startDate,
      dto.endDate,
      customer.approximatelyPaymentDay,
      excludedDatesWherePaymentsAlreadyDone,
      customer.createdAt,
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

  async getIRPsInPeriod(
    dto: PeriodOptionsDto,
    id: number,
  ): Promise<IRPsDoneAndUpcomingDto[]> {
    // check if account exists
    const donePayments = await this.irpsRepository.find({
      relations: ['transaction', 'transaction.customer'],
      where: [
        {
          dateShouldBePaid: Between(dto.startDate, dto.endDate),
          transaction: {
            customer: {
              account: {
                id,
              },
            },
          },
        },
        {
          datePaid: Between(dto.startDate, dto.endDate),
          transaction: {
            customer: {
              account: {
                id,
              },
            },
          },
        },
      ],
    });
    const customersIdsWithDonePayments: number[] = donePayments.map(
      (item) => item.transaction.customer.id,
    );
    const customersWithDonePayments = Array.from(
      new Map(
        donePayments
          .map((item) => item.transaction.customer)
          .map((customer) => [customer.id, customer]),
      ).values(),
    );

    const customersWithoutPaymentsInPeriod =
      await this.customersService.getCustomersWithIdNotInRange(
        customersIdsWithDonePayments,
        id,
      );

    const paymentsForThePeriodDone: IRPsDoneAndUpcomingDto[] = donePayments.map(
      (item) =>
        convertPaymentsToPaymentsPerPeriod(item, dto.startDate, dto.endDate),
    );
    const ratesRes = await this.httpPrivatBankService.get('');
    const rates = getRates(ratesRes.data);
    const paymentsForThePeriodShouldBeDone: IRPsDoneAndUpcomingDto[] = [
      ...customersWithoutPaymentsInPeriod,
      ...customersWithDonePayments,
    ]
      .map((customer) => {
        const excludedDatesWherePaymentsAlreadyDone: string[] = donePayments
          .filter((payment) => payment.transaction.customer.id === customer.id)
          .map((payment) => payment.dateShouldBePaid);
        const datesOfPaymentsInRange = findSpecificDatesInRange(
          dto.startDate,
          dto.endDate,
          customer.approximatelyPaymentDay,
          excludedDatesWherePaymentsAlreadyDone,
          customer.createdAt,
        );

        return datesOfPaymentsInRange.map((paymentDate) =>
          convertCustomerToPaymentsPerPeriod(customer, rates, paymentDate),
        );
      })
      .flat();

    return [...paymentsForThePeriodDone, ...paymentsForThePeriodShouldBeDone];
  }

  async getOneById(id: number): Promise<IRPEntity> {
    return this.irpsRepository.findOne({
      where: { id },
      relations: {
        transaction: true,
      },
    });
  }

  async getLastByCustomerId(id: number): Promise<IRPEntity> {
    return this.irpsRepository.findOne({
      relations: {
        transaction: {
          customer: true,
        },
      },
      where: {
        transaction: {
          customer: {
            id,
          },
        },
      },
      order: { dateShouldBePaid: 'DESC' },
    });
  }

  async create(createDto: IRPCreateDto): Promise<IRPEntity> {
    try {
      return await this.irpsRepository.save(createDto);
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async deleteByTransactionId(id: number): Promise<any> {
    return this.irpsRepository.delete({ transaction: { id } });
  }
}
