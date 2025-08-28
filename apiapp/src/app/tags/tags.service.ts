import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { generateRandomHexColor } from 'src/common/helpers/generate-color.helper';

import { AccountsService } from '../accounts/accounts.service';

import { CreatedTagDto, CreateTagDto, UpdateTagDto } from './tag.dto';
import { TagEntity } from './tag.entity';
import { TagsRepository } from './tags.repository';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagsRepository)
    private readonly tagsRepository: TagsRepository,
    private readonly accountsService: AccountsService,
  ) {}

  async getOne(query: Partial<TagEntity>): Promise<TagEntity> {
    return this.tagsRepository.findOne({ where: query });
  }

  async updateById({ name, color, accountId }: UpdateTagDto, id: number) {
    try {
      const tag = await this.getOne({ id });
      if (!tag)
        throw new HttpException('Tag with this id does not exists', 400);
      if (name || color) {
        const isNameExists = await this.checkIsUnique({
          name,
          color,
          accountId,
        });
        if (isNameExists)
          throw new HttpException(
            'Tag with this name or color already exists in this account',
            400,
          );
      }
      return this.tagsRepository.save({
        ...tag,
        color: color || tag.color,
        name: name || tag.name,
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async checkIsUnique({
    name,
    color,
    accountId,
  }: {
    name?: string;
    color?: string;
    accountId: number;
  }): Promise<boolean> {
    const where: any[] = [];
    if (name) where.push({ name, account: { id: accountId } });
    if (color) where.push({ color, account: { id: accountId } });
    if (where.length === 0) return false;
    const existing = await this.tagsRepository.findOne({
      where: where,
      relations: ['account'],
    });

    return !!existing;
  }

  async create({
    accountId,
    color,
    name,
  }: CreateTagDto): Promise<CreatedTagDto> {
    try {
      const isExists = await this.checkIsUnique({ name, color, accountId });
      if (isExists) {
        throw new HttpException(
          'Tag with this name or color already exists for this account',
          400,
        );
      }

      const account = await this.accountsService.getOneById(accountId);
      if (!account) {
        throw new HttpException('Account with this id does not exist', 400);
      }
      let finalColor = color;
      if (!finalColor) {
        const usedColors = await this.tagsRepository.find({
          where: { account: { id: accountId } },
          select: ['color'],
        });
        const usedColorSet = new Set(
          usedColors.map((tag) => tag.color.toLowerCase()),
        );
        do {
          finalColor = generateRandomHexColor();
        } while (usedColorSet.has(finalColor.toLowerCase()));
      }

      const tag = await this.tagsRepository.save({
        name,
        color: finalColor,
        account,
      });

      delete tag.account;
      return tag;
    } catch (err) {
      throw new HttpException(err.message || 'Server error', err.status || 500);
    }
  }

  async findAll(accountId: number): Promise<TagEntity[]> {
    try {
      const isAccountExists = await this.accountsService.checkIsExists({
        id: accountId,
      });
      if (!isAccountExists)
        throw new HttpException('Account with this id does not exists', 400);
      return await this.tagsRepository.find({
        where: {
          account: {
            id: accountId,
          },
        },
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }
}
