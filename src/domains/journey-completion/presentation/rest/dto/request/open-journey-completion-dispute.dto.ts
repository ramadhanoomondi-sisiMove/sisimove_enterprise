// -----------------------------------------------------------------------------
// Journey Completion — Open Dispute Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyCompletionDisputeDescription,
  JourneyCompletionDisputeReason,
} from '../../../../domain/value-objects';

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request DTO for opening a Journey Completion dispute.
 *
 * The Journey Completion public ID is supplied by the route.
 *
 * `raisedByPublicId` may be supplied explicitly, but the controller may
 * fall back to the authenticated member identity.
 *
 * The DTO represents untrusted transport input.
 *
 * Domain validation is delegated to:
 *
 * - JourneyCompletionDisputeReason.create()
 * - JourneyCompletionDisputeDescription.create()
 */
export class OpenJourneyCompletionDisputeDto {
  // ===========================================================================
  // Raised By
  // ===========================================================================

  /**
   * Optional public identity of the member raising the dispute.
   *
   * When omitted, the controller may use the authenticated member identity.
   */
  @ApiPropertyOptional({
    description:
      'Optional public identifier of the member raising the dispute. When omitted, the authenticated member is used.',
    example: 'MEM_01J8XYZ123456789',
    minLength: 1,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  raisedByPublicId?: string;

  // ===========================================================================
  // Reason
  // ===========================================================================

  /**
   * Structured dispute reason.
   *
   * JourneyCompletionDisputeReason.create() performs authoritative
   * domain validation.
   */
  @ApiProperty({
    description: 'Structured reason for opening the dispute.',
    example: 'JOURNEY_NOT_COMPLETED',
    minLength: 1,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  reason!: string;

  // ===========================================================================
  // Description
  // ===========================================================================

  /**
   * Optional additional context explaining the dispute.
   *
   * JourneyCompletionDisputeDescription.create() remains the authoritative
   * domain validator.
   */
  @ApiPropertyOptional({
    description:
      'Optional additional context explaining the circumstances of the dispute.',
    example:
      'The journey ended approximately 40 kilometres before the agreed destination.',
    minLength: 10,
    maxLength: 2000,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  description?: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Application correlation identifier.
   */
  @ApiProperty({
    description: 'Correlation identifier used for tracing the dispute command.',
    example: '9f4a8f1d-6a6e-4c2f-b9e6-1a2f31a8c741',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(100)
  correlationId!: string;

  // ===========================================================================
  // Causation
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
  // Domain Conversion
  // ===========================================================================

  /**
   * Converts transport values into validated domain value objects.
   *
   * `undefined` description is intentionally omitted from the returned object
   * so exactOptionalPropertyTypes remains satisfied.
   */
  public toDomainValues(): {
    reason: JourneyCompletionDisputeReason;
    description?: JourneyCompletionDisputeDescription;
  } {
    const reason = JourneyCompletionDisputeReason.create(this.reason);

    if (this.description === undefined) {
      return {
        reason,
      };
    }

    const description = JourneyCompletionDisputeDescription.create(
      this.description,
    );

    return {
      reason,
      description,
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default OpenJourneyCompletionDisputeDto;
