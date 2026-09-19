// src/domains/journey/application/handlers/journey/attach-pricing.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Pricing Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler responsible for attaching an existing
// Journey Pricing child entity to its owning Journey aggregate.
//
// Responsibilities:
// - resolve the Journey aggregate by its public identifier;
// - resolve the Pricing child entity within that Journey aggregate boundary;
// - delegate the attachment to the Journey aggregate;
// - persist the mutated aggregate.
//
// Architectural rules:
// - The command already contains Value Objects. The handler must not recreate
//   them from primitives.
// - Journey Pricing is a child entity of Journey, not an independent
//   aggregate. Therefore, pricing resolution is scoped by the owning Journey's
//   internal aggregate identifier.
// - Business invariants remain inside the Journey aggregate.
// - Persistence is performed through the application-level repository token.
// - The handler contains orchestration only; it does not implement domain
//   business rules.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

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
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class AttachPricingHandler implements CommandHandler<
  AttachPricingCommand,
  void
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------
  //
  // The repository is resolved through the Journey application token rather
  // than relying on concrete-class/type-based NestJS dependency injection.
  //
  // This keeps the application layer dependent on the repository contract
  // while infrastructure remains responsible for providing its implementation.
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(command: AttachPricingCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // command.journeyPublicId is already a JourneyPublicId Value Object.
    // Do not reconstruct the Value Object in the handler.
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
    // Pricing is a child entity within the Journey aggregate boundary.
    //
    // The lookup therefore uses:
    //   1. the Journey's internal aggregate identifier; and
    //   2. the Pricing public identifier.
    //
    // command.pricingPublicId is already a JourneyPricingPublicId Value Object.
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
    //
    // The aggregate owns the attachment operation and therefore remains
    // responsible for enforcing all Journey-level invariants.
    // -------------------------------------------------------------------------

    aggregate.attachPricing(pricing);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
