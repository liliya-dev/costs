import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AccountDto } from './account.dto';
import { AccountEntity } from './accounts.entity';
import { AccountsRepository } from './accounts.repository';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(AccountsRepository)
    private readonly accountsRepository: AccountsRepository,
  ) {}
  async getOneById(id: number): Promise<AccountEntity> {
    return this.accountsRepository.findOne({
      where: { id },
      relations: {
        customers: true,
      },
    });
  }

  async getMany(): Promise<AccountEntity[]> {
    return this.accountsRepository.find({
      relations: {
        customers: true,
      },
    });
  }

  async checkIsExists(query: Partial<AccountEntity>): Promise<boolean> {
    return this.accountsRepository.exists({ where: query });
  }

  async create(createDto: AccountDto): Promise<AccountEntity> {
    try {
      const isExists = await this.checkIsExists({ name: createDto.name });
      if (isExists)
        throw new HttpException('Account with this name already exists', 400);
      const createdCustomer = await this.accountsRepository.save(createDto);
      return createdCustomer;
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }
}
