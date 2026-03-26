import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  ManyToOne,
  Relation,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';

import { FOPCustomerEntity } from '../fop-customers/fop-customer.entity';
import { WorkActEntity } from '../work-acts/work-act.entity';

@Entity('invoice')
export class InvoiceEntity extends AbstractEntity {
  @ApiProperty({
    example: '№ 6/25-О',
  })
  @Column({ type: 'text', unique: true })
  name: string;

  @ApiProperty({ description: 'Customer associated with the invoice' })
  @ManyToOne(() => FOPCustomerEntity, (customer) => customer.invoices, {
    onDelete: 'CASCADE',
  })
  readonly customer: Relation<FOPCustomerEntity>;

  @ApiProperty({ example: 1500.5, description: 'Total amount of the invoice' })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string): number => parseFloat(value),
    },
  })
  amount: number;

  @ApiProperty({
    enum: InvoiceStatus,
    example: InvoiceStatus.PENDING,
    description: 'Status of the invoice',
  })
  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Date when the invoice was paid',
  })
  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  readonly datePaid?: string;

  @ApiProperty({
    example: '/invoices/invoice-5-2025-09.pdf',
    description: 'Local path to the PDF file',
  })
  @Column({ type: 'varchar', nullable: true })
  filePath?: string;

  @OneToOne(() => WorkActEntity, (act) => act.invoice, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  act: Relation<WorkActEntity>;
}
