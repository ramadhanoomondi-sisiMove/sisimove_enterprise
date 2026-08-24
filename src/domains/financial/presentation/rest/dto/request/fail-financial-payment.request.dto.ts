// -----------------------------------------------------------------------------
// Financial Payment — Fail Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for marking an existing Financial Payment as failed.
//
// The request represents the application intent to transition the Financial
// Payment aggregate into its FAILED terminal state.
//
// The DTO intentionally contains primitive transport values.
//
// Conversion into domain/application value objects belongs to the
// presentation/application boundary.
//
// Failure information is intentionally NOT supplied by this DTO.
//
// FinancialPaymentAggregate.fail() remains responsible for deriving applicable
// failure information from the latest Financial Payment Attempt when one is
// available.
//
// This preserves the Financial Payment aggregate as the authoritative source
// of payment lifecycle state and prevents callers from arbitrarily supplying
// failure state.
//
// This DTO does NOT:
//
// - communicate with an external payment provider;
// - execute provider operations;
// - create a Financial Payment Attempt;
// - modify Financial Account balances;
// - create or post a Financial Transaction;
// - retry payment execution;
// - perform settlement;
// - perform accounting;
// - supply failure codes or failure messages;
// - supply mutable Payment Attempt state.
//
// Provider communication belongs to the integration boundary.
// Retry orchestration belongs to the application/orchestration boundary.
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
 * REST request DTO for marking a Financial Payment as failed.
 *
 * Transport values remain primitives at the HTTP boundary.
 *
 * The application boundary converts:
 *
 * - paymentPublicId -> PublicEntityId
 *
 * before constructing FailFinancialPaymentCommand.
 *
 * Failure information is intentionally absent from the request. The
 * FinancialPaymentAggregate determines the applicable failure information
 * from its latest Payment Attempt when available.
 */
export class FailFinancialPaymentDto {
  // ===========================================================================
  // Payment Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Payment to mark as failed.
   *
   * This is the externally meaningful identity of the Financial Payment
   * aggregate.
   *
   * The transport value is converted into PublicEntityId before constructing
   * FailFinancialPaymentCommand.
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
   * payment-failure request.
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

export default FailFinancialPaymentDto;
