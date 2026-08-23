// -----------------------------------------------------------------------------
// Financial Transaction — Reverse Command
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialTransactionPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for reversing a Financial Transaction aggregate.
 *
 * Represents the intent to transition:
 *
 *   COMPLETED → REVERSED
 *
 * Reversal does not mutate historical transaction entries.
 * A compensating financial movement must be represented by a separate
 * Financial Transaction.
 */
export class ReverseFinancialTransactionCommand implements Command {
  constructor(
    /**
     * Public identifier of the Financial Transaction to reverse.
     */
    public readonly transactionPublicId: FinancialTransactionPublicId,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional business or technical reason explaining the reversal.
     */
    public readonly reason?: string,

    /**
     * Optional identifier of the command, event, or operation that caused
     * this reversal command.
     */
    public readonly causationId?: string,
  ) {}
}
