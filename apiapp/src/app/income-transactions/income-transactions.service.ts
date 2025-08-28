import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { getRates } from 'src/common/helpers/get-rates.helper';
import { HttpPrivatBankService } from 'src/common/http/http-privat-bank.service';

import { CustomersService } from '../customers/customers.service';
import { IRPEntity } from '../irp/irp.entity';
import { IRPsService } from '../irp/irps.service';

import { IncomeTransactionEntity } from './income-transaction.entity';
import { IncomeTransactionsCreateDto } from './income-transactions.dto';
import { IncomeTransactionsRepository } from './income-transactions.repository';

@Injectable()
export class IncomeTransactionsService {
  constructor(
    @InjectRepository(IncomeTransactionsRepository)
    private readonly incomeTransactionsRepository: IncomeTransactionsRepository,
    private readonly irpsService: IRPsService,
    private readonly customersService: CustomersService,
    private readonly httpPrivatBankService: HttpPrivatBankService,
  ) {}

  async saveTransaction(
    transactionDto: IncomeTransactionsCreateDto,
  ): Promise<IncomeTransactionEntity> {
    const ratesRes = await this.httpPrivatBankService.get('');
    const rates = getRates(ratesRes.data);
    const transaction = {
      amount: transactionDto.amount,
      rateUahToUsd: rates.rateUahToUsd,
      rateUahToEur: rates.rateUahToEur,
      datePaid: new Date().toISOString(),
      currency: transactionDto.currency,
      numberOfPayments: transactionDto.numberOfPayments || 1,
      customer: {
        id: transactionDto.customerId,
      },
    };
    return this.incomeTransactionsRepository.save(transaction);
  }

  async updateTransaction(
    transaction: IncomeTransactionEntity,
    updateDto: Partial<IncomeTransactionEntity>,
  ): Promise<IncomeTransactionEntity> {
    const updatedTransaction = {
      ...transaction,
      ...updateDto,
    };
    return this.incomeTransactionsRepository.save(updatedTransaction);
  }

  async create(
    createDto: IncomeTransactionsCreateDto,
  ): Promise<IncomeTransactionEntity> {
    try {
      const customer = await this.customersService.getOneById(
        createDto.customerId,
      );
      if (!customer)
        throw new HttpException(
          'There is no customer with this customer id',
          HttpStatus.BAD_REQUEST,
        );
      const numberOfPayments = createDto.numberOfPayments || 1;
      const datePaid = new Date().toISOString();
      const createdTransaction = await this.saveTransaction(createDto);
      const createdPayments: IRPEntity[] = [];
      for (let i = 1; i < numberOfPayments + 1; i++) {
        const dateShouldBePaid = createDto.datesShouldBePaid[i - 1];
        const payment = {
          datePaid,
          amount: createDto.amount / numberOfPayments,
          currency: createDto.currency,
          dateShouldBePaid,
          transaction: createdTransaction,
        };

        const createdPayment = await this.irpsService.create(payment);
        delete createdPayment.transaction;
        createdPayments.push(createdPayment);
      }
      return { ...createdTransaction, irps: createdPayments };
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async deleteById(id: number): Promise<number> {
    const res = await this.incomeTransactionsRepository.delete(id);
    if (res.affected === 0)
      throw new HttpException(
        'There is no transaction with this id',
        HttpStatus.BAD_REQUEST,
      );
    return id;
  }

  async findById(id: number): Promise<IncomeTransactionEntity> {
    return await this.incomeTransactionsRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        irps: true,
      },
    });
  }

  async checkIsExists(
    query: Partial<IncomeTransactionEntity>,
  ): Promise<boolean> {
    return this.incomeTransactionsRepository.exists({ where: query });
  }

  async updateTransactionById(
    id: number,
    {
      amount,
      currency,
      customerId,
      datesShouldBePaid,
      numberOfPayments,
    }: IncomeTransactionsCreateDto,
  ): Promise<IncomeTransactionEntity> {
    try {
      const currentTransaction = await this.findById(id);
      if (!currentTransaction)
        throw new HttpException(
          'IRP transaction with this id does not exists',
          400,
        );
      await this.irpsService.deleteByTransactionId(currentTransaction.id);
      const customer = await this.customersService.getOneById(customerId);
      if (!customer)
        throw new HttpException(
          'There is no customer with this customer id',
          HttpStatus.BAD_REQUEST,
        );

      const createdTransaction = await this.updateTransaction(
        currentTransaction,
        {
          amount,
          numberOfPayments,
          currency,
          customer,
        },
      );

      const createdPayments: IRPEntity[] = [];
      for (let i = 1; i < numberOfPayments + 1; i++) {
        const dateShouldBePaid = datesShouldBePaid[i - 1];
        const payment = {
          datePaid: currentTransaction.datePaid,
          amount: amount / numberOfPayments,
          currency: currency,
          dateShouldBePaid,
          transaction: createdTransaction,
        };

        const createdPayment = await this.irpsService.create(payment);
        delete createdPayment.transaction;
        createdPayments.push(createdPayment);
      }
      return createdTransaction;
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }
}
