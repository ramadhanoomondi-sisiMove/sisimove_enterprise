// -----------------------------------------------------------------------------
// Accounting — Activate Accounting Account Command
// -----------------------------------------------------------------------------
//
// Application command for activating an existing Accounting Account.
//
// User-facing intent:
//
//     Activate Accounting Account
//
// Lifecycle:
//
//     INACTIVE → ACTIVE
//
// The actual lifecycle invariant belongs to AccountingAccountEntity.
//
// AccountingAccountAggregate coordinates the transition and records the
// AccountingAccountActivatedEvent after the entity transition succeeds.
//
// This command does NOT:
//
// - access Prisma;
// - access repositories directly;
// - modify the entity directly;
// - implement lifecycle rules;
// - construct domain events;
// - persist the aggregate;
// - perform authorization.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — Application Command
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Accounting — Domain Value Objects
// -----------------------------------------------------------------------------

import type { AccountingAccountPublicId } from '../../domain/value-objects/accounting-account-public-id.vo';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for activating an Accounting Account.
 *
 * The application handler is responsible for:
 *
 *     command
 *        ↓
 *     repository.findByPublicId()
 *        ↓
 *     aggregate.activate()
 *        ↓
 *     repository.save()
 */
export class ActivateAccountingAccountCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Accounting Account to activate.
     */
    public readonly publicId: AccountingAccountPublicId,

    /**
     * Correlation identifier for the complete operation.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command or domain event that caused
     * this operation.
     */
    public readonly causationId?: string,
  ) {}
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ActivateAccountingAccountCommand;
