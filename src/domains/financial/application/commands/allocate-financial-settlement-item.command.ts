// -----------------------------------------------------------------------------
// Financial Settlement — Allocate Item Command
// -----------------------------------------------------------------------------
//
// Application command for allocating a Financial Settlement Item.
//
// The command represents the intent to perform Settlement Item allocation
// within an existing Financial Settlement aggregate.
//
// Settlement allocation is an aggregate/domain operation. The
// FinancialSettlementAggregate remains responsible for validating:
//
// - Settlement lifecycle state.
// - Settlement Item ownership.
// - Settlement Item allocation state.
// - Item allocation completeness.
// - Settlement total versus allocated total.
// - Aggregate allocation invariants.
//
// Allocation represents the domain decision that Settlement Items have been
// fully allocated. It does NOT itself move money.
//
// This command does NOT:
//
// - Debit a Financial Account.
// - Credit a Financial Account.
// - Modify Financial Account balances.
// - Create or post a Financial Transaction.
// - Execute a payment.
// - Execute a disbursement.
// - Perform accounting.
// - Communicate with an external financial provider.
//
// Financial Transaction creation/posting and Financial Account balance
// mutation belong to their respective application/domain boundaries.
//
// Correlation and causation identifiers are carried for application-level
// tracing and domain-event correlation.
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
  FinancialSettlementPublicId,
  FinancialSettlementItemPublicId,
} from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for allocating a Financial Settlement Item.
 *
 * The command identifies both the Settlement aggregate and the Settlement
 * Item through their public identities.
 *
 * The expected Item lifecycle transition is:
 *
 *     PENDING → ALLOCATED
 *
 * The Financial Settlement itself remains in PROCESSING.
 *
 * Allocation does not represent a Financial Settlement lifecycle state.
 */
export class AllocateFinancialSettlementItemCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identity of the Financial Settlement containing the Item.
     */
    public readonly settlementPublicId: FinancialSettlementPublicId,

    /**
     * Public identity of the Settlement Item to allocate.
     */
    public readonly itemPublicId: FinancialSettlementItemPublicId,

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
