// -----------------------------------------------------------------------------
// Financial Transaction — Complete Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for completing an existing Financial Transaction aggregate.
//
// Completion is a lifecycle transition from:
//
//   PENDING → COMPLETED
//
// The DTO intentionally contains only transport-level primitive values.
//
// The DTO does NOT expose:
//
// - transaction status;
// - transaction amount;
// - transaction entries;
// - source account;
// - destination account;
// - completion timestamp;
// - domain events.
//
// The FinancialTransactionAggregate remains responsible for validating all
// completion invariants.
//
// Required inputs:
//
// - transaction public identifier
// - correlation identifier
//
// Optional input:
//
// - causation identifier
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for completing a Financial Transaction.
 *
 * Transport values remain primitive and are converted into domain-ready
 * values at the application boundary.
 */
export class CompleteFinancialTransactionDto {
  // ===========================================================================
  // Financial Transaction
  // ===========================================================================

  /**
   * Public identifier of the Financial Transaction to complete.
   *
   * This identifies the existing transaction aggregate.
   */
  @IsString()
  @IsNotEmpty()
  public readonly transactionPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for distributed tracing and domain-event
   * correlation.
   */
  @IsString()
  @IsNotEmpty()
  public readonly correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or operation that caused this
   * completion request.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CompleteFinancialTransactionDto;
