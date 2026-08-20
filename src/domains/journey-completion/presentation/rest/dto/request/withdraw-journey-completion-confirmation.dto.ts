// -----------------------------------------------------------------------------
// Journey Completion — Withdraw Confirmation Request DTO
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

/**
 * HTTP request DTO for withdrawing a Journey Completion confirmation.
 *
 * This DTO represents the transport boundary only.
 *
 * Primitive request values are converted into domain value objects by the
 * application command handler.
 */
export class WithdrawJourneyCompletionConfirmationDto {
  // ===========================================================================
  // Journey Completion
  // ===========================================================================

  /**
   * Public identity of the Journey Completion aggregate.
   */
  @IsString()
  @IsNotEmpty()
  journeyCompletionPublicId!: string;

  // ===========================================================================
  // Confirmation
  // ===========================================================================

  /**
   * Public identity of the confirmation being withdrawn.
   */
  @IsString()
  @IsNotEmpty()
  confirmationPublicId!: string;

  // ===========================================================================
  // Member
  // ===========================================================================

  /**
   * Public identity of the member requesting the withdrawal.
   */
  @IsString()
  @IsNotEmpty()
  memberPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for distributed tracing.
   */
  @IsString()
  @IsNotEmpty()
  correlationId!: string;

  /**
   * Optional causation identifier for the command/event chain.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  causationId?: string;
}
