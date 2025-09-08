import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, ManyToOne, Relation } from 'typeorm';

import { AbstractEntity } from 'src/common/entities/abstract.entity';
import { InvoiceStatus } from 'src/common/enums/invoice-status.enum';

import { CustomerEntity } from '../customers/customer.entity';
import { FOPCustomerEntity } from '../fop-customers/fop-customer.entity';

@Entity('invoice')
export class InvoiceEntity extends AbstractEntity {
  @ApiProperty({ description: 'Customer associated with the invoice' })
  @ManyToOne(() => FOPCustomerEntity, (customer) => customer.invoices, {
    onDelete: 'CASCADE',
  })
  readonly customer: Relation<CustomerEntity>;

  @ApiProperty({ example: 9, description: 'Invoice month (1-12)' })
  @Column({ type: 'integer' })
  month: number;

  @ApiProperty({ example: 2025, description: 'Invoice year' })
  @Column({ type: 'integer' })
  year: number;

  @ApiProperty({ example: 1500.5, description: 'Total amount of the invoice' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalAmount: number;

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
    example: '/invoices/invoice-5-2025-09.pdf',
    description: 'Local path to the PDF file',
  })
  @Column({ type: 'varchar', nullable: true })
  filePath?: string;
}
