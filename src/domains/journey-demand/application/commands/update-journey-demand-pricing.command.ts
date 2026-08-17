// src/domains/journey-demand/application/commands/update-journey-demand-pricing.command.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Pricing Command
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class UpdateJourneyDemandPricingCommand extends Command {
  constructor(
    public readonly journeyDemandPublicId: string,
    public readonly currency: string,
    public readonly maxFare: number,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
