import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AccountsService } from '../accounts/accounts.service';
import { TagsService } from '../tags/tags.service';

import { CreatePBIDto, UpdatePBIDto } from './pbi.dto';
import { PBIEntity } from './pbi.entity';
import { PBIsRepository } from './pbis.repository';

@Injectable()
export class PBIsService {
  constructor(
    @InjectRepository(PBIsRepository)
    private readonly pbisRepository: PBIsRepository,
    private readonly accountsService: AccountsService,
    private readonly tagsService: TagsService,
  ) {}

  async checkIsExists(query: Partial<PBIEntity>): Promise<boolean> {
    return this.pbisRepository.exists({ where: query });
  }

  async getOne(query: Partial<PBIEntity>): Promise<PBIEntity> {
    return this.pbisRepository.findOne({
      where: query,
      relations: {
        tags: true,
        transactions: true,
      },
    });
  }

  async getMany(query: Partial<PBIEntity>): Promise<PBIEntity[]> {
    return this.pbisRepository.find({
      where: query,
      relations: {
        tags: true,
        transactions: true,
      },
    });
  }

  async create(createDto: CreatePBIDto): Promise<PBIEntity> {
    try {
      const isExists = await this.checkIsExists({ name: createDto.name });

      if (isExists)
        throw new HttpException(
          'PBI with this name already exists, the name should be unique',
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
      return await this.pbisRepository.save({
        isFullyPaid: false,
        ...createDto,
        tags,
        account: { id: createDto.accountId },
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async update(
    updateDto: Partial<UpdatePBIDto>,
    id: number,
  ): Promise<PBIEntity> {
    try {
      const pbi = await this.getOne({ id });
      if (!pbi)
        throw new HttpException('PBI with this id does not exists', 400);
      if (updateDto.name && pbi.name !== updateDto.name) {
        const isNameExists = await this.checkIsExists({ name: updateDto.name });
        if (isNameExists)
          throw new HttpException('PBI with this name already exists', 400);
      }
      let tags = pbi.tags;
      if (updateDto.tags) {
        tags = [];
        for (let i = 0; i < updateDto.tags?.length; i++) {
          const newTag = await this.tagsService.getOne({
            id: updateDto.tags[i],
          });
          tags.push(newTag);
        }
      }
      return this.pbisRepository.save({
        ...pbi,
        ...updateDto,
        tags,
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async getByAccountId(id: number): Promise<PBIEntity[]> {
    return await this.pbisRepository.find({
      where: { account: { id } },
      relations: {
        tags: true,
        transactions: true,
      },
    });
  }

  async deleteById(id: number): Promise<number> {
    const res = await this.pbisRepository.delete(id);
    if (res.affected === 0)
      throw new HttpException(
        'There is no subscription with this id',
        HttpStatus.BAD_REQUEST,
      );
    return id;
  }
}
