// -----------------------------------------------------------------------------
// Financial Payment Provider — Get All Query DTO
// -----------------------------------------------------------------------------
//
// REST query DTO for retrieving Financial Payment Providers.
//
// Transport-level validation only. Filtering and retrieval are handled by the
// application/query layer.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Swagger
// -----------------------------------------------------------------------------

import { ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Class Transformer
// -----------------------------------------------------------------------------

import { Transform, type TransformFnParams } from 'class-transformer';

// -----------------------------------------------------------------------------
// Class Validator
// -----------------------------------------------------------------------------

import { IsBoolean, IsIn, IsOptional } from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class GetFinancialPaymentProvidersQueryDto {
  // ===========================================================================
  // Provider Type
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'MOBILE_MONEY',
    enum: [
      'MOBILE_MONEY',
      'BANK',
      'CARD_PROCESSOR',
      'PAYMENT_GATEWAY',
      'DIGITAL_WALLET',
      'OTHER',
    ],
  })
  @Transform(trimString)
  @IsOptional()
  @IsIn([
    'MOBILE_MONEY',
    'BANK',
    'CARD_PROCESSOR',
    'PAYMENT_GATEWAY',
    'DIGITAL_WALLET',
    'OTHER',
  ])
  type?: string;

  // ===========================================================================
  // Integration Status
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'READY',
    enum: ['NOT_CONFIGURED', 'CONFIGURING', 'READY', 'DEGRADED', 'SUSPENDED'],
  })
  @Transform(trimString)
  @IsOptional()
  @IsIn(['NOT_CONFIGURED', 'CONFIGURING', 'READY', 'DEGRADED', 'SUSPENDED'])
  status?: string;

  // ===========================================================================
  // Environment
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'SANDBOX',
    enum: ['SANDBOX', 'PRODUCTION'],
  })
  @Transform(trimString)
  @IsOptional()
  @IsIn(['SANDBOX', 'PRODUCTION'])
  environment?: string;

  // ===========================================================================
  // Operational State
  // ===========================================================================

  @ApiPropertyOptional({
    example: true,
    description:
      'When supplied, filters providers by whether they are currently operational.',
    type: Boolean,
  })
  @Transform(({ value }: TransformFnParams): unknown => {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();

      if (normalized === 'true') {
        return true;
      }

      if (normalized === 'false') {
        return false;
      }
    }

    return value;
  })
  @IsOptional()
  @IsBoolean()
  operational?: boolean;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetFinancialPaymentProvidersQueryDto;
