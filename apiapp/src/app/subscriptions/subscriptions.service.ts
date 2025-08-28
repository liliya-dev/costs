import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not } from 'typeorm';

import { AccountsService } from '../accounts/accounts.service';
import { TagsService } from '../tags/tags.service';

import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './subscription.dto';
import { SubscriptionEntity } from './subscription.entity';
import { SubscriptionsRepository } from './subscriptions.repository';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(SubscriptionsRepository)
    private readonly subscriptionsRepository: SubscriptionsRepository,
    private readonly tagsService: TagsService,
    private readonly accountsService: AccountsService,
  ) {}

  async checkIsExists(query: Partial<SubscriptionEntity>): Promise<boolean> {
    return this.subscriptionsRepository.exists({ where: query });
  }

  async getManyWithIdNotInRange(
    excludedIds: number[],
    accountId: number,
  ): Promise<SubscriptionEntity[]> {
    return this.subscriptionsRepository.find({
      where: {
        id: Not(In(excludedIds)),
        account: {
          id: accountId,
        },
      },
    });
  }

  async getOne(
    query: Partial<SubscriptionEntity>,
  ): Promise<SubscriptionEntity> {
    return this.subscriptionsRepository.findOne({
      where: query,
      relations: {
        tags: true,
      },
    });
  }

  async getOneWithTransactions(
    query: Partial<SubscriptionEntity>,
  ): Promise<SubscriptionEntity> {
    return this.subscriptionsRepository.findOne({
      where: query,
      relations: {
        tags: true,
        transactions: true,
      },
    });
  }

  async getMany(
    query: Partial<SubscriptionEntity>,
  ): Promise<SubscriptionEntity[]> {
    return this.subscriptionsRepository.find({
      where: query,
      relations: {
        tags: true,
        transactions: true,
      },
    });
  }

  async create(createDto: CreateSubscriptionDto): Promise<SubscriptionEntity> {
    try {
      const isExists = await this.checkIsExists({ name: createDto.name });
      if (isExists)
        throw new HttpException(
          'Subscription with this name already exists, the name should be unique',
          400,
        );
      const isAccountExists = await this.accountsService.checkIsExists({
        id: createDto.accountId,
      });
      if (!isAccountExists)
        throw new HttpException('Account with this id does not exists', 400);
      const tags = [];
      for (let i = 0; i < createDto.tags?.length; i++) {
        const newTag = await this.tagsService.getOne({ id: createDto.tags[i] });
        tags.push(newTag);
      }
      return await this.subscriptionsRepository.save({
        ...createDto,
        isCancelled: false,
        tags,
        account: { id: createDto.accountId },
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async deleteById(id: number): Promise<number> {
    const res = await this.subscriptionsRepository.delete(id);
    if (res.affected === 0)
      throw new HttpException(
        'There is no subscription with this id',
        HttpStatus.BAD_REQUEST,
      );
    return id;
  }

  async update(
    updateDto: Partial<UpdateSubscriptionDto>,
    id: number,
  ): Promise<SubscriptionEntity> {
    try {
      const subscription = await this.getOne({ id });
      if (!subscription)
        throw new HttpException(
          'Subscription with this id does not exists',
          400,
        );
      if (updateDto.name && updateDto.name !== subscription.name) {
        const isNameExists = await this.checkIsExists({ name: updateDto.name });
        if (isNameExists)
          throw new HttpException(
            'Subscription with this name already exists',
            400,
          );
      }
      let tags = subscription.tags;
      if (updateDto.tags) {
        tags = [];
        for (let i = 0; i < updateDto.tags?.length; i++) {
          const newTag = await this.tagsService.getOne({
            id: updateDto.tags[i],
          });
          tags.push(newTag);
        }
      }
      return this.subscriptionsRepository.save({
        ...subscription,
        ...updateDto,
        tags,
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async getByAccountId(id: number): Promise<SubscriptionEntity[]> {
    return await this.subscriptionsRepository.find({
      where: { account: { id } },
      relations: {
        tags: true,
      },
    });
  }
}
