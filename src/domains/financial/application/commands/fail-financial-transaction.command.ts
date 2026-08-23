// -----------------------------------------------------------------------------
// Financial Transaction — Fail Command
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialTransactionPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for failing a Financial Transaction aggregate.
 *
 * Represents the intent to transition:
 *
 *   PENDING → FAILED
 *
 * The aggregate determines whether failure is permitted.
 */
export class FailFinancialTransactionCommand implements Command {
  constructor(
    /**
     * Public identifier of the Financial Transaction to fail.
     */
    public readonly transactionPublicId: FinancialTransactionPublicId,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional business or technical reason explaining the failure.
     */
    public readonly reason?: string,

    /**
     * Optional identifier of the command, event, or operation that caused
     * this failure command.
     */
    public readonly causationId?: string,
  ) {}
}
