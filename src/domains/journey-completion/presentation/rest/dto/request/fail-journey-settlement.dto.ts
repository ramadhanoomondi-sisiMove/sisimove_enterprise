// -----------------------------------------------------------------------------
// Journey Settlement — Fail Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request DTO for failing a Journey Settlement.
 *
 * The Journey Settlement public identity is supplied through the route.
 *
 * Transport values remain primitives. Construction of domain value objects
 * is performed at the presentation/application boundary.
 */
export class FailJourneySettlementDto {
  // ===========================================================================
  // Failure Reason
  // ===========================================================================

  /**
   * Reason why the Journey Settlement failed.
   *
   * JourneySettlementFailureReason.create() remains the authoritative
   * domain validator.
   */
  @ApiProperty({
    description: 'Reason why the Journey Settlement failed.',
    example:
      'Financial transaction processing failed because the destination account was unavailable.',
    minLength: 3,
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(1000)
  failureReason!: string;

  // ===========================================================================
  // Correlation ID
  // ===========================================================================

  /**
   * Correlation identifier for tracing the application operation.
   */
  @ApiProperty({
    description:
      'Correlation identifier used for tracing the settlement failure command.',
    example: '9f4a8f1d-6a6e-4c2f-b9e6-1a2f31a8c741',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  correlationId!: string;

  // ===========================================================================
  // Causation ID
  // ===========================================================================

  /**
   * Optional identifier of the command or event that caused this operation.
   */
  @ApiPropertyOptional({
    description:
      'Optional causation identifier for the command or event chain.',
    example: '8e2e3f10-2a8f-45cc-91e8-53cf7d4b1920',
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  causationId?: string;

  // ===========================================================================
  // Failure Timestamp
  // ===========================================================================

  /**
   * Optional timestamp at which the settlement failed.
   *
   * When omitted, the aggregate uses the current time.
   */
  @ApiPropertyOptional({
    description: 'Optional timestamp at which the Journey Settlement failed.',
    example: '2026-08-20T18:30:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  failedAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FailJourneySettlementDto;
