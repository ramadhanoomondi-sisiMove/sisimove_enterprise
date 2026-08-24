// -----------------------------------------------------------------------------
// Financial Payment Method — Deactivate Command
// -----------------------------------------------------------------------------
//
// Application command for deactivating a Financial Payment Method aggregate.
//
// Deactivation is a lifecycle operation. It does NOT delete the payment
// method from the domain or persistence model.
//
// Historical Financial Payments may continue to reference the deactivated
// payment method.
//
// The FinancialPaymentMethodAggregate is responsible for:
// - validating that the payment method is currently active;
// - deactivating the payment method;
// - enforcing the entity's inactive/default invariant;
// - emitting FinancialPaymentMethodDeactivatedEvent.
//
// This command does NOT:
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
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Financial Value Objects
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodPublicId } from '../../domain/value-objects/financial-payment-method-public-id.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for deactivating a Financial Payment Method.
 *
 * The command identifies the Financial Payment Method aggregate whose
 * lifecycle should transition from active to inactive.
 *
 * The owning Financial Account is intentionally not supplied because the
 * payment-method aggregate already contains the authoritative opaque
 * Financial Account reference.
 */
export class DeactivateFinancialPaymentMethodCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Payment Method aggregate to deactivate.
     */
    public readonly paymentMethodPublicId: FinancialPaymentMethodPublicId,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * command.
     */
    public readonly causationId?: string,

    /**
     * Timestamp at which the payment method should be considered deactivated.
     *
     * When omitted, the application handler/domain operation uses the
     * current time.
     */
    public readonly deactivatedAt?: Date,
  ) {}
}
