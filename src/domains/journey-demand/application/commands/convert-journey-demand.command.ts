// src/domains/journey-demand/application/commands/convert-journey-demand.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class ConvertJourneyDemandCommand extends Command {
  constructor(
    /**
     * Public identifier of the JourneyDemand being converted.
     */
    public readonly journeyDemandPublicId: string,

    /**
     * Public identifier of the Journey created from the demand.
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
  ) {
    super();
  }
}
