// -----------------------------------------------------------------------------
// Journey Settlement — Hold Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

/**
 * REST request DTO for placing a Journey Settlement on hold.
 *
 * The DTO represents untrusted transport input.
 *
 * Transport values remain primitives. Construction of the domain
 * JourneySettlementPublicId is delegated to the application/mapper layer.
 */
export class HoldJourneySettlementDto {
  // ===========================================================================
  // Journey Settlement
  // ===========================================================================

  /**
   * Public identity of the Journey Settlement being placed on hold.
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
   * Optional timestamp at which the settlement was placed on hold.
   *
   * If omitted, the aggregate uses the current time.
   */
  @IsOptional()
  @IsDateString()
  heldAt?: string;
}
