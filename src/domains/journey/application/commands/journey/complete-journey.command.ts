// src/domains/journey/application/commands/journey/complete-journey.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class CompleteJourneyCommand extends Command {
  constructor(
    /**
     * Public identifier of the Journey to complete.
     */
    public readonly journeyPublicId: string,

    /**
     * Correlation identifier for distributed tracing.
     */
    public readonly correlationId: string,

    /**
     * Causation identifier for distributed tracing.
     */
    public readonly causationId?: string,

    /**
     * Effective journey completion timestamp.
     *
     * Defaults to the handler execution time when omitted.
     */
    public readonly completedAt?: Date,
  ) {
    super();
  }
}
