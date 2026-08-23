// -----------------------------------------------------------------------------
// Financial Account — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Financial Account aggregate.
//
// The command carries domain-ready value objects rather than raw transport
// values.
//
// DTO-to-domain conversion belongs to the presentation/application boundary.
//
// A newly created Financial Account consists of:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// The balance is created together with the account and therefore is not part
// of this command as a separately addressable aggregate.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  FinancialAccountOwnerPublicId,
  FinancialAccountType,
  Currency,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for creating a Financial Account aggregate.
 *
 * The command represents the intent to create a complete Financial Account
 * aggregate.
 *
 * Required domain inputs:
 *
 * - ownerPublicId
 * - account type
 * - currency
 *
 * The initial lifecycle status is determined by the domain creation policy
 * and is therefore intentionally NOT supplied by the command.
 *
 * The initial balance is also created by the application/domain workflow and
 * starts at zero.
 *
 * Correlation and causation identifiers are carried for application-level
 * tracing and domain-event correlation.
 */
export class CreateFinancialAccountCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the owner.
     *
     * This is an opaque cross-domain reference to Identity.
     */
    public readonly ownerPublicId: FinancialAccountOwnerPublicId,

    /**
     * Classification of the Financial Account.
     *
     * Examples:
     *
     * - USER
     * - PLATFORM
     * - HOLDING
     * - SETTLEMENT
     */
    public readonly type: FinancialAccountType,

    /**
     * Currency in which the account balance is maintained.
     */
    public readonly currency: Currency,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or operation that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}
