import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AccountDto {
  @ApiProperty({ example: 'Pomazueva' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
