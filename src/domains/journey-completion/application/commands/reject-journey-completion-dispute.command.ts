// -----------------------------------------------------------------------------
// Journey Completion — Reject Dispute Command
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
 * Command for rejecting a Journey Completion dispute.
 *
 * The command carries validated domain value objects rather than transport
 * primitives.
 *
 * The Journey Completion aggregate remains responsible for:
 *
 * - locating the dispute;
 * - validating that the dispute is UNDER_REVIEW;
 * - validating the resolver;
 * - validating the rejection summary;
 * - applying the dispute rejection;
 * - incrementing the aggregate version;
 * - recording JourneyCompletionDisputeRejectedEvent.
 */
export class RejectJourneyCompletionDisputeCommand implements Command {
  // ===========================================================================

  // Constructor

  // ===========================================================================

  constructor(
    /**
     * Public identity of the Journey Completion aggregate.
     */
    public readonly journeyCompletionPublicId: JourneyCompletionPublicId,

    /**
     * Public identity of the dispute being rejected.
     */
    public readonly disputePublicId: JourneyCompletionDisputePublicId,

    /**
     * Public identity of the member rejecting the dispute.
     */
    public readonly resolvedByPublicId: JourneyCompletionMemberPublicId,

    /**
     * Explanation for rejecting the dispute.
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
     * Timestamp at which the dispute was rejected.
     */
    public readonly rejectedAt?: Date,
  ) {}
}
