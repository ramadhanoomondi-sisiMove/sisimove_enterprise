import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Transform, type TransformFnParams } from 'class-transformer';

import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

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
// - C2B Customer Payments
// - B2C Disbursement
//
// Shared Daraja OAuth authentication is used across integrations.
//
// STK Push, C2B and B2C have independently configurable shortcodes.
//
// C2B business type must be explicitly selected:
// - PAYBILL
// - BUY_GOODS
//
// C2B configuration is optional.
// B2C configuration is optional. When supplied, all B2C fields
// must be provided together.
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
  // STK Push Configuration
  // ===========================================================================

  @ApiProperty({
    example: '174379',
    description: 'M-PESA business shortcode used for STK Push.',
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
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  passkey!: string;

  // ===========================================================================
  // C2B Customer Payment Configuration — Optional
  // ===========================================================================

  @ApiPropertyOptional({
    example: '600000',
    description: 'M-PESA shortcode used for C2B customer payments.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  c2bShortcode?: string;

  @ApiPropertyOptional({
    example: 'PAYBILL',
    enum: ['PAYBILL', 'BUY_GOODS'],
    description:
      'C2B business type. Use PAYBILL for PayBill payments or BUY_GOODS for Buy Goods/Till payments.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsIn(['PAYBILL', 'BUY_GOODS'])
  c2bBusinessType?: string;

  // ===========================================================================
  // B2C Disbursement Configuration — Optional
  // ===========================================================================

  @ApiPropertyOptional({
    example: '600992',
    description:
      'B2C Party A shortcode provided in the Daraja B2C credentials.',
  })
  @Transform(trimString)
  @ValidateIf(
    (object: ConfigureMpesaRequestDto) =>
      object.initiatorName !== undefined ||
      object.securityCredential !== undefined ||
      object.b2cShortcode !== undefined,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  b2cShortcode?: string;

  @ApiPropertyOptional({
    example: 'your-b2c-initiator-name',
    description: 'Safaricom B2C initiator username.',
  })
  @Transform(trimString)
  @ValidateIf(
    (object: ConfigureMpesaRequestDto) =>
      object.b2cShortcode !== undefined ||
      object.securityCredential !== undefined ||
      object.initiatorName !== undefined,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  initiatorName?: string;

  @ApiPropertyOptional({
    example: 'your-encrypted-security-credential',
    description: 'Safaricom-generated RSA-encrypted B2C security credential.',
  })
  @Transform(trimString)
  @ValidateIf(
    (object: ConfigureMpesaRequestDto) =>
      object.b2cShortcode !== undefined ||
      object.initiatorName !== undefined ||
      object.securityCredential !== undefined,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(4096)
  securityCredential?: string;
}

export default ConfigureMpesaRequestDto;
