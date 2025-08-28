import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between } from 'typeorm';

import { PeriodOptionsDto } from 'src/common/dtos/period-options.dto';
import { getRates } from 'src/common/helpers/get-rates.helper';
import { HttpPrivatBankService } from 'src/common/http/http-privat-bank.service';

import { AccountsService } from '../accounts/accounts.service';

import { CreateOTIDto, UpdateOTIDto } from './oti.dto';
import { OTIsRepository } from './oti.repository';
import { OTIEntity } from './otis.entity';

@Injectable()
export class OTIsService {
  constructor(
    @InjectRepository(OTIsRepository)
    private readonly otisRepository: OTIsRepository,
    private readonly accountsService: AccountsService,
    private readonly httpPrivatBankService: HttpPrivatBankService,
  ) {}

  async create({
    accountId,
    amount,
    description,
    currency,
    name,
  }: CreateOTIDto): Promise<OTIEntity> {
    try {
      const isAccountExists = await this.accountsService.checkIsExists({
        id: accountId,
      });
      if (!isAccountExists)
        throw new HttpException('Account with this id does not exists', 400);

      const ratesRes = await this.httpPrivatBankService.get('');
      const rates = getRates(ratesRes.data);
      return await this.otisRepository.save({
        amount,
        currency,
        rateUahToEur: rates.rateUahToEur,
        rateUahToUsd: rates.rateUahToUsd,
        datePaid: new Date().toISOString(),
        account: { id: accountId },
        name,
        description,
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async update(id: number, updateDto: UpdateOTIDto): Promise<OTIEntity> {
    try {
      const currentOti = await this.otisRepository.findOne({
        where: {
          id,
        },
      });
      if (!currentOti)
        throw new HttpException('OTI with this id does not exists', 400);

      return await this.otisRepository.save({
        ...currentOti,
        ...updateDto,
      });
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async getInPeriod(dto: PeriodOptionsDto, id: number): Promise<OTIEntity[]> {
    try {
      const isAccountExists = await this.accountsService.checkIsExists({ id });
      if (!isAccountExists)
        throw new HttpException('Account with this id does not exists', 400);
      const donePayments = await this.otisRepository.find({
        where: {
          datePaid: Between(dto.startDate, dto.endDate),
          account: {
            id,
          },
        },
      });
      return donePayments;
    } catch (err) {
      throw new HttpException(err.message || 'server error', err.status || 500);
    }
  }

  async deleteById(id: number): Promise<number> {
    const res = await this.otisRepository.delete(id);
    if (res.affected === 0)
      throw new HttpException(
        'There is no transaction with this id',
        HttpStatus.BAD_REQUEST,
      );
    return id;
  }
}
