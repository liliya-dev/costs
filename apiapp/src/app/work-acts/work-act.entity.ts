import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne, Relation } from 'typeorm';

import { AbstractEntity } from 'src/common/entities/abstract.entity';

import { InvoiceEntity } from '../invoices/invoice.entity';

@Entity('work-act')
export class WorkActEntity extends AbstractEntity {
  @ApiProperty({
    example: '№ 6/25-О',
  })
  @Column({ type: 'text', unique: false })
  name: string;

  @ApiProperty({
    example: '/invoices/invoice-5-2025-09.pdf',
    description: 'Local path to the PDF file',
  })
  @Column({ type: 'varchar', nullable: true })
  filePath?: string;

  @OneToOne(() => InvoiceEntity, (invoice) => invoice.act, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  invoice: Relation<InvoiceEntity>;
}
