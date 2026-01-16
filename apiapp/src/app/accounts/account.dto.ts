import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AccountCreateDto {
  @ApiProperty({ example: 'Pomazuevaa' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'ФОП Сезанович Вікторія Петрівна',
    description: 'FOP owner full name',
  })
  @IsOptional()
  @IsString()
  fopFullName?: string;

  @ApiPropertyOptional({
    example: 'Сезанович В.П.',
    description: 'Director name',
  })
  @IsOptional()
  @IsString()
  directorName?: string;

  @ApiPropertyOptional({
    example: 'UA10 307770 00000 26004611213372',
    description: 'IBAN',
  })
  @IsOptional()
  @IsString()
  iban?: string;

  @ApiPropertyOptional({
    example: 'Акционерне Товариство "А-Банк"',
    description: 'Bank name',
  })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: '3596903428', description: 'IPN' })
  @IsOptional()
  @IsString()
  ipn?: string;

  @ApiPropertyOptional({ example: '14360080', description: 'Bank EDRPOU' })
  @IsOptional()
  @IsString()
  bankEdrpou?: string;

  @ApiPropertyOptional({ example: '307770', description: 'MFO' })
  @IsOptional()
  @IsString()
  mfo?: string;

  @ApiPropertyOptional({
    example:
      '08132, Київська обл., Бучанський р-н, місто Вишневе вул. Південна, будинок 9, квартира 68',
    description: 'Address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'Платник єдиного податку 3 групи',
    description: 'Tax system',
  })
  @IsOptional()
  @IsString()
  taxSystem?: string;

  @ApiPropertyOptional({
    example: '096-318-25-01',
    description: 'Phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class AccountUpdateDto {
  @ApiProperty({ example: 'Pomazuevaa' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'ФОП Сезанович Вікторія Петрівна',
    description: 'FOP owner full name',
  })
  @IsOptional()
  @IsString()
  fopFullName?: string;

  @ApiPropertyOptional({
    example: 'Сезанович В.П.',
    description: 'Director name',
  })
  @IsOptional()
  @IsString()
  directorName?: string;

  @ApiPropertyOptional({
    example: 'UA10 307770 00000 26004611213372',
    description: 'IBAN',
  })
  @IsOptional()
  @IsString()
  iban?: string;

  @ApiPropertyOptional({
    example: 'Акционерне Товариство "А-Банк"',
    description: 'Bank name',
  })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional({ example: '3596903428', description: 'IPN' })
  @IsOptional()
  @IsString()
  ipn?: string;

  @ApiPropertyOptional({ example: '14360080', description: 'Bank EDRPOU' })
  @IsOptional()
  @IsString()
  bankEdrpou?: string;

  @ApiPropertyOptional({ example: '307770', description: 'MFO' })
  @IsOptional()
  @IsString()
  mfo?: string;

  @ApiPropertyOptional({
    example:
      '08132, Київська обл., Бучанський р-н, місто Вишневе вул. Південна, будинок 9, квартира 68',
    description: 'Address',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'Платник єдиного податку 3 групи',
    description: 'Tax system',
  })
  @IsOptional()
  @IsString()
  taxSystem?: string;

  @ApiPropertyOptional({
    example: '096-318-25-01',
    description: 'Phone number',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
