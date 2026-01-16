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

  @ApiProperty({
    example: 'ФОП Сезанович Вікторія Петрівна',
    description: 'FOP owner full name',
  })
  @Column({ type: 'text', nullable: true })
  fopFullName?: string;

  @ApiProperty({ example: 'Сезанович В.П.', description: 'Director name' })
  @Column({ type: 'varchar', nullable: true })
  directorName?: string;

  @ApiProperty({
    example: 'UA10 307770 00000 26004611213372',
    description: 'IBAN',
  })
  @Column({ type: 'varchar', nullable: true })
  iban?: string;

  @ApiProperty({
    example: 'Акционерне Товариство "А-Банк"',
    description: 'Bank name',
  })
  @Column({ type: 'varchar', nullable: true })
  bankName?: string;

  @ApiProperty({ example: '3596903428', description: 'IPN' })
  @Column({ type: 'varchar', nullable: true })
  ipn?: string;

  @ApiProperty({ example: '14360080', description: 'Bank EDRPOU' })
  @Column({ type: 'varchar', nullable: true })
  bankEdrpou?: string;

  @ApiProperty({ example: '307770', description: 'MFO' })
  @Column({ type: 'varchar', nullable: true })
  mfo?: string;

  @ApiProperty({
    example:
      '08132, Київська обл., Бучанський р-н, місто Вишневе вул. Південна, будинок 9, квартира 68',
    description: 'Address',
  })
  @Column({ type: 'text', nullable: true })
  address?: string;

  @ApiProperty({
    example: 'Платник єдиного податку 3 групи',
    description: 'Tax system',
  })
  @Column({ type: 'varchar', nullable: true })
  taxSystem?: string;

  @ApiProperty({ example: '096-318-25-01', description: 'Phone number' })
  @Column({ type: 'varchar', nullable: true })
  phone?: string;
}
