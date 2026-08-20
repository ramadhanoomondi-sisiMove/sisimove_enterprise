// -----------------------------------------------------------------------------
// Journey Completion — Confirm Command
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
 * Command for confirming a Journey Completion.
 *
 * The Journey Completion aggregate is responsible for determining whether
 * the required confirmation threshold has been satisfied before allowing
 * the transition to CONFIRMED.
 *
 * The command carries no confirmation count. The aggregate derives that
 * information from its authoritative confirmation child entities.
 */
export class ConfirmJourneyCompletionCommand implements Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    public readonly journeyCompletionPublicId: JourneyCompletionPublicId,
    public readonly correlationId: string,
    public readonly causationId?: string,
    public readonly confirmedAt?: Date,
  ) {}
}
