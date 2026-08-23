// -----------------------------------------------------------------------------
// Financial Transaction — Reverse Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for reversing an existing Financial Transaction aggregate.
//
// Reversal is a lifecycle transition from:
//
//   COMPLETED → REVERSED
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
// - reversal timestamp;
// - domain events.
//
// The FinancialTransactionAggregate remains responsible for determining
// whether reversal is permitted.
//
// IMPORTANT:
//
// Reversal does not mutate historical transaction entries.
// The compensating financial movement must be represented by a separate
// Financial Transaction.
//
// Required inputs:
//
// - transaction public identifier
// - correlation identifier
//
// Optional inputs:
//
// - reversal reason
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
 * REST request DTO for reversing a Financial Transaction.
 *
 * Transport values remain primitive and are converted into domain-ready
 * values at the application boundary.
 */
export class ReverseFinancialTransactionDto {
  // ===========================================================================
  // Financial Transaction
  // ===========================================================================

  /**
   * Public identifier of the Financial Transaction to reverse.
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
  // Reversal Reason
  // ===========================================================================

  /**
   * Optional business or technical reason explaining why the transaction
   * is being reversed.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly reason?: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or operation that caused this
   * reversal request.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ReverseFinancialTransactionDto;
