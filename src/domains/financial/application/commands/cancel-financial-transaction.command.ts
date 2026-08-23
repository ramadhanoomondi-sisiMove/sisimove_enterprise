// -----------------------------------------------------------------------------
// Financial Transaction — Cancel Command
// -----------------------------------------------------------------------------
//
// Application command for cancelling a pending Financial Transaction.
//
// The command carries domain-ready value objects rather than raw transport
// values.
//
// Cancellation is a terminal lifecycle transition and is only valid while the
// Financial Transaction aggregate is PENDING.
//
// The command does NOT perform the cancellation itself. The application layer
// resolves the aggregate and invokes:
//
//   FinancialTransactionAggregate.cancel()
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { FinancialTransactionPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for cancelling a Financial Transaction.
 *
 * The command represents the intent to cancel an existing Financial
 * Transaction aggregate.
 *
 * Required domain inputs:
 *
 * - transactionPublicId
 * - correlationId
 *
 * Optional input:
 *
 * - reason
 *
 * The transaction lifecycle state is NOT supplied by the command.
 * The aggregate determines whether cancellation is currently permitted.
 *
 * Cancellation is only valid for a PENDING transaction.
 */
export class CancelFinancialTransactionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    /**
     * Public identifier of the Financial Transaction to cancel.
     */
    public readonly transactionPublicId: FinancialTransactionPublicId,

    /**
     * Correlation identifier for the command and resulting domain event.
     */
    public readonly correlationId: string,

    /**
     * Optional business reason for the cancellation.
     *
     * The reason is informational and does not determine whether the
     * cancellation is allowed.
     */
    public readonly reason?: string,

    /**
     * Optional identifier of the command or operation that caused this
     * command.
     */
    public readonly causationId?: string,
  ) {}
}
