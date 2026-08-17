// src/domains/journey-demand/application/commands/update-journey-demand-corridor.command.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Corridor Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandCorridorCommand extends Command {
  constructor(
    /**
     * Public identifier of the JourneyDemand being updated.
     */
    public readonly journeyDemandPublicId: string,

    /**
     * New origin name.
     */
    public readonly origin: string,

    /**
     * New destination name.
     */
    public readonly destination: string,

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
