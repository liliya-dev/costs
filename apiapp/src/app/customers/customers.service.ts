import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not } from 'typeorm';

import { AccountsService } from '../accounts/accounts.service';

import {
  CustomerDto,
  CustomerDtoWithPayments,
  CustomerPayment,
} from './customer.dto';
import { CustomerEntity } from './customer.entity';
import { CustomersRepository } from './customers.repository';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(CustomersRepository)
    private readonly customersRepository: CustomersRepository,
    private readonly accountsService: AccountsService,
  ) {}

  async getCustomersWithIdNotInRange(
    excludedIds: number[],
    accountId: number,
  ): Promise<CustomerEntity[]> {
    return this.customersRepository.find({
      where: {
        id: Not(In(excludedIds)),
        account: {
          id: accountId,
        },
      },
    });
  }

  async getOneById(id: number): Promise<CustomerEntity> {
    return this.customersRepository.findOne({ where: { id } });
  }

  async getOneWithPayments(id: number): Promise<CustomerDtoWithPayments> {
    const customer = await this.customersRepository.findOne({
      where: { id },
      relations: {
        account: true,
        transactions: {
          irps: true,
        },
      },
    });
    if (!customer) {
      throw new HttpException(
        'There is no customer with this id',
        HttpStatus.BAD_REQUEST,
      );
    }
    const payments: CustomerPayment[] = customer.transactions
      .map(({ rateUahToEur, rateUahToUsd, currency, datePaid, irps }) =>
        irps.map(({ amount, dateShouldBePaid, id, createdAt, updatedAt }) => ({
          rateUahToEur,
          rateUahToUsd,
          currency,
          datePaid,
          amount,
          dateShouldBePaid,
          id,
          createdAt,
          updatedAt,
        })),
      )
      .flat()
      .sort(
        (a, b) =>
          new Date(a.dateShouldBePaid).getTime() -
          new Date(b.dateShouldBePaid).getTime(),
      );
    const customerWithPayments = {
      ...customer,
      payments,
      accountId: customer.account.id,
    };

    delete customerWithPayments.account;
    delete customerWithPayments.transactions;

    return customerWithPayments;
  }

  async getAllByAccountId(id: number): Promise<CustomerEntity[]> {
    return this.customersRepository.find({
      where: {
        account: {
          id,
        },
      },
    });
  }

  async checkIsExists(query: Partial<CustomerEntity>): Promise<boolean> {
    return this.customersRepository.exists({ where: query });
  }

  async create(createDto: CustomerDto): Promise<CustomerEntity> {
    try {
      const {
        isCashless,
        accountId,
        approximatelyPaymentDay,
        currency,
        name,
        monthlyPayment,
      } = createDto;
      const isCustomerExists = await this.checkIsExists({ name });
      if (isCustomerExists)
        throw new HttpException('Customer with this name already exists', 400);
      const isAccountExists = await this.accountsService.checkIsExists({
        id: accountId,
      });
      if (!isAccountExists)
        throw new HttpException('Account with this id does not exists', 400);

      const createdCustomer = await this.customersRepository.save({
        name,
        currency,
        isCashless,
        approximatelyPaymentDay,
        monthlyPayment,
        isCancelled: false,
        account: {
          id: accountId,
        },
      });
      return createdCustomer;
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async deleteById(id: number): Promise<number> {
    const res = await this.customersRepository.delete(id);
    if (res.affected === 0)
      throw new HttpException(
        'There is no customer with this id',
        HttpStatus.BAD_REQUEST,
      );
    return id;
  }

  async update(
    updateDto: Partial<CustomerDto>,
    id: number,
  ): Promise<CustomerEntity> {
    try {
      const customer = await this.customersRepository.findOne({
        where: { id },
      });
      if (!customer)
        throw new HttpException('Customer with this id does not exists', 400);
      if (updateDto.name && updateDto.name !== customer.name) {
        const isNameExists = await this.checkIsExists({ name: updateDto.name });
        if (isNameExists)
          throw new HttpException(
            'Customer with this name already exists',
            400,
          );
      }
      return this.customersRepository.save({
        ...customer,
        ...updateDto,
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }
}
