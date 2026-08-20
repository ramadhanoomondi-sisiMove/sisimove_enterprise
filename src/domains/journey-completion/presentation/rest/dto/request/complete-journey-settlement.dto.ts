// -----------------------------------------------------------------------------
// Journey Settlement — Complete Request DTO
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
 * REST request DTO for completing a Journey Settlement.
 *
 * The DTO represents untrusted transport input.
 *
 * Transport values remain primitives. Construction of the domain value
 * objects is delegated to the application/mapper layer.
 */
export class CompleteJourneySettlementDto {
  // ===========================================================================
  // Journey Settlement
  // ===========================================================================

  /**
   * Public identity of the Journey Settlement being completed.
   */
  @IsUUID()
  @IsNotEmpty()
  journeySettlementPublicId!: string;

  // ===========================================================================
  // Financial Transaction
  // ===========================================================================

  /**
   * Public identity of the Financial Transaction created for the settlement.
   *
   * The Journey Settlement aggregate requires this reference before it can
   * transition to COMPLETED.
   */
  @IsUUID()
  @IsNotEmpty()
  financialTransactionPublicId!: string;

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
   * Optional timestamp at which the settlement completed.
   *
   * If omitted, the aggregate uses the current time.
   */
  @IsOptional()
  @IsDateString()
  completedAt?: string;
}
