// -----------------------------------------------------------------------------
// Journey Completion — Cancel Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyCompletionPublicId } from '../../domain/value-objects';

// =============================================================================
// Command
// =============================================================================

/**
 * Command for cancelling a Journey Completion.
 *
 * The Journey Completion aggregate remains responsible for:
 *
 * - validating whether cancellation is currently allowed;
 * - enforcing the completion lifecycle transition;
 * - preventing cancellation of confirmed or disputed completions;
 * - applying the cancellation timestamp;
 * - incrementing the aggregate version;
 * - recording JourneyCompletionCancelledEvent.
 *
 * The command carries validated domain identifiers rather than transport
 * primitives.
 */
export class CancelJourneyCompletionCommand implements Command {
  // ===========================================================================

  // Constructor

  // ===========================================================================

  constructor(
    /**
     * Public identity of the Journey Completion aggregate to cancel.
     */
    public readonly journeyCompletionPublicId: JourneyCompletionPublicId,

    /**
     * Application correlation identifier.
     */
    public readonly correlationId: string,

    /**
     * Optional identifier of the command/event that caused this operation.
     */
    public readonly causationId?: string,

    /**
     * Timestamp at which the Journey Completion was cancelled.
     *
     * When omitted, the aggregate uses the current time.
     */
    public readonly cancelledAt?: Date,
  ) {}
}
