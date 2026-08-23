// -----------------------------------------------------------------------------
// Financial Transaction — Complete Command
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

import type { FinancialTransactionPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for completing a Financial Transaction aggregate.
 *
 * Represents the intent to transition:
 *
 *   PENDING → COMPLETED
 *
 * The aggregate is responsible for enforcing all completion invariants.
 */
export class CompleteFinancialTransactionCommand implements Command {
  constructor(
    /**
     * Public identifier of the Financial Transaction to complete.
     */
    public readonly transactionPublicId: FinancialTransactionPublicId,

    /**
     * Correlation identifier for the command and resulting domain events.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command, event, or operation that caused
     * this completion command.
     */
    public readonly causationId?: string,
  ) {}
}
