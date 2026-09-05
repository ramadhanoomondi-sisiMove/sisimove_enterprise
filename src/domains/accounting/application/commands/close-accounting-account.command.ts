// -----------------------------------------------------------------------------
// Accounting — Close Accounting Account Command
// -----------------------------------------------------------------------------
//
// Application command for closing an existing Accounting Account.
//
// User-facing intent:
//
//     Close Accounting Account
//
// Lifecycle:
//
//     ACTIVE   → CLOSED
//     INACTIVE → CLOSED
//
// CLOSED is terminal.
//
// The actual lifecycle invariant belongs to AccountingAccountEntity.
//
// AccountingAccountAggregate coordinates the transition and records the
// AccountingAccountClosedEvent after the entity transition succeeds.
//
// Closing an account does not modify historical journal lines.
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
 * Command for closing an Accounting Account.
 *
 * The application handler is responsible for:
 *
 *     command
 *        ↓
 *     repository.findByPublicId()
 *        ↓
 *     aggregate.close()
 *        ↓
 *     repository.save()
 */
export class CloseAccountingAccountCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Accounting Account to close.
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

export default CloseAccountingAccountCommand;
