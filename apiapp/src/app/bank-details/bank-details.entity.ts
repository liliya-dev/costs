import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

import { FOPCustomerEntity } from '../fop-customers/fop-customer.entity';

@Entity('bank_details')
export class BankDetailsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '37118337', description: 'EDRPOU number' })
  @Column({ type: 'varchar', nullable: true })
  edrpou?: string;

  @ApiProperty({ example: '371183326531', description: 'IPN' })
  @Column({ type: 'varchar', nullable: true })
  ipn?: string;

  @ApiProperty({ example: '200155465', description: 'VAT certificate' })
  @Column({ type: 'varchar', nullable: true })
  vat_certificate?: string;

  @ApiProperty({
    example: 'Є платником податку на прибуток на загальних підставах',
    description: 'Tax system',
  })
  @Column({ type: 'varchar', nullable: true })
  tax_system?: string;

  @ApiProperty({
    example: 'UA763052990000026007030110502',
    description: 'IBAN',
  })
  @Column({ type: 'varchar', nullable: true })
  iban?: string;

  @ApiProperty({ example: 'ПАТ КБ "ПриватБанк"', description: 'Bank name' })
  @Column({ type: 'varchar', nullable: true })
  bank_name?: string;

  @ApiProperty({ example: '305299', description: 'MFO' })
  @Column({ type: 'varchar', nullable: true })
  mfo?: string;

  @ApiProperty({
    example: '65085, м. Одеса, вул. Самарська, 4',
    description: 'Address',
  })
  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @ApiProperty({ example: '096-318-25-01', description: 'Phone number' })
  @Column({ type: 'varchar', nullable: true })
  phone?: string;

  @ApiProperty({ example: 'totgroup@hlebod.com', description: 'Email' })
  @Column({ type: 'varchar', nullable: true })
  email?: string;

  @ApiProperty({ example: '1/25-TOT', description: 'Contract number' })
  @Column({ type: 'varchar', nullable: true })
  contract_number?: string;

  @ApiProperty({ example: '2025-03-14', description: 'Contract date' })
  @Column({ type: 'date', nullable: true })
  contract_date?: Date;

  @ApiProperty({
    example: 'Договір надання консультаційних послуг з питань інформатизації',
    description: 'Contract description',
  })
  @Column({ type: 'varchar', nullable: true })
  contract_description?: string;

  @ApiProperty({
    example: 'Консультационные услуги',
    description: 'Contract description',
  })
  @Column({ type: 'varchar', nullable: true })
  invoice_description?: string;

  @OneToOne(() => FOPCustomerEntity, (customer) => customer.bankDetails, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  customer: Relation<FOPCustomerEntity>;
}
