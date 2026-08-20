// -----------------------------------------------------------------------------
// Journey Completion — Request Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyCompletionPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Command for requesting completion of a Journey Completion.
 *
 * This transition moves the Journey Completion from PENDING to
 * CONFIRMATION_REQUIRED.
 *
 * The aggregate owns:
 *
 * - lifecycle validation;
 * - completion request transition;
 * - completionRequestedAt;
 * - aggregate versioning;
 * - JourneyCompletionRequestedEvent.
 */
export class RequestJourneyCompletionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    public readonly journeyCompletionPublicId: JourneyCompletionPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly requestedAt?: Date,
  ) {}
}
