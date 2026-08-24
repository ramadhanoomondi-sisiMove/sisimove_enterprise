// -----------------------------------------------------------------------------
// Financial Payment Method — Set Default Command
// -----------------------------------------------------------------------------
//
// Application command for designating a Financial Payment Method as the
// default payment method for its owning Financial Account.
//
// The command carries the identity of the Financial Payment Method aggregate
// that should become default.
//
// The FinancialPaymentMethodAggregate is responsible for:
// - validating that the method can become default;
// - changing its own default state;
// - emitting FinancialPaymentMethodDefaultedEvent.
//
// The FinancialPaymentMethodAggregate does NOT mutate sibling payment
// methods.
//
// The account-level invariant:
//
//     one account -> at most one default payment method
//
// is therefore coordinated by the application/domain service boundary.
//
// This command does NOT:
//
// - Execute a payment.
// - Communicate with an external provider.
// - Modify Financial Account balances.
// - Move money.
// - Directly deactivate another payment method.
// - Persist the aggregate.
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
 * Command for setting a Financial Payment Method as the default method.
 *
 * The command identifies the payment-method aggregate whose default state
 * should be changed.
 *
 * The application layer is responsible for coordinating the owning
 * Financial Account's single-default invariant before or as part of
 * executing this command.
 */
export class SetDefaultFinancialPaymentMethodCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Payment Method aggregate that should
     * become the default method.
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
     * Timestamp at which the default designation should take effect.
     *
     * When omitted, the application handler/domain operation uses the
     * current time.
     */
    public readonly defaultedAt?: Date,
  ) {}
}
