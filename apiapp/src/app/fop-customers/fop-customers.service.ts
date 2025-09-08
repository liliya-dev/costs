import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AccountsService } from '../accounts/accounts.service';
import { BankDetailsService } from '../bank-details/bank-details.service';

import { CreateFOPCustomerDto } from './fop-customer.dto';
import { FOPCustomerEntity } from './fop-customer.entity';
import { FOPCustomersRepository } from './fop-customers.repository';

@Injectable()
export class FOPCustomersService {
  constructor(
    @InjectRepository(FOPCustomersRepository)
    private readonly fopCustomersRepository: FOPCustomersRepository,
    private readonly accountsService: AccountsService,
    private readonly bankDetailsService: BankDetailsService,
  ) {}

  async getOneById(id: number): Promise<FOPCustomerEntity> {
    return this.fopCustomersRepository.findOne({ where: { id } });
  }

  async getAllByAccountId(accountId: number): Promise<FOPCustomerEntity[]> {
    return this.fopCustomersRepository.find({
      where: {
        account: { id: accountId },
      },
    });
  }

  async checkIsExists(query: Partial<FOPCustomerEntity>): Promise<boolean> {
    return this.fopCustomersRepository.exists({ where: query });
  }

  async create(createDto: CreateFOPCustomerDto): Promise<FOPCustomerEntity> {
    try {
      const {
        accountId,
        currency,
        name,
        monthlyPayment,
        isCancelled,
        bankDetails,
      } = createDto;

      const isFOPCustomerExists = await this.checkIsExists({ name });
      if (isFOPCustomerExists) {
        throw new HttpException(
          'FOP Customer with this name already exists',
          400,
        );
      }

      const isAccountExists = await this.accountsService.checkIsExists({
        id: accountId,
      });
      if (!isAccountExists) {
        throw new HttpException('Account with this id does not exist', 400);
      }

      let createdBankDetails = undefined;
      if (bankDetails) {
        createdBankDetails = await this.bankDetailsService.create(bankDetails);
      }

      const createdFOPCustomer = await this.fopCustomersRepository.save({
        name,
        currency,
        monthlyPayment,
        isCancelled: isCancelled || false,
        account: { id: accountId },
        bankDetails: createdBankDetails,
      });

      return createdFOPCustomer;
    } catch (err) {
      throw new HttpException(err.message || 'Server error', err.status || 500);
    }
  }

  async update(
    updateDto: Partial<CreateFOPCustomerDto>,
    id: number,
  ): Promise<FOPCustomerEntity> {
    try {
      const fopCustomer = await this.fopCustomersRepository.findOne({
        where: { id },
        relations: ['bankDetails'],
      });

      if (!fopCustomer) {
        throw new HttpException(
          'FOP Customer with this id does not exist',
          400,
        );
      }

      if (updateDto.name && updateDto.name !== fopCustomer.name) {
        const isNameExists = await this.checkIsExists({ name: updateDto.name });
        if (isNameExists) {
          throw new HttpException(
            'FOP Customer with this name already exists',
            400,
          );
        }
      }

      const { bankDetails, ...fopCustomerFields } = updateDto;
      Object.assign(fopCustomer, fopCustomerFields);

      if (bankDetails) {
        if (fopCustomer.bankDetails) {
          fopCustomer.bankDetails = await this.bankDetailsService.update(
            fopCustomer.bankDetails,
            bankDetails,
          );
        } else {
          fopCustomer.bankDetails =
            await this.bankDetailsService.create(bankDetails);
        }
      }

      return await this.fopCustomersRepository.save(fopCustomer);
    } catch (err) {
      throw new HttpException(err.message || 'Server error', err.status || 500);
    }
  }

  async deleteById(id: number): Promise<number> {
    const res = await this.fopCustomersRepository.delete(id);
    if (res.affected === 0) {
      throw new HttpException(
        'There is no FOP customer with this id',
        HttpStatus.BAD_REQUEST,
      );
    }
    return id;
  }
}
