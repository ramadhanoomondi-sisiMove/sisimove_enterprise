// src/domains/journey-demand/application/commands/fulfill-journey-demand.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class FulfillJourneyDemandCommand extends Command {
  constructor(
    /**
     * Public identifier of the JourneyDemand being fulfilled.
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
