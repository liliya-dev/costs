import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from 'typeorm';

import { AccountEntity } from '../accounts/accounts.entity';

@Entity('tags')
@Unique(['account', 'color'])
@Unique(['account', 'name'])
export class TagEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Server infrastructure',
    description: 'Name of the tag',
  })
  @Column({ type: 'text', unique: true })
  name: string;

  @ApiProperty({
    example: '#FF5733',
    description: 'Hex color of the tag',
  })
  @Column({ type: 'varchar', length: 7 })
  color: string;

  @ManyToOne(() => AccountEntity, (account) => account.subscriptions)
  readonly account: Relation<Partial<AccountEntity>>;
}
