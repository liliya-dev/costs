import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  Relation,
} from 'typeorm';

import { OutgoingTransactionEntity } from 'src/common/entities/outgoing-transaction.entity';

import { AccountEntity } from '../accounts/accounts.entity';
import { TagEntity } from '../tags/tag.entity';

@Entity('otps')
export class OTPEntity extends OutgoingTransactionEntity {
  @ApiProperty({
    example: 'Pharmacy',
    description: 'Name of one time payments',
  })
  @Column({ type: 'text', unique: false })
  name: string;

  @ApiProperty({
    example: 'TI bought this to...',
    description: 'Some otp details and descriptions',
  })
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ManyToOne(() => AccountEntity, (account) => account.otps)
  readonly account: Relation<AccountEntity>;

  @ManyToMany(() => TagEntity)
  @JoinTable({
    name: 'otp_tags',
    joinColumn: {
      name: 'otp_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      referencedColumnName: 'id',
    },
  })
  tags: TagEntity[];
}
