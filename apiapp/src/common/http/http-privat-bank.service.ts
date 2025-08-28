import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

@Injectable()
export class HttpPrivatBankService {
  private readonly httpService: HttpService;
  private readonly logger: Logger;

  constructor(private readonly config: ConfigService) {
    this.logger = new Logger(HttpPrivatBankService.name);
    this.httpService = new HttpService(this.returnAxiosInstance());
  }

  private returnAxiosInstance(): AxiosInstance {
    return axios.create({
      baseURL: this.config.get<string>('PB_URL'),
      timeout: this.config.get<number>('3000000'),
      responseType: 'json',
    });
  }

  public async get(url: string): Promise<AxiosResponse> {
    return this.httpService.axiosRef.get(url);
  }
}
