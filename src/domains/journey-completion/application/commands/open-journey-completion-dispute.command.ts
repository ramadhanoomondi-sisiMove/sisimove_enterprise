// -----------------------------------------------------------------------------
// Journey Completion — Open Dispute Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type {
  JourneyCompletionDisputeDescription,
  JourneyCompletionDisputeReason,
  JourneyCompletionMemberPublicId,
  JourneyCompletionPublicId,
} from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for opening a dispute against a Journey Completion.
 *
 * Domain value objects are supplied by the application boundary.
 *
 * The command does not perform domain validation. That responsibility belongs
 * to the domain value objects and JourneyCompletionAggregate.
 */
export class OpenJourneyCompletionDisputeCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    public readonly completionPublicId: JourneyCompletionPublicId,

    public readonly raisedByPublicId: JourneyCompletionMemberPublicId,

    public readonly reason: JourneyCompletionDisputeReason,

    public readonly description?: JourneyCompletionDisputeDescription,

    public readonly correlationId: string = crypto.randomUUID(),

    public readonly causationId?: string,
  ) {}
}
