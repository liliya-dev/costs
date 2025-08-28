import { CustomerDto } from 'src/app/customers/customer.dto';
import { CustomerEntity } from 'src/app/customers/customer.entity';

export interface ICustomerController {
  getOne(id: number): Promise<CustomerEntity>;
  create(customerDto: CustomerDto): Promise<CustomerEntity>;
}
