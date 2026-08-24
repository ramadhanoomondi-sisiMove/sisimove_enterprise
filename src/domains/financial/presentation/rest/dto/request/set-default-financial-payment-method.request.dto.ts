// -----------------------------------------------------------------------------
// Financial Payment Method — Set Default Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for designating a Financial Payment Method as the default
// payment method for its owning Financial Account.
//
// This DTO intentionally contains primitive transport values.
//
// Conversion into domain value objects belongs to the
// presentation/application boundary.
//
// The DTO does NOT expose or accept:
//
// - Financial Payment Method entity state;
// - account balances;
// - provider credentials;
// - payment credentials;
// - lifecycle status;
// - createdAt;
// - updatedAt;
// - domain events.
//
// The FinancialPaymentMethodAggregate remains responsible for validating
// whether the payment method can become the default method.
//
// The application/domain service is responsible for coordinating the
// Financial Account-level invariant:
//
//     one account -> at most one default payment method
//
// This request does NOT:
//
// - Execute a payment.
// - Communicate with an external provider.
// - Move money.
// - Modify Financial Account balances.
// - Deactivate another payment method directly.
// - Persist the aggregate directly.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Validation
// -----------------------------------------------------------------------------

import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

// -----------------------------------------------------------------------------
// DTO
// -----------------------------------------------------------------------------

/**
 * REST request DTO for setting a Financial Payment Method as the default
 * payment method.
 *
 * Transport values remain primitives at the HTTP boundary.
 *
 * The presentation/application boundary converts:
 *
 * - paymentMethodPublicId -> FinancialPaymentMethodPublicId
 * - defaultedAt           -> Date
 *
 * before constructing SetDefaultFinancialPaymentMethodCommand.
 */
export class SetDefaultFinancialPaymentMethodDto {
  // ===========================================================================
  // Payment Method Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Payment Method aggregate that should
   * become the default payment method.
   *
   * This is an opaque public identity and is converted into the corresponding
   * FinancialPaymentMethodPublicId value object before the command is created.
   */
  @IsString()
  @IsNotEmpty()
  public readonly paymentMethodPublicId!: string;

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
   * default-payment-method operation.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;

  // ===========================================================================
  // Default Timestamp
  // ===========================================================================

  /**
   * Optional timestamp at which the payment method should become the default.
   *
   * The transport representation is an ISO 8601 date-time string.
   *
   * When omitted, the application/domain operation uses the current time.
   */
  @IsOptional()
  @IsDateString()
  public readonly defaultedAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SetDefaultFinancialPaymentMethodDto;
