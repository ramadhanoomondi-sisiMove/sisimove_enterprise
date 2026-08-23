// -----------------------------------------------------------------------------
// Financial Transaction — Create Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for creating a Financial Transaction aggregate.
//
// Aggregate:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// This DTO intentionally contains primitive transport values.
//
// Conversion into domain value objects belongs to the
// presentation/application boundary.
//
// The DTO does NOT expose:
//
// - Financial Transaction public ID;
// - lifecycle status;
// - createdAt;
// - updatedAt;
// - transaction entries;
// - completedAt;
// - failedAt;
// - cancelledAt;
// - reversedAt;
// - domain events.
//
// Those values belong to the Financial Transaction domain.
//
// Transaction entries are aggregate-owned and are intentionally not created
// through this REST request. They are added through the application/domain
// transaction workflow.
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
 * REST request DTO for creating a Financial Transaction.
 *
 * Transport values remain primitives at the HTTP boundary.
 *
 * The controller/application boundary converts them into:
 *
 * - FinancialTransactionType
 * - Money
 * - FinancialAccountReference
 * - FinancialTransactionReference
 *
 * before constructing CreateFinancialTransactionCommand.
 */
export class CreateFinancialTransactionDto {
  // ===========================================================================
  // Transaction Type
  // ===========================================================================

  /**
   * Business classification of the Financial Transaction.
   *
   * Examples depend on Financial Transaction domain policy.
   */
  @IsString()
  @IsNotEmpty()
  public readonly type!: string;

  // ===========================================================================
  // Amount
  // ===========================================================================

  /**
   * Monetary amount of the Financial Transaction.
   *
   * The transport value is converted into the domain Money value object.
   *
   * The DTO keeps the amount as a string so that monetary precision is not
   * lost during HTTP/JavaScript number handling.
   */
  @IsString()
  @IsNotEmpty()
  public readonly amount!: string;

  // ===========================================================================
  // Currency
  // ===========================================================================

  /**
   * Currency in which the transaction amount is denominated.
   */
  @IsString()
  @IsNotEmpty()
  public readonly currency!: string;

  // ===========================================================================
  // Source Account Reference
  // ===========================================================================

  /**
   * Type of the source Financial Account reference.
   *
   * Examples:
   *
   * - IDENTITY
   * - ORGANIZATION
   * - MERCHANT
   *
   * The value is interpreted by FinancialAccountReference.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly sourceAccountType?: string;

  /**
   * Public identifier of the source Financial Account.
   *
   * This is intentionally an opaque cross-aggregate reference.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly sourceAccountPublicId?: string;

  // ===========================================================================
  // Destination Account Reference
  // ===========================================================================

  /**
   * Type of the destination Financial Account reference.
   *
   * Examples:
   *
   * - IDENTITY
   * - ORGANIZATION
   * - MERCHANT
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly destinationAccountType?: string;

  /**
   * Public identifier of the destination Financial Account.
   *
   * This is intentionally an opaque cross-aggregate reference.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly destinationAccountPublicId?: string;

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  /**
   * Type of business operation associated with the transaction.
   *
   * Examples:
   *
   * - JOURNEY_BOOKING
   * - COMMERCIAL_BOOKING_COMMISSION
   * - SETTLEMENT
   * - DISBURSEMENT
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly referenceType?: string;

  /**
   * Public identifier of the business operation associated with the
   * transaction.
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
   * This is application metadata and is not Financial Transaction entity
   * state.
   */
  @IsString()
  @IsNotEmpty()
  public readonly correlationId!: string;

  // ===========================================================================
  // Causation
  // ===========================================================================

  /**
   * Optional identifier of the command, event, or operation that caused this
   * transaction creation.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateFinancialTransactionDto;
