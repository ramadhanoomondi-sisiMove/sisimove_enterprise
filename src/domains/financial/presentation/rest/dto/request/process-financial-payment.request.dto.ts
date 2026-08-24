// -----------------------------------------------------------------------------
// Financial Payment — Process Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for processing an existing Financial Payment.
//
// The request represents the intent to transition a Financial Payment
// aggregate into PROCESSING.
//
// The DTO intentionally contains primitive transport values.
//
// Conversion into domain/application value objects belongs to the
// presentation/application boundary.
//
// This DTO does NOT:
//
// - execute a payment provider;
// - create a Financial Payment Attempt;
// - move funds;
// - create a Financial Transaction;
// - modify Financial Account balances;
// - perform settlement;
// - perform accounting;
// - expose payment lifecycle state.
//
// Those responsibilities belong to the appropriate application,
// integration, transaction, settlement, and accounting boundaries.
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
 * REST request DTO for processing a Financial Payment.
 *
 * Transport values remain primitives at the HTTP boundary.
 *
 * The application boundary converts:
 *
 * - paymentPublicId -> PublicEntityId
 *
 * before constructing ProcessFinancialPaymentCommand.
 *
 * The command then requests the Financial Payment aggregate to perform the
 * PROCESSING lifecycle transition.
 */
export class ProcessFinancialPaymentDto {
  // ===========================================================================
  // Payment Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Payment to process.
   *
   * This is the externally meaningful identity of the Financial Payment
   * aggregate.
   *
   * The transport value is converted into PublicEntityId before constructing
   * ProcessFinancialPaymentCommand.
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
   * payment-processing request.
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

export default ProcessFinancialPaymentDto;
