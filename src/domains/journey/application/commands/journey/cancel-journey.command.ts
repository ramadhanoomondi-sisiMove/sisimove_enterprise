// src/domains/journey/application/commands/journey/cancel-journey.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class CancelJourneyCommand extends Command {
  constructor(
    /**
     * Public identifier of the Journey to cancel.
     */
    public readonly journeyPublicId: string,

    /**
     * Optional reason for cancellation.
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
     * Effective cancellation timestamp.
     *
     * Defaults to the handler execution time when omitted.
     */
    public readonly cancelledAt?: Date,
  ) {
    super();
  }
}
