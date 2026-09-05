// -----------------------------------------------------------------------------
// Accounting — Close Accounting Period Command
// -----------------------------------------------------------------------------
//
// Application command for closing an existing Accounting Period aggregate.
//
// User-facing intent:
//
//     Close Accounting Period
//
// Lifecycle:
//
//     OPEN → CLOSED
//
// CLOSED is terminal.
//
// The command identifies the existing aggregate through its public identity.
//
// The AccountingPeriodAggregate coordinates the lifecycle transition and
// records AccountingPeriodClosedEvent after the entity transition succeeds.
//
// This command does NOT:
//
// - access Prisma;
// - access repositories directly;
// - modify AccountingPeriodEntity directly;
// - implement lifecycle rules;
// - determine whether journals remain outstanding;
// - validate journal aggregates;
// - construct domain events;
// - persist the aggregate;
// - perform authorization.
//
// Cross-aggregate validation belongs to the application/domain workflow.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — Application Command
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Accounting — Domain Value Objects
// -----------------------------------------------------------------------------

import type { AccountingPeriodPublicId } from '../../domain/value-objects/accounting-period-public-id.vo';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for closing an Accounting Period.
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
 *
 * The aggregate/entity remains responsible for enforcing:
 *
 * - OPEN → CLOSED lifecycle;
 * - CLOSED terminality;
 * - valid closing timestamp;
 * - closing timestamp not before period start;
 * - closing timestamp not before creation timestamp.
 */
export class CloseAccountingPeriodCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Accounting Period to close.
     */
    public readonly publicId: AccountingPeriodPublicId,

    /**
     * Closing timestamp.
     *
     * When omitted, the application handler may allow the aggregate to use
     * its default current timestamp.
     */
    public readonly closedAt: Date | undefined = undefined,

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

export default CloseAccountingPeriodCommand;
