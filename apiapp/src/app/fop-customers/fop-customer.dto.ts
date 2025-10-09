import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsDefined,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { Currency } from 'src/common/enums/currency.enum';

export class CreateBankDetailsDto {
  @ApiProperty({
    example: '37118337',
    description: 'EDRPOU number',
    required: false,
  })
  @IsOptional()
  @IsString()
  edrpou?: string;

  @ApiProperty({ example: '371183326531', description: 'IPN', required: false })
  @IsOptional()
  @IsString()
  ipn?: string;

  @ApiProperty({
    example: '200155465',
    description: 'VAT certificate',
    required: false,
  })
  @IsOptional()
  @IsString()
  vat_certificate?: string;

  @ApiProperty({
    example: 'Є платником податку на прибуток на загальних підставах',
    description: 'Tax system',
    required: false,
  })
  @IsOptional()
  @IsString()
  tax_system?: string;

  @ApiProperty({
    example: 'UA763052990000026007030110502',
    description: 'IBAN',
    required: false,
  })
  @IsOptional()
  @IsString()
  iban?: string;

  @ApiProperty({
    example: 'ПАТ КБ "ПриватБанк"',
    description: 'Bank name',
    required: false,
  })
  @IsOptional()
  @IsString()
  bank_name?: string;

  @ApiProperty({ example: '305299', description: 'MFO', required: false })
  @IsOptional()
  @IsString()
  mfo?: string;

  @ApiProperty({
    example: '65085, м. Одеса, вул. Самарська, 4',
    description: 'Address',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: '096-318-25-01',
    description: 'Phone number',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 'totgroup@hlebod.com',
    description: 'Email',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: '1/25-TOT',
    description: 'Contract number',
    required: false,
  })
  @IsOptional()
  @IsString()
  contract_number?: string;

  @ApiProperty({
    example: '2025-03-14',
    description: 'Contract date',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  contract_date?: Date;

  @ApiProperty({
    example: 'Договір надання консультаційних послуг з питань інформатизації',
    description: 'Contract description',
    required: false,
  })
  @IsOptional()
  @IsString()
  contract_description?: string;

  @ApiProperty({
    example: 'Консультационные услуги',
    description: 'Invoice description',
    required: false,
  })
  @IsOptional()
  @IsString()
  invoice_description?: string;

  @ApiProperty({ example: 1, description: 'FOP customer ID' })
  @IsString()
  customerId: number;
}

export class FOPCustomerDto {
  @ApiProperty({ example: 'Customer' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: Currency.USD })
  @IsEnum(Currency)
  @IsDefined()
  @IsNotEmpty()
  currency: Currency;

  @ApiProperty({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCancelled: boolean;

  @ApiProperty({ example: 500 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  monthlyPayment: number;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  accountId: number;

  @ApiProperty({ example: 18 })
  @Type(() => Number)
  @Min(1)
  @Max(28)
  @IsInt()
  approximatelyPaymentDay: number;

  @ApiProperty({ example: 468546815 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  @IsOptional()
  tgId?: number;
}

export class CreateFOPCustomerDto extends FOPCustomerDto {
  @ApiProperty({ type: CreateBankDetailsDto, required: false })
  @IsOptional()
  bankDetails?: CreateBankDetailsDto;
}
