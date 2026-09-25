// src/domains/journey/application/handlers/journey/attach-pricing.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Pricing Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for configuring Journey pricing.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - create a new Journey Pricing child entity;
// - convert primitive command values into domain value objects;
// - attach the pricing to the Journey aggregate;
// - persist the mutated aggregate.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
//
// Journey owns the pricing child and its attachment relationship.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AttachPricingCommand } from '../../commands/journey/attach-pricing.command';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { JourneyPricingEntity } from '../../../domain/entities/journey-pricing.entity';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyPricingPublicId,
  JourneyPricingAmount,
  JourneyCurrency,
} from '../../../domain/value-objects';

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
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: AttachPricingCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // command.journeyPublicId is already a JourneyPublicId Value Object.
    // Do not reconstruct it here.
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Create Pricing
    //
    // JourneyPricing is a Journey-owned child entity.
    //
    // Its public identity is generated when the child is created.
    // -------------------------------------------------------------------------

    const now = new Date();

    const pricing = JourneyPricingEntity.create({
      publicId: new JourneyPricingPublicId(),

      amount: new JourneyPricingAmount(command.amount),

      currency: new JourneyCurrency(command.currency),

      createdAt: now,
      updatedAt: now,
    });

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    //
    // Journey owns the pricing attachment relationship.
    // -------------------------------------------------------------------------

    aggregate.attachPricing(pricing);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
