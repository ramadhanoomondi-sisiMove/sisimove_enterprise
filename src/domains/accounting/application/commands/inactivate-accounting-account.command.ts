// -----------------------------------------------------------------------------
// Accounting — Inactivate Accounting Account Command
// -----------------------------------------------------------------------------
//
// Application command for inactivating an existing Accounting Account.
//
// User-facing intent:
//
//     Inactivate Accounting Account
//
// Lifecycle:
//
//     ACTIVE → INACTIVE
//
// The actual lifecycle invariant belongs to AccountingAccountEntity.
//
// AccountingAccountAggregate coordinates the transition and records the
// AccountingAccountInactivatedEvent after the entity transition succeeds.
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
 * Command for inactivating an Accounting Account.
 *
 * The application handler is responsible for:
 *
 *     command
 *        ↓
 *     repository.findByPublicId()
 *        ↓
 *     aggregate.inactivate()
 *        ↓
 *     repository.save()
 */
export class InactivateAccountingAccountCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Accounting Account to inactivate.
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

export default InactivateAccountingAccountCommand;
