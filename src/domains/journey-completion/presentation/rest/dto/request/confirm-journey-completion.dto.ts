// -----------------------------------------------------------------------------
// Journey Completion — Confirm DTO
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
 * REST request DTO for confirming a Journey Completion.
 *
 * The Journey Completion public identity is supplied separately by the
 * route parameter and is therefore intentionally not part of this DTO.
 *
 * The aggregate determines whether the required number of active
 * confirmations has been reached.
 */
export class ConfirmJourneyCompletionDto {
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
  // Confirmed At
  // ===========================================================================

  /**
   * Optional confirmation timestamp.
   *
   * When omitted, JourneyCompletionAggregate.confirm() uses the current time.
   */
  @IsOptional()
  @IsDateString()
  public readonly confirmedAt?: string;
}
