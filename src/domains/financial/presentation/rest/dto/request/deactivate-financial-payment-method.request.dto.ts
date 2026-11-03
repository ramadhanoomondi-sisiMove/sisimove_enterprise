// -----------------------------------------------------------------------------
// Financial Payment Method — Deactivate Request DTO
// -----------------------------------------------------------------------------
//
// REST request DTO for deactivating a Financial Payment Method aggregate.
//
// The payment method identity is supplied by the URL path parameter, not by
// the request body. The controller must read it from @Param('paymentMethodPublicId')
// and pass it separately to the application command.
//
// Deactivation is a lifecycle operation. It does NOT delete the payment
// method from the domain or persistence model.
//
// Historical Financial Payments may continue to reference the deactivated
// payment method.
//
// This DTO intentionally contains primitive transport values.
//
// Conversion into domain value objects belongs to the
// presentation/application boundary.
//
// The DTO does NOT expose or accept:
//
// - Financial Payment Method identity (provided by the URL path);
// - Financial Payment Method entity state;
// - Financial Account state;
// - lifecycle status;
// - provider credentials;
// - payment credentials;
// - createdAt;
// - updatedAt;
// - domain events.
//
// The FinancialPaymentMethodAggregate remains responsible for:
//
// - validating that the payment method is currently active;
// - deactivating the payment method;
// - enforcing the inactive/default invariant;
// - emitting FinancialPaymentMethodDeactivatedEvent.
//
// This request does NOT:
//
// - Delete the payment method.
// - Delete an external payment instrument.
// - Communicate with an external provider.
// - Cancel existing Financial Payments.
// - Modify Financial Account balances.
// - Execute or reverse Financial Transactions.
// - Persist the aggregate directly.
//
// External provider operations belong to the integration boundary.
// Payment lifecycle operations belong to the Financial Payment boundary.
// Persistence belongs to the repository/infrastructure boundary.
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
 * REST request DTO for deactivating a Financial Payment Method.
 *
 * The paymentMethodPublicId is deliberately not part of this DTO because
 * the endpoint identifies the aggregate through its URL path.
 *
 * The presentation/application boundary converts:
 *
 * - paymentMethodPublicId (URL path parameter) -> FinancialPaymentMethodPublicId
 * - deactivatedAt                         -> Date
 *
 * before constructing DeactivateFinancialPaymentMethodCommand.
 */
export class DeactivateFinancialPaymentMethodDto {
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
   * deactivation operation.
   */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  public readonly causationId?: string;

  // ===========================================================================
  // Deactivation Timestamp
  // ===========================================================================

  /**
   * Optional timestamp at which the payment method should be considered
   * deactivated.
   *
   * The transport representation is an ISO 8601 date-time string.
   *
   * When omitted, the application/domain operation uses the current time.
   */
  @IsOptional()
  @IsDateString()
  public readonly deactivatedAt?: string;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DeactivateFinancialPaymentMethodDto;
