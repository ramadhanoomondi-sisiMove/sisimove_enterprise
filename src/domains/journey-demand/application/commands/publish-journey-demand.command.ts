// src/domains/journey-demand/application/commands/publish-journey-demand.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class PublishJourneyDemandCommand extends Command {
  constructor(
    /**
     * Public identifier of the JourneyDemand being published.
     */
    public readonly journeyDemandPublicId: string,

    /**
     * Correlation identifier for distributed tracing.
     */
    public readonly correlationId: string,

    /**
     * Causation identifier for distributed tracing.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
