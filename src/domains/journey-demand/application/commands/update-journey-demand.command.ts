// src/domains/journey-demand/application/commands/update-journey-demand.command.ts

// -----------------------------------------------------------------------------
// Update Journey Demand Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandCommand extends Command {
  constructor(
    // -------------------------------------------------------------------------
    // Aggregate Identity
    // -------------------------------------------------------------------------

    /**
     * Public identifier of the Journey Demand being updated.
     */
    public readonly journeyDemandPublicId: string,

    // -------------------------------------------------------------------------
    // Event Correlation
    // -------------------------------------------------------------------------

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
