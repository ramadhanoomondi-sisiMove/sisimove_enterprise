// -----------------------------------------------------------------------------
// Journey Settlement — Process Request DTO
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
 * REST request DTO for marking a Journey Settlement as PROCESSING.
 *
 * The DTO represents untrusted transport input.
 *
 * Transport values remain primitives. Construction of the domain
 * JourneySettlementPublicId is delegated to the application/mapper layer.
 */
export class ProcessJourneySettlementDto {
  // ===========================================================================
  // Journey Settlement
  // ===========================================================================

  /**
   * Public identity of the Journey Settlement being processed.
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
   * Optional timestamp at which financial processing began.
   *
   * If omitted, the aggregate uses the current time.
   */
  @IsOptional()
  @IsDateString()
  processingAt?: string;
}
