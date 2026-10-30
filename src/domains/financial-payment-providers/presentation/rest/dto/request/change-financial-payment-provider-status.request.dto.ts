// -----------------------------------------------------------------------------
// Financial Payment Provider — Change Status Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for changing a provider's integration status.
//
// The provider public ID is supplied through the route parameter.
// Allowed lifecycle transitions remain the aggregate's responsibility.
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
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Constants
// -----------------------------------------------------------------------------

const FINANCIAL_PAYMENT_PROVIDER_STATUSES = [
  'NOT_CONFIGURED',
  'CONFIGURING',
  'READY',
  'DEGRADED',
  'SUSPENDED',
] as const;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

const trimString = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.trim() : value;

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

export class ChangeFinancialPaymentProviderStatusRequestDto {
  // ===========================================================================
  // Integration Status
  // ===========================================================================

  @ApiProperty({
    example: 'READY',
    description:
      'Requested integration status. The domain aggregate validates whether the transition is allowed.',
    enum: FINANCIAL_PAYMENT_PROVIDER_STATUSES,
  })
  @Transform(trimString)
  @IsString()
  @IsIn(FINANCIAL_PAYMENT_PROVIDER_STATUSES)
  status!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  @ApiPropertyOptional({
    example: 'CMD-01K3R8Y6M4',
    description:
      'Optional identifier of the command or operation that caused this status change.',
    nullable: true,
    maxLength: 128,
  })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(128)
  causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ChangeFinancialPaymentProviderStatusRequestDto;
