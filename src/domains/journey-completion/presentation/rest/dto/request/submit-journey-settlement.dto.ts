// -----------------------------------------------------------------------------
// Journey Settlement — Submit Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request DTO for submitting a Journey Settlement.
 *
 * The DTO represents untrusted transport input.
 *
 * Transport values remain primitives. Construction of the domain
 * JourneySettlementPublicId is delegated to the application/mapper layer.
 */
export class SubmitJourneySettlementDto {
  // ===========================================================================
  // Journey Settlement
  // ===========================================================================

  /**
   * Public identity of the Journey Settlement being submitted.
   */
  @IsUUID()
  @IsNotEmpty()
  journeySettlementPublicId!: string;

  // ===========================================================================
  // Execution Metadata
  // ===========================================================================

  /**
   * Correlation identifier for tracing the application operation.
   */
  @IsString()
  @IsNotEmpty()
  correlationId!: string;

  /**
   * Optional identifier of the command or event that caused this operation.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  causationId?: string;

  /**
   * Optional submission timestamp.
   *
   * If omitted, the domain aggregate uses the current time.
   */
  @IsOptional()
  submittedAt?: Date;
}
