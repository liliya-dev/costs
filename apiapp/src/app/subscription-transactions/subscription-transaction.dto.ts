import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

import { CreateOutgoingTransactionDto } from 'src/common/dtos/outgoing-transaction.dto';
import { PaymentDto } from 'src/common/dtos/payments.dto';

import { TagEntity } from '../tags/tag.entity';

export class CreateSubscriptionTransactionDto extends CreateOutgoingTransactionDto {
  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  subscriptionId: number;
}

export class SubscriptionsDoneAndUpcomingDto extends PaymentDto {
  @ApiProperty({ example: 'Medium' })
  @IsNotEmpty()
  @IsString()
  subscriptionName: string;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @IsString()
  subscriptionId: number;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @IsArray()
  subscriptionTags: TagEntity[];
}
