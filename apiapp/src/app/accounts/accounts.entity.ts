import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, Relation } from 'typeorm';

import { AbstractEntity } from 'src/common/entities/abstract.entity';

import { CustomerEntity } from '../customers/customer.entity';
import { OTPEntity } from '../otp/otps.entity';
import { PBIEntity } from '../pbi/pbi.entity';
import { RCEntity } from '../rc/rc.entity';
import { SubscriptionEntity } from '../subscriptions/subscription.entity';
import { TagEntity } from '../tags/tag.entity';

@Entity('accounts')
export class AccountEntity extends AbstractEntity {
  @ApiProperty({ example: 'Pomazueva', description: 'Account name' })
  @Column({ type: 'text', unique: true })
  name: string;

  @OneToMany(() => CustomerEntity, (customer) => customer.account)
  readonly customers: Relation<CustomerEntity[]>;

  @OneToMany(() => RCEntity, (rc) => rc.account)
  readonly rcs: Relation<RCEntity[]>;

  @OneToMany(() => SubscriptionEntity, (subscription) => subscription.account)
  readonly subscriptions: Relation<SubscriptionEntity[]>;

  @OneToMany(() => PBIEntity, (pbi) => pbi.account)
  readonly pbis: Relation<PBIEntity[]>;

  @OneToMany(() => OTPEntity, (otp) => otp.account)
  readonly otps: Relation<OTPEntity[]>;

  @OneToMany(() => TagEntity, (tag) => tag.account)
  readonly tags: Relation<TagEntity[]>;
}
