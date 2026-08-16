// src/domains/journey/application/commands/journey/start-journey.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class StartJourneyCommand extends Command {
  constructor(
    /**
     * Public identifier of the Journey to start.
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
     * Effective journey start timestamp.
     *
     * Defaults to the handler execution time when omitted.
     */
    public readonly startedAt?: Date,
  ) {
    super();
  }
}
