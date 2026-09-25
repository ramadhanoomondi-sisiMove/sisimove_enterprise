// src/domains/journey/application/commands/journey/attach-pricing.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

/**
 * Configures the pricing of an existing Journey.
 *
 * JourneyPricing is a Journey-owned child entity. The command therefore
 * carries pricing configuration rather than an existing JourneyPricingPublicId.
 *
 * The application handler creates the JourneyPricingEntity and attaches it
 * to the Journey aggregate.
 */
export class AttachPricingCommand extends Command {
  public constructor(
    public readonly journeyPublicId: JourneyPublicId,

    /**
     * Pricing amount expressed in the domain's expected minor-unit format.
     */
    public readonly amount: number,

    /**
     * Currency code, for example "KES".
     */
    public readonly currency: string,

    public readonly correlationId: string,

    public readonly causationId?: string,
  ) {
    super();
  }
}
