// -----------------------------------------------------------------------------
// Journey Completion — Cancel Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS / Swagger
// -----------------------------------------------------------------------------

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsISO8601,
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
 * REST request DTO for cancelling a Journey Completion.
 *
 * The Journey Completion public identity is supplied through the route
 * parameter.
 *
 * The DTO represents untrusted transport input and therefore contains
 * primitive values only.
 *
 * Domain value objects are constructed by the presentation/application
 * boundary before creating CancelJourneyCompletionCommand.
 */
export class CancelJourneyCompletionDto {
  // ===========================================================================
  // Correlation ID
  // ===========================================================================

  /**
   * Application correlation identifier.
   */
  @ApiProperty({
    description:
      'Correlation identifier used for tracing the cancellation command.',
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
  // Cancellation Timestamp
  // ===========================================================================

  /**
   * Optional timestamp supplied by the caller.
   *
   * The controller/application boundary converts this ISO-8601 transport
   * value into a Date before constructing CancelJourneyCompletionCommand.
   *
   * When omitted, the aggregate uses the current time.
   */
  @ApiPropertyOptional({
    description:
      'Optional timestamp at which the Journey Completion was cancelled.',
    example: '2026-08-20T17:30:00.000Z',
  })
  @IsOptional()
  @IsISO8601()
  cancelledAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CancelJourneyCompletionDto;
