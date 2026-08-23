// -----------------------------------------------------------------------------
// Financial Transaction — Cancel Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for cancelling an existing Financial Transaction aggregate.
//
// Cancellation is a terminal lifecycle transition from:
//
//   PENDING → CANCELLED
//
// The DTO intentionally contains primitive transport values.
//
// The application boundary is responsible for converting the transaction
// public identifier into the domain FinancialTransactionPublicId value object.
//
// The DTO does NOT expose:
//
// - transaction status;
// - transaction amount;
// - transaction entries;
// - source account;
// - destination account;
// - cancellation timestamp;
// - domain events.
//
// The FinancialTransactionAggregate determines whether cancellation is
// permitted.
//
// Required inputs:
//
// - transaction public identifier
// - correlation identifier
//
// Optional inputs:
//
// - cancellation reason
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
 * REST request DTO for cancelling a Financial Transaction.
 *
 * Transport values remain primitive and are converted into domain-ready
 * values at the application boundary.
 */
export class CancelFinancialTransactionDto {
  // ===========================================================================
  // Financial Transaction
  // ===========================================================================

  /**
   * Public identifier of the Financial Transaction to cancel.
   *
   * The application layer converts this string into a
   * FinancialTransactionPublicId value object.
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
  // Cancellation Reason
  // ===========================================================================

  /**
   * Optional business reason for the cancellation.
   *
   * The reason is informational and does not determine whether cancellation
   * is permitted.
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
   * cancellation request.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CancelFinancialTransactionDto;
