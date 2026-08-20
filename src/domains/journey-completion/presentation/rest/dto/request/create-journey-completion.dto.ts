// -----------------------------------------------------------------------------
// Journey Completion — Create Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for creating a Journey Completion.
 *
 * This DTO intentionally contains primitive transport values.
 *
 * Conversion into Journey Completion value objects belongs to the application
 * boundary and must not be performed inside the domain entity or aggregate.
 *
 * The DTO does not expose:
 *
 * - completion public ID;
 * - lifecycle status;
 * - confirmation collection;
 * - confirmed count;
 * - dispute collection;
 * - lifecycle timestamps.
 *
 * Those values are owned by the Journey Completion domain.
 */
export class CreateJourneyCompletionDto {
  // ===========================================================================
  // Journey
  // ===========================================================================

  @IsString()
  @IsNotEmpty()
  public readonly journeyPublicId!: string;

  // ===========================================================================
  // Provider
  // ===========================================================================

  @IsString()
  @IsNotEmpty()
  public readonly providerPublicId!: string;

  // ===========================================================================
  // Required Confirmations
  // ===========================================================================

  /**
   * Number of active confirmations required before the Journey Completion
   * can transition to CONFIRMED.
   */
  @IsInt()
  @Min(1)
  public readonly requiredConfirmations!: number;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for distributed tracing and domain-event
   * correlation.
   *
   * This is supplied by the application/request boundary rather than being
   * persisted as part of the Journey Completion entity.
   */
  @IsString()
  @IsNotEmpty()
  public readonly correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command/event that caused this operation.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}
