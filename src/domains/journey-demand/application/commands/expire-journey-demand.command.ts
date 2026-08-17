// -----------------------------------------------------------------------------
// Journey Demand — Expire Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class ExpireJourneyDemandCommand extends Command {
  constructor(
    /**
     * Public identifier of the Journey Demand being expired.
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
