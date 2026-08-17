// src/domains/journey-demand/application/commands/update-journey-demand-capacity.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandCapacityCommand extends Command {
  constructor(
    /**
     * Public identifier of the JourneyDemand being updated.
     */
    public readonly journeyDemandPublicId: string,

    /**
     * Number of seats required by the Journey Demand.
     */
    public readonly seatsRequired: number,

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
