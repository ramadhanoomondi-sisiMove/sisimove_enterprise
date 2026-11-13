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
// Shared Daraja authentication is used for both integrations.
// STK/C2B and B2C use separate shortcode configuration.
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

  // ===========================================================================
  // STK Push / C2B Shortcode
  // ===========================================================================

  @ApiProperty({
    example: '174379',
    description:
      'M-PESA business shortcode used for STK Push and C2B configuration.',
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
    example: '600992',
    description:
      'B2C Party A shortcode provided in the Daraja B2C test credentials or production configuration.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  b2cShortcode!: string;

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
