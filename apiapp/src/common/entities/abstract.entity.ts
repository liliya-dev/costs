import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @ApiProperty({ example: 1, description: 'Primary key' })
  @PrimaryGeneratedColumn('increment')
  readonly id: number;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Created at',
  })
  @CreateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  readonly createdAt: Date;

  @ApiProperty({
    example: new Date().toISOString(),
    description: 'Updated at',
  })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
    nullable: false,
  })
  readonly updatedAt: Date;
}
