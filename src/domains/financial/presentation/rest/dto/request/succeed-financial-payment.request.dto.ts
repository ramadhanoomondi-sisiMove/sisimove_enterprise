// -----------------------------------------------------------------------------
// Financial Payment — Succeed Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for successfully completing an existing Financial Payment.
//
// The request represents the application intent to transition the Financial
// Payment aggregate into its successful terminal state.
//
// The DTO intentionally contains primitive transport values.
//
// Conversion into domain/application value objects belongs to the
// presentation/application boundary.
//
// The DTO does NOT:
//
// - execute a payment provider;
// - communicate with an external provider;
// - create a Financial Payment Attempt;
// - create or post a Financial Transaction;
// - modify Financial Account balances;
// - perform settlement;
// - perform accounting;
// - expose payment lifecycle state;
// - supply mutable Payment Attempt state.
//
// The Financial Payment aggregate remains responsible for validating that
// the payment can successfully transition.
//
// Provider execution belongs to the integration boundary.
// Financial Transaction creation/posting belongs to the transaction boundary.
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
 * REST request DTO for successfully completing a Financial Payment.
 *
 * Transport values remain primitives at the HTTP boundary.
 *
 * The application boundary converts:
 *
 * - paymentPublicId -> PublicEntityId
 *
 * before constructing SucceedFinancialPaymentCommand.
 *
 * The successful Payment Attempt is intentionally not supplied by the
 * transport request. The aggregate determines whether a valid successful
 * attempt exists before allowing the payment to succeed.
 */
export class SucceedFinancialPaymentDto {
  // ===========================================================================
  // Payment Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Payment to complete successfully.
   *
   * This is the externally meaningful identity of the Financial Payment
   * aggregate.
   *
   * The transport value is converted into PublicEntityId before constructing
   * SucceedFinancialPaymentCommand.
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
   * payment-success request.
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

export default SucceedFinancialPaymentDto;
