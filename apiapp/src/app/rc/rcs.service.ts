import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AccountsService } from '../accounts/accounts.service';
import { TagsService } from '../tags/tags.service';

import { CreateRCDto, UpdateRCDto } from './rc.dto';
import { RCEntity } from './rc.entity';
import { RCsRepository } from './rcs.repository';

@Injectable()
export class RCsService {
  constructor(
    @InjectRepository(RCsRepository)
    private readonly rcsRepository: RCsRepository,
    private readonly accountsService: AccountsService,
    private readonly tagsService: TagsService,
  ) {}

  async checkIsExists(query: Partial<RCEntity>): Promise<boolean> {
    return this.rcsRepository.exists({ where: query });
  }

  async getOne(query: Partial<RCEntity>): Promise<RCEntity> {
    return this.rcsRepository.findOne({
      where: query,
      relations: {
        tags: true,
      },
    });
  }

  async getMany(query: Partial<RCEntity>): Promise<RCEntity[]> {
    return this.rcsRepository.find({
      where: query,
      relations: {
        tags: true,
      },
    });
  }

  async create(createDto: CreateRCDto): Promise<RCEntity> {
    try {
      const isExists = await this.checkIsExists({ name: createDto.name });

      if (isExists)
        throw new HttpException(
          'Regular cost with this name already exists, the name should be unique',
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
      return await this.rcsRepository.save({
        ...createDto,
        isActive: true,
        tags,
        account: { id: createDto.accountId },
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async update(updateDto: Partial<UpdateRCDto>, id: number): Promise<RCEntity> {
    try {
      const rc = await this.getOne({ id });
      if (!rc)
        throw new HttpException(
          'Regular cost with this id does not exists',
          400,
        );
      if (updateDto.name && updateDto.name !== rc.name) {
        const isNameExists = await this.checkIsExists({ name: updateDto.name });
        if (isNameExists)
          throw new HttpException(
            'Regular cost with this name already exists',
            400,
          );
      }
      let tags = rc.tags;
      if (updateDto.tags) {
        tags = [];
        for (let i = 0; i < updateDto.tags?.length; i++) {
          const newTag = await this.tagsService.getOne({
            id: updateDto.tags[i],
          });
          tags.push(newTag);
        }
      }
      return this.rcsRepository.save({
        ...rc,
        ...updateDto,
        tags,
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async getByAccountId(id: number): Promise<RCEntity[]> {
    return await this.rcsRepository.find({
      where: { account: { id } },
      relations: {
        tags: true,
      },
    });
  }

  async deleteById(id: number): Promise<number> {
    const res = await this.rcsRepository.delete(id);
    if (res.affected === 0)
      throw new HttpException(
        'There is no rc with this id',
        HttpStatus.BAD_REQUEST,
      );
    return id;
  }

  async getOneWithTransactions(query: Partial<RCEntity>): Promise<RCEntity> {
    return this.rcsRepository.findOne({
      where: query,
      relations: {
        tags: true,
        transactions: true,
      },
    });
  }
}
