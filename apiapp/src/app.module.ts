import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AccountsController } from './app/accounts/accounts.controller';
import { AccountsRepository } from './app/accounts/accounts.repository';
import { AccountsService } from './app/accounts/accounts.service';
import { BankDetailsRepository } from './app/bank-details/bank-details.repository';
import { BankDetailsService } from './app/bank-details/bank-details.service';
import { CustomersController } from './app/customers/customers.controller';
import { CustomersRepository } from './app/customers/customers.repository';
import { CustomersService } from './app/customers/customers.service';
import { FOPCustomersController } from './app/fop-customers/fop-customers.controller';
import { FOPCustomersRepository } from './app/fop-customers/fop-customers.repository';
import { FOPCustomersService } from './app/fop-customers/fop-customers.service';
import { IncomeTransactionsController } from './app/income-transactions/income-transactions.controller';
import { IncomeTransactionsRepository } from './app/income-transactions/income-transactions.repository';
import { IncomeTransactionsService } from './app/income-transactions/income-transactions.service';
import { InvoicesController } from './app/invoices/invoices.controller';
import { InvoicesRepository } from './app/invoices/invoices.repository';
import { InvoicesService } from './app/invoices/invoices.service';
import { IRPsController } from './app/irp/irps.controller';
import { IRPsRepository } from './app/irp/irps.repository';
import { IRPsService } from './app/irp/irps.service';
import { OTIsRepository } from './app/oti/oti.repository';
import { OTIsController } from './app/oti/otis.controller';
import { OTIsService } from './app/oti/otis.service';
import { OTPsRepository } from './app/otp/otp.repository';
import { OTPsController } from './app/otp/otps.controller';
import { OTPsService } from './app/otp/otps.service';
import { PBIsController } from './app/pbi/pbis.controller';
import { PBIsRepository } from './app/pbi/pbis.repository';
import { PBIsService } from './app/pbi/pbis.service';
import { PBITransactionsController } from './app/pbi-transactions/pbi-transactions.controller';
import { PBITransactionsRepository } from './app/pbi-transactions/pbi-transactions.repository';
import { PBITransactionsService } from './app/pbi-transactions/pbi-transactions.service';
import { RCsController } from './app/rc/rcs.controller';
import { RCsRepository } from './app/rc/rcs.repository';
import { RCsService } from './app/rc/rcs.service';
import { RCTransactionsController } from './app/rc-transactions/rc-transactions.controller';
import { RCTransactionsRepository } from './app/rc-transactions/rc-transactions.repository';
import { RCTransactionsService } from './app/rc-transactions/rc-transactions.service';
import { SheduledService } from './app/scheduled/sheduled.service';
import { SubscriptionTransactionsController } from './app/subscription-transactions/subscription-transactions.controller';
import { SubscriptionTransactionsRepository } from './app/subscription-transactions/subscription-transactions.repository';
import { SubscriptionTransactionsService } from './app/subscription-transactions/subscription-transactions.service';
import { SubscriptionsController } from './app/subscriptions/subscriptions.controller';
import { SubscriptionsRepository } from './app/subscriptions/subscriptions.repository';
import { SubscriptionsService } from './app/subscriptions/subscriptions.service';
import { TagsController } from './app/tags/tags.controller';
import { TagsRepository } from './app/tags/tags.repository';
import { TagsService } from './app/tags/tags.service';
import { WorkActsController } from './app/work-acts/work-acts.controller';
import { WorkActsRepository } from './app/work-acts/work-acts.repository';
import { WorkActsService } from './app/work-acts/work-acts.service';
import { validateEnvSchema } from './common/helpers/validate-env-schema.helper';
import { HttpPrivatBankService } from './common/http/http-privat-bank.service';
import { TypeOrmExModule } from './common/typeormex-module/typeorm-ex.module';
import { TypeOrmModule } from './database/typeorm.module';

const repositories: DynamicModule = TypeOrmExModule.forCustomRepository([
  CustomersRepository,
  IRPsRepository,
  IncomeTransactionsRepository,
  AccountsRepository,
  TagsRepository,
  RCsRepository,
  SubscriptionsRepository,
  PBIsRepository,
  RCTransactionsRepository,
  SubscriptionTransactionsRepository,
  PBITransactionsRepository,
  OTPsRepository,
  OTIsRepository,
  InvoicesRepository,
  BankDetailsRepository,
  FOPCustomersRepository,
  WorkActsRepository,
]);

const controllers = [
  CustomersController,
  IRPsController,
  IncomeTransactionsController,
  AccountsController,
  TagsController,
  RCsController,
  SubscriptionsController,
  PBIsController,
  RCTransactionsController,
  SubscriptionTransactionsController,
  PBITransactionsController,
  OTPsController,
  OTIsController,
  InvoicesController,
  FOPCustomersController,
  WorkActsController,
];

const services: Array<Provider> = [
  CustomersService,
  IRPsService,
  IncomeTransactionsService,
  HttpPrivatBankService,
  ConfigService,
  AccountsService,
  TagsService,
  RCsService,
  SubscriptionsService,
  PBIsService,
  RCTransactionsService,
  SubscriptionTransactionsService,
  PBITransactionsService,
  OTPsService,
  SheduledService,
  OTIsService,
  InvoicesService,
  BankDetailsService,
  FOPCustomersService,
  WorkActsService,
];

@Module({
  imports: [
    TypeOrmModule,
    repositories,
    HttpModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      cache: true,
      validationSchema: validateEnvSchema,
    }),
  ],
  controllers: [...controllers],
  providers: [...services],
  exports: [...services],
})
export class AppModule {}
