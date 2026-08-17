// -----------------------------------------------------------------------------
// Journey Demand — Match Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class MatchJourneyDemandCommand extends Command {
  constructor(
    /**
     * Public identifier of the Journey Demand being matched.
     */
    public readonly journeyDemandPublicId: string,

    /**
     * Public identifier of the Journey matched to the demand.
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
