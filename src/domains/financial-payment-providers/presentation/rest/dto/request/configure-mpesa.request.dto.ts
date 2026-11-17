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
// SisiMove supports exactly TWO M-PESA purposes:
//
// 1. TOP-UP — Customer pays SisiMove.
//    - STK Push
//    - C2B PayBill / Buy Goods
//
// 2. WITHDRAWAL — SisiMove pays a customer's available funds.
//    - B2C
//
// Shared Daraja OAuth authentication is used across integrations.
//
// Configuration:
// - STK Push shortcode and passkey are required.
// - C2B configuration is optional and requires both C2B fields.
// - B2C configuration is optional and requires all three B2C fields.
//
// Security:
// - B2C Security Credential is not the STK Passkey.
// - Credentials must be encrypted before persistence.
// - FinancialModule owns withdrawal authorization and financial effects.
// - M-PESA callbacks report external provider events only.
//
// =============================================================================

export class ConfigureMpesaRequestDto {
  // ===========================================================================
  // Environment
  // ===========================================================================

  @ApiProperty({
    example: 'SANDBOX',
    enum: ['SANDBOX', 'PRODUCTION'],
    description: 'M-PESA Daraja integration environment.',
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
  // STK Push — Customer Top-up
  // ===========================================================================

  @ApiProperty({
    example: '174379',
    description:
      'Daraja business shortcode used to initiate STK Push customer top-ups.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  shortcode!: string;

  @ApiProperty({
    example: 'your-stk-passkey',
    description:
      'Safaricom Daraja STK Push passkey. This is not the B2C security credential.',
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  passkey!: string;

  // ===========================================================================
  // C2B — Customer Top-up Through PayBill or Buy Goods
  // ===========================================================================

  @ApiPropertyOptional({
    example: '600000',
    description:
      'M-PESA shortcode registered for C2B customer top-up payments.',
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
      'C2B payment type: PAYBILL for PayBill or BUY_GOODS for Buy Goods/Till.',
  })
  @Transform(trimString)
  @IsOptional()
  @IsIn(['PAYBILL', 'BUY_GOODS'])
  c2bBusinessType?: string;

  // ===========================================================================
  // B2C — Withdrawal of Customer Available Funds
  // ===========================================================================

  @ApiPropertyOptional({
    example: '600992',
    description:
      'B2C Party A shortcode authorized for customer available-funds withdrawals.',
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
    description:
      'Safaricom RSA-encrypted B2C security credential. Never use the STK Passkey here.',
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
