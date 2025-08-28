import fastifyCompression from '@fastify/compress';
import {
  ClassSerializerInterceptor,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AccountEntity } from './app/accounts/accounts.entity';
import { CustomerDto } from './app/customers/customer.dto';
import { CustomerEntity } from './app/customers/customer.entity';
import { IncomeTransactionEntity } from './app/income-transactions/income-transaction.entity';
import { IRPsDoneAndUpcomingDto, IRPCreateDto } from './app/irp/irps.dto';
import { UpdateOTIDto } from './app/oti/oti.dto';
import { CreateOTPDto, UpdateOTPDto } from './app/otp/otp.dto';
import { OTPEntity } from './app/otp/otps.entity';
import { CreatePBIDto, UpdatePBIDto } from './app/pbi/pbi.dto';
import { PBIEntity } from './app/pbi/pbi.entity';
import {
  CreatePBITransactionDto,
  PBIsDoneAndUpcomingDto,
} from './app/pbi-transactions/pbi-transaction.dto';
import { PBITransactionEntity } from './app/pbi-transactions/pbi-transaction.entity';
import { CreateRCDto, UpdateRCDto } from './app/rc/rc.dto';
import { RCEntity } from './app/rc/rc.entity';
import {
  CreateRCTransactionDto,
  RCsDoneAndUpcomingDto,
} from './app/rc-transactions/rc-transaction.dto';
import { RCTransactionEntity } from './app/rc-transactions/rc-transaction.entity';
import {
  CreateSubscriptionTransactionDto,
  SubscriptionsDoneAndUpcomingDto,
} from './app/subscription-transactions/subscription-transaction.dto';
import { SubscriptionTransactionEntity } from './app/subscription-transactions/subscription-transaction.entity';
import {
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from './app/subscriptions/subscription.dto';
import { SubscriptionEntity } from './app/subscriptions/subscription.entity';
import { CreatedTagDto, CreateTagDto } from './app/tags/tag.dto';
import { TagEntity } from './app/tags/tag.entity';
import { AppModule } from './app.module';
import { AvailableDatesDto } from './common/dtos/dates-available.dto';
import { PaymentDto } from './common/dtos/payments.dto';
import { PeriodOptionsDto } from './common/dtos/period-options.dto';
import { HttpExceptionFilter } from './common/interceptors/http-exception.filter';

export class App {
  private readonly application: INestApplication;
  private readonly config: ConfigService;
  private readonly serverPort: number;

  constructor(application: INestApplication) {
    this.application = application;
    this.config = this.application.get(ConfigService);
    this.serverPort = +this.config.get<number>('SERVER_PORT');
    this.setupSwagger();
  }

  static async initialize(): Promise<App> {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
      { cors: true, bodyParser: true },
    );

    const reflector: Reflector = app.get(Reflector);
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        disableErrorMessages: false,
        whitelist: true,
        transform: true,
      }),
    );
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
    await app.register(fastifyCompression, {
      encodings: ['gzip', 'deflate'],
    });
    app.useGlobalFilters(new HttpExceptionFilter());
    return new App(app);
  }

  private setupSwagger(): void {
    const config = new DocumentBuilder()
      .setTitle('Costs manager')
      .setDescription('The costs manager API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(this.application, config, {
      extraModels: [
        RCsDoneAndUpcomingDto,
        PBIsDoneAndUpcomingDto,
        SubscriptionsDoneAndUpcomingDto,
        CustomerDto,
        IRPCreateDto,
        IncomeTransactionEntity,
        CustomerEntity,
        AccountEntity,
        IRPsDoneAndUpcomingDto,
        CreateTagDto,
        CreatedTagDto,
        SubscriptionEntity,
        PBIEntity,
        RCEntity,
        CreatePBIDto,
        UpdatePBIDto,
        CreateSubscriptionDto,
        UpdateSubscriptionDto,
        RCTransactionEntity,
        CreateRCTransactionDto,
        CreateSubscriptionTransactionDto,
        SubscriptionTransactionEntity,
        PBITransactionEntity,
        CreatePBITransactionDto,
        OTPEntity,
        CreateOTPDto,
        PaymentDto,
        PeriodOptionsDto,
        AvailableDatesDto,
        UpdateOTIDto,
        CreateTagDto,
        TagEntity,
        UpdateOTPDto,
        CreateRCDto,
        UpdateRCDto,
      ],
    });
    SwaggerModule.setup('/api/docs', this.application, document);
  }

  async listen(): Promise<void> {
    await this.application
      .listen(this.serverPort, '0.0.0.0', async () =>
        console.log(
          `Application documentation is available at ${await this.application.getUrl()}/api/docs`,
        ),
      )
      .catch((e) => console.log(e));
  }
}
