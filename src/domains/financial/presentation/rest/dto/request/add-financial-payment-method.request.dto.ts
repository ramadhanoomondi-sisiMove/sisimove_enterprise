// -----------------------------------------------------------------------------
// Financial Payment Method — Add Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for adding a Financial Payment Method.
//
// The request represents the intent to create and add a Financial Payment
// Method for a Financial Account.
//
// The DTO intentionally contains primitive transport values.
//
// Conversion into domain value objects belongs to the
// presentation/application boundary.
//
// A newly added Financial Payment Method consists of:
//
// FinancialPaymentMethodAggregate
// └── FinancialPaymentMethodEntity
//
// The initial active lifecycle state is determined by the domain creation
// policy and is therefore intentionally NOT supplied by this request.
//
// The initial default designation may be supplied because default selection
// is part of the creation intent. The account-level invariant:
//
//     one account -> at most one default payment method
//
// must be coordinated by the appropriate application/domain service boundary.
//
// This DTO does NOT:
//
// - execute external provider APIs;
// - communicate with a payment provider;
// - store raw payment credentials;
// - store card numbers, bank credentials, PINs, CVVs, or secrets;
// - execute a payment;
// - modify Financial Account balances;
// - select a method for an existing Financial Payment;
// - expose internal entity identifiers;
// - expose lifecycle state;
// - persist the aggregate directly.
//
// Provider interaction belongs to the integration boundary.
// Payment execution belongs to the Financial Payment boundary.
// Persistence belongs to the repository/infrastructure boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for adding a Financial Payment Method.
 *
 * Transport values remain primitives at the HTTP boundary.
 *
 * The application boundary converts the primitive values into the domain
 * value objects required by AddFinancialPaymentMethodCommand:
 *
 * - accountId -> FinancialAccountPublicId
 * - type -> FinancialPaymentMethodType
 * - provider -> FinancialProvider
 * - providerReference -> FinancialProviderReference
 *
 * No sensitive payment credentials are accepted by this DTO.
 */
export class AddFinancialPaymentMethodDto {
  // ===========================================================================
  // Financial Account
  // ===========================================================================

  /**
   * Public identity of the Financial Account that owns the payment method.
   *
   * This is an opaque cross-aggregate reference.
   *
   * The transport value is converted into FinancialAccountPublicId before
   * constructing AddFinancialPaymentMethodCommand.
   */
  @IsString()
  @IsNotEmpty()
  public readonly accountId!: string;

  // ===========================================================================
  // Payment Method Type
  // ===========================================================================

  /**
   * Classification of the payment method.
   *
   * Examples may include:
   *
   * - CARD
   * - BANK_ACCOUNT
   * - MOBILE_MONEY
   *
   * The supplied value is converted into FinancialPaymentMethodType at the
   * application boundary.
   */
  @IsString()
  @IsNotEmpty()
  public readonly type!: string;

  // ===========================================================================
  // Provider
  // ===========================================================================

  /**
   * External provider responsible for the payment method.
   *
   * The supplied value is converted into FinancialProvider at the application
   * boundary.
   */
  @IsString()
  @IsNotEmpty()
  public readonly provider!: string;

  // ===========================================================================
  // Provider Reference
  // ===========================================================================

  /**
   * Optional safe provider-issued reference.
   *
   * This value must never contain:
   *
   * - raw card numbers;
   * - bank credentials;
   * - PINs;
   * - CVVs;
   * - passwords;
   * - authentication secrets;
   * - access tokens.
   *
   * The supplied value is converted into FinancialProviderReference at the
   * application boundary.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly providerReference?: string;

  // ===========================================================================
  // Display Name
  // ===========================================================================

  /**
   * Optional safe human-readable name for displaying the payment method.
   *
   * Examples:
   *
   * - My Visa
   * - Main M-Pesa
   * - Business Bank
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly displayName?: string;

  // ===========================================================================
  // Masked Identifier
  // ===========================================================================

  /**
   * Optional masked identifier suffix.
   *
   * Example:
   *
   * - last four digits of a card;
   * - safe account identifier suffix.
   *
   * Only a non-sensitive suffix is permitted. Full payment credentials must
   * never be supplied through this field.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly lastFour?: string;

  // ===========================================================================
  // Default Designation
  // ===========================================================================

  /**
   * Whether the newly added payment method should initially be designated as
   * the account's default method.
   *
   * The account-level single-default invariant must be coordinated by the
   * appropriate application/domain service boundary.
   */
  @IsOptional()
  @IsBoolean()
  public readonly isDefault?: boolean;

  // ===========================================================================
  // Correlation
  // ===========================================================================

  /**
   * Correlation identifier for distributed tracing and domain-event
   * correlation.
   *
   * This is application metadata and is not Financial Payment Method entity
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
   * payment-method creation request.
   *
   * This is application metadata and is not Financial Payment Method entity
   * state.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AddFinancialPaymentMethodDto;
