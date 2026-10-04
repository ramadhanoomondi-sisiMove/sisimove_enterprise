// src/domains/journey-demand/application/commands/update-journey-demand-pricing.command.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Pricing Command
// -----------------------------------------------------------------------------
//
// Carries the primitive values required to update the pricing component of a
// Journey Demand.
//
// The command intentionally contains primitives at the application boundary.
// Conversion into domain value objects belongs to the command handler.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// =============================================================================
// Command
// =============================================================================

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
