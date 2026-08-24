// -----------------------------------------------------------------------------
// Financial Payment — Expire Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for expiring an existing Financial Payment.
//
// The request represents the application intent to transition the Financial
// Payment aggregate into the EXPIRED terminal state.
//
// The DTO intentionally contains primitive transport values.
//
// Conversion into domain/application value objects belongs to the
// presentation/application boundary.
//
// The expiration timestamp is intentionally NOT supplied by the request.
// It is determined by the application/domain operation.
//
// Expiration may be initiated by an application workflow, scheduled process,
// timeout handler, or other orchestration mechanism.
//
// The aggregate remains responsible for enforcing the Financial Payment
// expiration invariants.
//
// Provider-side expiration or cancellation, when required, is handled
// separately by the appropriate integration boundary.
//
// This DTO does NOT:
//
// - communicate directly with an external payment provider;
// - perform provider-side cancellation;
// - modify Financial Account balances;
// - create or post a Financial Transaction;
// - perform settlement;
// - perform accounting;
// - retry the payment;
// - supply lifecycle timestamps;
// - supply Payment Attempt state.
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
 * REST request DTO for expiring a Financial Payment.
 *
 * Transport values remain primitives at the HTTP boundary.
 *
 * The application boundary converts:
 *
 * - paymentPublicId -> PublicEntityId
 *
 * before constructing ExpireFinancialPaymentCommand.
 *
 * The Financial Payment aggregate determines whether expiration is valid and
 * enforces the invariant that an active Payment Attempt must not exist when
 * the payment is expired.
 */
export class ExpireFinancialPaymentDto {
  // ===========================================================================
  // Payment Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Payment to expire.
   *
   * This is the externally meaningful identity of the Financial Payment
   * aggregate.
   *
   * The transport value is converted into PublicEntityId before constructing
   * ExpireFinancialPaymentCommand.
   */
  @IsString()
  @IsNotEmpty()
  public readonly paymentPublicId!: string;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for distributed tracing and domain-event
   * correlation.
   *
   * This is application metadata and is not Financial Payment entity state.
   */
  @IsString()
  @IsNotEmpty()
  public readonly correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or operation that caused this
   * payment-expiration request.
   *
   * This is application metadata and is not Financial Payment entity state.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ExpireFinancialPaymentDto;
