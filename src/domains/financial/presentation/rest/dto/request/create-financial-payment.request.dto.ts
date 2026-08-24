// -----------------------------------------------------------------------------
// Financial Payment — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating a Financial Payment aggregate.
//
// Aggregate:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// This DTO intentionally contains primitive transport values.
//
// Conversion into domain value objects belongs to the
// presentation/application boundary.
//
// The DTO does NOT expose:
//
// - Financial Payment public ID;
// - lifecycle status;
// - payment attempts;
// - provider information;
// - provider references;
// - transaction public ID;
// - createdAt;
// - updatedAt;
// - initiatedAt;
// - completedAt;
// - failedAt;
// - cancelledAt;
// - domain events.
//
// Payment attempts are intentionally NOT created through this request.
// A payment attempt represents an actual provider execution and belongs to
// the subsequent payment execution workflow.
//
// This request establishes payment intent only.
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
 * REST request DTO for creating a Financial Payment.
 *
 * Transport values remain primitives at the HTTP boundary.
 *
 * The controller/application boundary converts them into:
 *
 * - PublicEntityId
 * - Money
 * - FinancialPaymentMethodPublicId
 * - FinancialReferenceType
 * - FinancialReferencePublicId
 *
 * before constructing CreateFinancialPaymentCommand.
 */
export class CreateFinancialPaymentDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  /**
   * Public identity of the Financial Account receiving the payment.
   *
   * This is an opaque cross-aggregate reference.
   *
   * The DTO intentionally does not accept an internal Financial Account
   * entity ID.
   */
  @IsString()
  @IsNotEmpty()
  public readonly accountId!: string;

  // ===========================================================================
  // Amount
  // ===========================================================================

  /**
   * Monetary amount of the Financial Payment.
   *
   * The transport value is kept as a string so that monetary precision is not
   * lost during HTTP/JavaScript number handling.
   *
   * The application boundary converts this value into the domain Money
   * value object.
   */
  @IsString()
  @IsNotEmpty()
  public readonly amount!: string;

  // ===========================================================================
  // Currency
  // ===========================================================================

  /**
   * ISO 4217 currency code in which the payment amount is denominated.
   *
   * Examples:
   *
   * - KES
   * - UGX
   * - TZS
   * - RWF
   * - USD
   * - EUR
   *
   * The application boundary converts this primitive value into the
   * Currency value object before constructing Money.
   */
  @IsString()
  @IsNotEmpty()
  public readonly currency!: string;

  // ===========================================================================
  // Payment Method
  // ===========================================================================

  /**
   * Optional public identity of the Financial Payment Method selected for
   * this payment.
   *
   * This is an opaque cross-aggregate reference.
   *
   * The DTO does not accept provider credentials, card details, mobile-money
   * credentials, tokens, or other payment-sensitive information.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly methodId?: string;

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  /**
   * Optional type of the originating business operation.
   *
   * Examples depend on Financial Reference Type policy:
   *
   * - JOURNEY_BOOKING
   * - COMMERCIAL_BOOKING
   * - WALLET_TOP_UP
   * - DISBURSEMENT
   * - SETTLEMENT
   *
   * The value is converted into FinancialReferenceType at the
   * application boundary.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly referenceType?: string;

  /**
   * Optional public identity of the originating business operation.
   *
   * This is an opaque cross-aggregate reference.
   *
   * When supplied, referenceType and referencePublicId must be supplied
   * together by the application/domain boundary.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly referencePublicId?: string;

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
   * Financial Payment creation.
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

export default CreateFinancialPaymentDto;
