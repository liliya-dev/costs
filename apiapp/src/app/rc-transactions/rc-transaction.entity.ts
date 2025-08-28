import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { OutgoingTransactionEntity } from 'src/common/entities/outgoing-transaction.entity';

import { RCEntity } from '../rc/rc.entity';

@Entity('rc-transactions')
export class RCTransactionEntity extends OutgoingTransactionEntity {
  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Date when the payment should be done',
  })
  @Column({
    type: 'timestamp with time zone',
    nullable: true,
  })
  readonly dateShouldBePaid: string;

  @ManyToOne(() => RCEntity, (rc) => rc.transactions, {
    onDelete: 'CASCADE',
  })
  readonly rc: Relation<RCEntity>;
}
