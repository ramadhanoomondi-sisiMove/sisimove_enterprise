import { ApiProperty } from '@nestjs/swagger';

import { Transform, type TransformFnParams } from 'class-transformer';

import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

export class ConfigureMpesaRequestDto {
  @ApiProperty({
    example: 'SANDBOX',
    enum: ['SANDBOX', 'PRODUCTION'],
    description: 'M-PESA integration environment.',
  })
  @Transform(trimString)
  @IsIn(['SANDBOX', 'PRODUCTION'])
  environment!: string;

  @ApiProperty({
    example: 'your-consumer-key',
    description: 'Safaricom Daraja Consumer Key.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  consumerKey!: string;

  @ApiProperty({
    example: 'your-consumer-secret',
    description: 'Safaricom Daraja Consumer Secret.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  consumerSecret!: string;

  @ApiProperty({
    example: '174379',
    description: 'M-PESA business shortcode.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  shortcode!: string;

  @ApiProperty({
    example: 'your-stk-passkey',
    description: 'Safaricom Daraja STK Push passkey.',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  passkey!: string;
}

export default ConfigureMpesaRequestDto;
