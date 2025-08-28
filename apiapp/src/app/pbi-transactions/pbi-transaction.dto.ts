import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';
import { Column } from 'typeorm';

import { CreateOutgoingTransactionDto } from 'src/common/dtos/outgoing-transaction.dto';
import { PaymentDto } from 'src/common/dtos/payments.dto';
import { Status } from 'src/common/enums/status.enum';

export class CreatePBITransactionDto extends CreateOutgoingTransactionDto {
  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  pbiId: number;

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

export class PBIsDoneAndUpcomingDto extends PaymentDto {
  @ApiProperty({ example: 'Medium' })
  @IsNotEmpty()
  @IsString()
  pbiName: string;

  @ApiProperty({ example: 12 })
  @IsNotEmpty()
  @IsString()
  pbiId: number;

  @ApiProperty({ example: Status.PAID_IN_ADVANCE })
  @IsNotEmpty()
  @IsString()
  status: Status;
}
