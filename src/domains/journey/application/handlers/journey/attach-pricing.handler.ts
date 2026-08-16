// src/domains/journey/application/handlers/journey/attach-pricing.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AttachPricingCommand } from '../../commands/journey/attach-pricing.command';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class AttachPricingHandler implements CommandHandler<
  AttachPricingCommand,
  void
> {
  constructor(private readonly journeyRepository: JourneyRepository) {}

  async execute(command: AttachPricingCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // command.journeyPublicId is already a JourneyPublicId Value Object.
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Journey Pricing
    //
    // command.pricingPublicId is already a JourneyPricingPublicId
    // Value Object.
    //
    // The lookup is scoped to the owning Journey aggregate.
    // -------------------------------------------------------------------------

    const pricing = await this.journeyRepository.findPricingByPublicId(
      aggregate.journeyId,
      command.pricingPublicId,
    );

    if (pricing === null) {
      throw new Error(
        `Journey pricing '${command.pricingPublicId.value}' ` +
          `was not found for Journey '${command.journeyPublicId.value}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------

    aggregate.attachPricing(pricing);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
