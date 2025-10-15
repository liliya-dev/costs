import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';

import { Role } from 'src/common/enums/roles.enum';

import { CustomerEntity } from '../customers/customer.entity';
import { FOPCustomerEntity } from '../fop-customers/fop-customer.entity';

export class CustomerWithRoleDto {
  @ApiProperty({
    example: Role.FOP_CUSTOMER,
    description: 'Role of the customer',
    enum: Role,
  })
  @IsEnum(Role)
  @IsDefined()
  @IsNotEmpty()
  role: Role;

  constructor(partial: CustomerEntity | FOPCustomerEntity, role: Role) {
    Object.assign(this, partial);
    this.role = role;
  }
}
