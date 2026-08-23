// -----------------------------------------------------------------------------
// Financial Transaction — Fail Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for failing an existing Financial Transaction aggregate.
//
// Failure is a lifecycle transition from:
//
//   PENDING → FAILED
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
// - failure timestamp;
// - domain events.
//
// The FinancialTransactionAggregate remains responsible for determining
// whether the transaction can be failed.
//
// Required inputs:
//
// - transaction public identifier
// - correlation identifier
//
// Optional inputs:
//
// - failure reason
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
 * REST request DTO for failing a Financial Transaction.
 *
 * Transport values remain primitive and are converted into domain-ready
 * values at the application boundary.
 */
export class FailFinancialTransactionDto {
  // ===========================================================================
  // Financial Transaction
  // ===========================================================================

  /**
   * Public identifier of the Financial Transaction to fail.
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
  // Failure Reason
  // ===========================================================================

  /**
   * Optional business or technical reason explaining why the transaction
   * failed.
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
   * failure request.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FailFinancialTransactionDto;
