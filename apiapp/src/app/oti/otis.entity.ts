import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { OutgoingTransactionEntity } from 'src/common/entities/outgoing-transaction.entity';

import { AccountEntity } from '../accounts/accounts.entity';

@Entity('otis')
export class OTIEntity extends OutgoingTransactionEntity {
  @ApiProperty({
    example: 'Upwork',
    description: 'Name source of one time income',
  })
  @Column({ type: 'text', unique: false })
  name: string;

  @ApiProperty({
    example: 'I got this for fixing bugs with upwork client',
    description: 'Some oti details and descriptions',
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => AccountEntity, (account) => account.otps)
  readonly account: Relation<AccountEntity>;
}
