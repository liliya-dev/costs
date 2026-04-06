import { HttpException, Injectable } from '@nestjs/common';

import { Role } from 'src/common/enums/roles.enum';

import { CustomersService } from '../customers/customers.service';
import { FOPCustomersService } from '../fop-customers/fop-customers.service';

import { CustomerWithRoleDto } from './tg.dto';

@Injectable()
export class TgService {
  constructor(
    private readonly fopCustomerService: FOPCustomersService,
    private readonly customersService: CustomersService,
  ) {}

  async findCustomerByTgId(tgId: string): Promise<CustomerWithRoleDto> {
    const fopCustomer = await this.fopCustomerService.getOneByTgId(tgId);
    if (fopCustomer) {
      return new CustomerWithRoleDto(fopCustomer, Role.FOP_CUSTOMER);
    } else {
      const customer = await this.customersService.getOneByTgId(tgId);
      if (!customer)
        throw new HttpException(
          'Customer with this tg id does not exists',
          400,
        );
      return new CustomerWithRoleDto(customer, Role.CUSTOMER);
    }
  }
}
