// -----------------------------------------------------------------------------
// Financial Payment Provider — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating a Financial Payment Provider.
//
// Transport-level validation only. Domain value objects and aggregate
// invariants remain the responsibility of the application/domain boundary.
// -----------------------------------------------------------------------------

// NestJS Swagger
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// Class Transformer
import { Transform, type TransformFnParams } from 'class-transformer';

// Class Validator
import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class CreateFinancialPaymentProviderRequestDto {
  // ===========================================================================
  // Provider Code
  // ===========================================================================

  @ApiProperty({
    example: 'MPESA_KE',
    description:
      'Unique business code for the payment provider. Letters, numbers, underscores, and hyphens are supported.',
    maxLength: 50,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9]+(?:[_-][A-Za-z0-9]+)*$/, {
    message:
      'code must contain only letters, numbers, underscores, or hyphens, with no consecutive separators.',
  })
  code!: string;

  // ===========================================================================
  // Provider Name
  // ===========================================================================

  @ApiProperty({
    example: 'M-Pesa Kenya',
    description: 'Display name of the payment provider.',
    maxLength: 120,
  })
  @Transform(trimString)
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  // ===========================================================================
  // Provider Type
  // ===========================================================================

  @ApiProperty({
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
  @IsIn([
    'MOBILE_MONEY',
    'BANK',
    'CARD_PROCESSOR',
    'PAYMENT_GATEWAY',
    'DIGITAL_WALLET',
    'OTHER',
  ])
  type!: string;

  // ===========================================================================
  // Environment
  // ===========================================================================

  @ApiProperty({
    example: 'SANDBOX',
    enum: ['SANDBOX', 'PRODUCTION'],
    description: 'Environment in which the provider is configured.',
  })
  @Transform(trimString)
  @IsIn(['SANDBOX', 'PRODUCTION'])
  environment!: string;

  // ===========================================================================
  // Description
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'Mobile money payment provider for Kenya.',
    maxLength: 500,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  // ===========================================================================
  // Configuration Reference
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'secret-manager/financial/mpesa-ke',
    description:
      'Reference to securely stored provider configuration. Do not submit raw credentials or secret values.',
    maxLength: 255,
    nullable: true,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  configurationReference?: string;
}

// Default Export
export default CreateFinancialPaymentProviderRequestDto;
