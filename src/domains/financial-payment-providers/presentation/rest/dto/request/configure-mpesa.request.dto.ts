import { ApiProperty } from '@nestjs/swagger';

import { Transform, type TransformFnParams } from 'class-transformer';

import { IsIn, IsString, MaxLength, MinLength } from 'class-validator';

// =============================================================================
// Transformation
// =============================================================================

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// =============================================================================
// Configure M-PESA Request DTO
// =============================================================================
//
// Supports Safaricom Daraja 3.0:
//
// - STK Push
// - B2C Disbursement
//
// All credentials are submitted through the configuration API and encrypted
// before persistence.
//
// =============================================================================

export class ConfigureMpesaRequestDto {
  // ===========================================================================
  // Environment
  // ===========================================================================

  @ApiProperty({
    example: 'SANDBOX',
    enum: ['SANDBOX', 'PRODUCTION'],
    description: 'M-PESA integration environment.',
  })
  @Transform(trimString)
  @IsIn(['SANDBOX', 'PRODUCTION'])
  environment!: string;

  // ===========================================================================
  // Shared Daraja Authentication
  // ===========================================================================

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
  @Transform(trimString)
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

  // ===========================================================================
  // STK Push Configuration
  // ===========================================================================

  @ApiProperty({
    example: 'your-stk-passkey',
    description: 'Safaricom Daraja STK Push passkey.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  passkey!: string;

  // ===========================================================================
  // B2C Disbursement Configuration
  // ===========================================================================

  @ApiProperty({
    example: 'your-b2c-initiator-name',
    description: 'Safaricom B2C initiator username.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  initiatorName!: string;

  @ApiProperty({
    example: 'your-encrypted-security-credential',
    description: 'Safaricom-generated RSA-encrypted B2C security credential.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(4096)
  securityCredential!: string;
}

export default ConfigureMpesaRequestDto;
