import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { OutgoingTransactionEntity } from 'src/common/entities/outgoing-transaction.entity';

import { PBIEntity } from '../pbi/pbi.entity';

@Entity('pbi-transactions')
export class PBITransactionEntity extends OutgoingTransactionEntity {
  @ManyToOne(() => PBIEntity, (pbi) => pbi.transactions, {
    onDelete: 'CASCADE',
  })
  readonly pbi: Relation<PBIEntity>;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Date when the payment should be done',
  })
  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  readonly dateShouldBePaid: string;
}
