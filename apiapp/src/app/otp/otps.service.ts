import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';

import { PeriodOptionsDto } from 'src/common/dtos/period-options.dto';
import { getRates } from 'src/common/helpers/get-rates.helper';
import { HttpPrivatBankService } from 'src/common/http/http-privat-bank.service';

import { AccountsService } from '../accounts/accounts.service';
import { TagsService } from '../tags/tags.service';

import { CreateOTPDto, UpdateOTPDto } from './otp.dto';
import { OTPsRepository } from './otp.repository';
import { OTPEntity } from './otps.entity';

@Injectable()
export class OTPsService {
  constructor(
    @InjectRepository(OTPsRepository)
    private readonly otpsRepository: OTPsRepository,
    private readonly accountsService: AccountsService,
    private readonly httpPrivatBankService: HttpPrivatBankService,
    private readonly tagsService: TagsService,
  ) {}

  async create({
    accountId,
    amount,
    description,
    currency,
    name,
    tags,
  }: CreateOTPDto): Promise<OTPEntity> {
    try {
      const isAccountExists = await this.accountsService.checkIsExists({
        id: accountId,
      });
      if (!isAccountExists)
        throw new HttpException('Account with this id does not exists', 400);
      const ratesRes = await this.httpPrivatBankService.get('');
      const rates = getRates(ratesRes.data);

      const createdTags = [];
      for (let i = 0; i < tags?.length; i++) {
        const newTag = await this.tagsService.getOne({ id: tags[i] });
        createdTags.push(newTag);
      }
      return await this.otpsRepository.save({
        amount,
        currency,
        rateUahToEur: rates.rateUahToEur,
        rateUahToUsd: rates.rateUahToUsd,
        datePaid: new Date().toISOString(),
        account: { id: accountId },
        name,
        description,
        tags: createdTags,
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async update(
    updateDto: Partial<UpdateOTPDto>,
    id: number,
  ): Promise<OTPEntity> {
    try {
      const otp = await this.otpsRepository.findOne({ where: { id } });
      if (!otp)
        throw new HttpException('OTP with this id does not exists', 400);
      let tags = otp.tags;
      if (updateDto.tags) {
        tags = [];
        for (let i = 0; i < updateDto.tags?.length; i++) {
          const newTag = await this.tagsService.getOne({
            id: updateDto.tags[i],
          });
          tags.push(newTag);
        }
      }
      return this.otpsRepository.save({
        ...otp,
        ...updateDto,
        tags,
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async getInPeriod(dto: PeriodOptionsDto, id: number): Promise<OTPEntity[]> {
    try {
      const isAccountExists = await this.accountsService.checkIsExists({ id });
      if (!isAccountExists)
        throw new HttpException('Account with this id does not exists', 400);
      const donePayments = await this.otpsRepository.find({
        where: {
          datePaid: Between(dto.startDate, dto.endDate),
          account: {
            id,
          },
        },
        relations: {
          tags: true,
        },
      });
      return donePayments;
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async getByAccountId(id: number): Promise<OTPEntity[]> {
    return await this.otpsRepository.find({
      where: { account: { id } },
      relations: {
        tags: true,
      },
    });
  }

  async deleteById(id: number): Promise<number> {
    const res = await this.otpsRepository.delete(id);
    if (res.affected === 0)
      throw new HttpException(
        'There is no otp with this id',
        HttpStatus.BAD_REQUEST,
      );
    return id;
  }
}
