// -----------------------------------------------------------------------------
// Accounting — Update Accounting Account Command
// -----------------------------------------------------------------------------
//
// Application command for updating an existing Accounting Account aggregate.
//
// User-facing intent:
//
//     Update Accounting Account
//
// The command identifies the existing aggregate through its public identity.
//
// Mutable Accounting Account state:
//
// - account code;
// - account name;
// - account type;
// - optional parent-account reference.
//
// This command does NOT:
//
// - access Prisma;
// - access repositories directly;
// - modify AccountingAccountEntity directly;
// - modify AccountingAccountAggregate directly;
// - enforce CLOSED-state rules;
// - construct domain events;
// - persist the aggregate;
// - perform authorization.
//
// The application handler loads the aggregate and delegates each mutation
// through AccountingAccountAggregate.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
//     AccountingAccountAggregate
//     └── AccountingAccountEntity
//
// The aggregate already exists when this command begins.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — Application Command
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Foundation — Identity
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Accounting — Domain Value Objects
// -----------------------------------------------------------------------------

import type { AccountingAccountPublicId } from '../../domain/value-objects/accounting-account-public-id.vo';

import type { AccountingAccountCode } from '../../domain/value-objects/accounting-account-code.vo';

import type { AccountingAccountName } from '../../domain/value-objects/accounting-account-name.vo';

import type { AccountingAccountType } from '../../domain/value-objects/accounting-account-type.vo';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for updating an Accounting Account.
 *
 * The application handler is responsible for:
 *
 *     command
 *        ↓
 *     repository.findByPublicId()
 *        ↓
 *     aggregate.changeCode()
 *     aggregate.changeName()
 *     aggregate.changeType()
 *     aggregate.assignParentAccount()
 *     aggregate.removeParentAccount()
 *        ↓
 *     repository.save()
 *
 * Undefined mutable fields mean that the corresponding attribute was not
 * requested for update.
 *
 * `removeParentAccount` explicitly represents removal of the current parent
 * reference because `parentAccountId === undefined` otherwise means
 * "no parent update requested".
 */
export class UpdateAccountingAccountCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Accounting Account to update.
     */
    public readonly publicId: AccountingAccountPublicId,

    /**
     * New Accounting Account code.
     *
     * Undefined means no code change was requested.
     */
    public readonly code: AccountingAccountCode | undefined = undefined,

    /**
     * New Accounting Account name.
     *
     * Undefined means no name change was requested.
     */
    public readonly name: AccountingAccountName | undefined = undefined,

    /**
     * New Accounting Account classification.
     *
     * Undefined means no type change was requested.
     */
    public readonly type: AccountingAccountType | undefined = undefined,

    /**
     * New parent Accounting Account internal identity.
     *
     * Undefined means no parent assignment was requested.
     */
    public readonly parentAccountId: UniqueEntityId | undefined = undefined,

    /**
     * Explicitly removes the current parent-account reference.
     *
     * This is separate from parentAccountId because undefined means that
     * no parent assignment was requested.
     */
    public readonly removeParentAccount: boolean = false,

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

export default UpdateAccountingAccountCommand;
