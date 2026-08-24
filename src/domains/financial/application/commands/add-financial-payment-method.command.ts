// -----------------------------------------------------------------------------
// Financial Payment Method — Add Command
// -----------------------------------------------------------------------------
//
// Application command for adding a Financial Payment Method aggregate.
//
// The command represents the intent to create and add a Financial Payment
// Method for a Financial Account.
//
// The command carries domain-ready value objects rather than raw transport
// values.
//
// DTO-to-domain conversion belongs to the presentation/application boundary.
//
// A newly added Financial Payment Method consists of:
//
// FinancialPaymentMethodAggregate
// └── FinancialPaymentMethodEntity
//
// This command establishes the initial payment-method information required by
// the entity factory.
//
// The initial active lifecycle state is determined by the domain creation
// policy and is therefore intentionally NOT supplied by the command.
//
// The initial default designation may be supplied because default selection
// is part of the creation intent. However, the Financial Account-level
// invariant:
//
//     one account -> at most one default payment method
//
// is a cross-aggregate concern and must be coordinated by the appropriate
// application/domain service boundary.
//
// This command does NOT:
//
// - Execute external provider APIs.
// - Communicate with a payment provider.
// - Store raw payment credentials.
// - Store card numbers, bank credentials, PINs, CVVs, or secrets.
// - Execute a payment.
// - Modify Financial Account balances.
// - Select a method for an existing Financial Payment.
// - Persist the aggregate directly.
//
// Provider interaction belongs to the integration boundary.
// Payment execution belongs to the Financial Payment boundary.
// Persistence belongs to the repository/infrastructure boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Foundation Value Objects
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Financial Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../../domain/value-objects/financial-account-public-id.vo';

import type { FinancialPaymentMethodType } from '../../domain/value-objects/financial-payment-method-type.vo';

import type { FinancialProvider } from '../../domain/value-objects/financial-provider.vo';

import type { FinancialProviderReference } from '../../domain/value-objects/financial-provider-reference.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for adding a Financial Payment Method.
 *
 * The command represents the intent to create a complete
 * FinancialPaymentMethodAggregate.
 *
 * Required domain inputs:
 *
 * - accountId
 * - type
 * - provider
 *
 * Optional domain inputs:
 *
 * - providerReference
 * - displayName
 * - lastFour
 * - isDefault
 *
 * The initial active state is intentionally NOT supplied. The domain creation
 * policy determines whether a newly created payment method starts active.
 *
 * No sensitive payment credentials are accepted by this command.
 */
export class AddFinancialPaymentMethodCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Account that owns the payment method.
     *
     * This is an opaque cross-aggregate reference.
     */
    public readonly accountId: FinancialAccountPublicId,

    /**
     * Classification of the payment method.
     *
     * Examples may include card, bank account, mobile money, or another
     * supported payment instrument.
     */
    public readonly type: FinancialPaymentMethodType,

    /**
     * External provider responsible for the payment method.
     */
    public readonly provider: FinancialProvider,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional safe provider-issued reference.
     *
     * This must never contain raw credentials or sensitive authentication
     * material.
     */
    public readonly providerReference?: FinancialProviderReference,

    /**
     * Optional safe human-readable display name.
     */
    public readonly displayName?: string,

    /**
     * Optional masked identifier suffix.
     *
     * Example:
     *
     * - last four digits of a card
     * - safe account identifier suffix
     */
    public readonly lastFour?: string,

    /**
     * Whether the newly added payment method should initially be designated
     * as the account's default method.
     *
     * The application/domain service must coordinate the account-level
     * single-default invariant.
     */
    public readonly isDefault?: boolean,

    /**
     * Optional identifier of the command or operation that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}
