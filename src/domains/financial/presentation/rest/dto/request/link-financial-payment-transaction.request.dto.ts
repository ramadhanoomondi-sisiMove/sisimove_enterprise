// -----------------------------------------------------------------------------
// Financial Payment — Link Transaction Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for linking an existing Financial Payment to a Financial
// Transaction.
//
// The request represents the application intent to establish an opaque
// reference from the Financial Payment aggregate to the Financial Transaction
// that represents its resulting financial effect.
//
// FinancialTransaction remains a separate aggregate.
//
// The DTO intentionally contains primitive transport values.
//
// Conversion into domain/application value objects belongs to the
// presentation/application boundary.
//
// This DTO does NOT:
//
// - create a Financial Transaction;
// - post a Financial Transaction;
// - modify Financial Account balances;
// - perform accounting;
// - perform settlement;
// - load or embed the Financial Transaction aggregate;
// - persist either aggregate directly;
// - expose Financial Transaction internal entity identifiers.
//
// Financial Transaction creation and posting belong to the Financial
// Transaction application boundary.
//
// The Financial Payment aggregate stores only the Financial Transaction's
// opaque public identity.
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
 * REST request DTO for linking a Financial Payment to a Financial Transaction.
 *
 * Transport values remain primitives at the HTTP boundary.
 *
 * The application boundary converts:
 *
 * - paymentPublicId -> PublicEntityId
 *
 * before constructing LinkFinancialPaymentTransactionCommand.
 *
 * transactionPublicId remains an opaque cross-aggregate public identity and
 * is therefore transported as a string.
 *
 * The Financial Payment aggregate remains responsible for validating whether
 * the transaction reference can be linked.
 */
export class LinkFinancialPaymentTransactionDto {
  // ===========================================================================
  // Payment Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Payment aggregate.
   *
   * This identifies the payment to which the Financial Transaction reference
   * will be attached.
   *
   * The transport value is converted into PublicEntityId before constructing
   * LinkFinancialPaymentTransactionCommand.
   */
  @IsString()
  @IsNotEmpty()
  public readonly paymentPublicId!: string;

  // ===========================================================================
  // Financial Transaction Reference
  // ===========================================================================

  /**
   * Public identity of the Financial Transaction.
   *
   * This is an opaque cross-aggregate reference.
   *
   * The Financial Transaction aggregate is intentionally not loaded or
   * embedded in this request.
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
   * transaction-linking request.
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

export default LinkFinancialPaymentTransactionDto;
