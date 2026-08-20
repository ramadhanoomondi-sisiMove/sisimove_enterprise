// -----------------------------------------------------------------------------
// Journey Completion — Withdraw Dispute Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyCompletionPublicId,
  JourneyCompletionDisputePublicId,
  JourneyCompletionMemberPublicId,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for withdrawing a Journey Completion dispute.
 *
 * The member identity is explicitly carried because withdrawal is an
 * actor-driven domain operation.
 *
 * The aggregate remains responsible for determining whether that member
 * is authorized to withdraw the dispute and whether the dispute is in a
 * withdrawable state.
 */
export class WithdrawJourneyCompletionDisputeCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    public readonly journeyCompletionPublicId: JourneyCompletionPublicId,
    public readonly disputePublicId: JourneyCompletionDisputePublicId,
    public readonly withdrawnByPublicId: JourneyCompletionMemberPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly withdrawnAt?: Date,
  ) {}
}
