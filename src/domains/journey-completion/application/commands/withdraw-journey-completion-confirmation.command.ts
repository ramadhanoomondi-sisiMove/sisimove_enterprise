// -----------------------------------------------------------------------------
// Journey Completion — Withdraw Confirmation Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// =============================================================================
// Command
// =============================================================================

/**
 * Requests withdrawal of an existing Journey Completion confirmation.
 *
 * The command identifies:
 *
 * - the Journey Completion;
 * - the confirmation being withdrawn;
 * - the member requesting the withdrawal.
 *
 * Authorization and lifecycle invariants are enforced by the
 * JourneyCompletionAggregate.
 *
 * The command intentionally carries primitive public-identity strings.
 * Conversion into strongly typed domain value objects belongs to the
 * application command handler.
 */
export class WithdrawJourneyCompletionConfirmationCommand extends Command {
  constructor(
    /**
     * Public identity of the Journey Completion aggregate.
     */
    public readonly journeyCompletionPublicId: string,

    /**
     * Public identity of the confirmation being withdrawn.
     */
    public readonly confirmationPublicId: string,

    /**
     * Public identity of the member requesting the withdrawal.
     *
     * The aggregate verifies that this member owns the confirmation.
     */
    public readonly memberPublicId: string,

    /**
     * Correlation identifier for distributed tracing.
     */
    public readonly correlationId: string,

    /**
     * Optional causation identifier for the command/event chain.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
