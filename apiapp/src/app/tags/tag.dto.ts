import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreatedTagDto {
  @ApiProperty({ example: 41 })
  id: number;

  @ApiProperty({ example: 'Server expences' })
  name: string;

  @ApiProperty({
    example: '#FF5733',
    description: 'Hex color of the tag (must be unique per account)',
  })
  color: string;
}

export class CreateTagDto {
  @ApiProperty({ example: 'Server expences' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '#FF5733',
    description: 'Hex color of the tag (must be unique per account)',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  accountId: number;
}

export class UpdateTagDto {
  @ApiProperty({ example: 'Server expences' })
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiProperty({
    example: '#FF5733',
    description: 'Hex color of the tag (must be unique per account)',
  })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ example: 4 })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  accountId: number;
}
