// src/domains/journey/application/commands/journey/cancel-journey.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Cancels a Journey.
 *
 * Application-layer responsibility:
 * - Carries primitive command input.
 * - Identifies the Journey by public identifier.
 * - Carries optional cancellation metadata.
 * - Carries tracing identifiers.
 *
 * Domain-layer responsibility:
 * - Resolves the Journey aggregate.
 * - Validates whether the Journey can be cancelled.
 * - Performs the cancellation transition.
 * - Records the cancellation timestamp/reason through domain behavior.
 */
export class CancelJourneyCommand extends Command {
  public constructor(
    /**
     * Public identifier of the Journey to cancel.
     */
    public readonly journeyPublicId: string,

    /**
     * Optional reason supplied by the caller.
     */
    public readonly reason: string | undefined,

    /**
     * Correlation identifier for distributed tracing.
     */
    public readonly correlationId: string,

    /**
     * Causation identifier for distributed tracing.
     */
    public readonly causationId?: string,

    /**
     * Optional effective cancellation timestamp.
     *
     * When omitted, the application handler should use the current
     * execution time.
     */
    public readonly cancelledAt?: Date,
  ) {
    super();
  }
}
