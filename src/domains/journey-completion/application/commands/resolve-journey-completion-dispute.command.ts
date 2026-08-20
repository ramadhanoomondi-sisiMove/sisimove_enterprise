// -----------------------------------------------------------------------------
// Journey Completion — Resolve Dispute Command
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
 * Command for resolving a Journey Completion dispute.
 *
 * The command carries validated domain value objects rather than transport
 * primitives.
 *
 * The Journey Completion aggregate remains responsible for:
 *
 * - locating the dispute;
 * - validating that the dispute is UNDER_REVIEW;
 * - validating the resolver;
 * - validating the resolution summary;
 * - applying the dispute resolution;
 * - incrementing the aggregate version;
 * - recording JourneyCompletionDisputeResolvedEvent.
 */
export class ResolveJourneyCompletionDisputeCommand implements Command {
  // ===========================================================================

  // Constructor

  // ===========================================================================

  constructor(
    /**
     * Public identity of the Journey Completion aggregate.
     */
    public readonly journeyCompletionPublicId: JourneyCompletionPublicId,

    /**
     * Public identity of the dispute being resolved.
     */
    public readonly disputePublicId: JourneyCompletionDisputePublicId,

    /**
     * Public identity of the member resolving the dispute.
     */
    public readonly resolvedByPublicId: JourneyCompletionMemberPublicId,

    /**
     * Explanation of the dispute resolution.
     *
     * The aggregate performs authoritative domain validation through
     * JourneyCompletionDisputeResolutionSummary.
     */
    public readonly resolutionSummary: string,

    /**
     * Application correlation identifier.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command/event that caused this operation.
     */
    public readonly causationId?: string,

    /**
     * Timestamp at which the dispute was resolved.
     */
    public readonly resolvedAt?: Date,
  ) {}
}
