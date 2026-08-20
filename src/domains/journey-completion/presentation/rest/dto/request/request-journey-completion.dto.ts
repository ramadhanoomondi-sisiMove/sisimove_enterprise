// -----------------------------------------------------------------------------
// Journey Completion — Request Completion DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for requesting Journey Completion.
 *
 * The Journey Completion public identity is supplied separately by the
 * route parameter and therefore is intentionally not part of this DTO.
 *
 * The lifecycle transition itself belongs to JourneyCompletionAggregate.
 */
export class RequestJourneyCompletionDto {
  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier used for distributed tracing and domain-event
   * correlation.
   */
  @IsString()
  @IsNotEmpty()
  public readonly correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command or event that caused this operation.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;

  // ===========================================================================
  // Requested At
  // ===========================================================================

  /**
   * Optional request timestamp.
   *
   * When omitted, JourneyCompletionAggregate.request() uses the current time.
   */
  @IsOptional()
  @IsDateString()
  public readonly requestedAt?: string;
}
