// src/domains/journey-demand/application/handlers/update-journey-demand-pricing.handler.ts

// -----------------------------------------------------------------------------
// Journey Demand — Update Pricing Handler
// -----------------------------------------------------------------------------
//
// Application responsibility:
//
//     1. Load the Journey Demand aggregate.
//     2. Convert command primitives into domain value objects.
//     3. If pricing does not yet exist, create the pricing child entity.
//     4. Attach the pricing entity to the aggregate.
//     5. If pricing already exists, delegate the update to the aggregate.
//     6. Persist the complete aggregate.
//
// Architectural rule:
//
// JourneyDemandPricingEntity is a child entity of JourneyDemandAggregate.
// It is therefore not persisted independently.
//
// The handler is responsible for first-time construction of the child entity.
// Once the child exists, subsequent changes should go through the aggregate's
// domain behavior.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS Dependency Injection
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { UpdateJourneyDemandPricingCommand } from '../commands/update-journey-demand-pricing.command';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { JourneyDemandPricingEntity } from '../../domain/entities/journey-demand-pricing.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import {
  JourneyDemandCurrency,
  JourneyDemandPrice,
  JourneyDemandPricingPublicId,
  JourneyDemandPublicId,
} from '../../domain/value-objects';

// =============================================================================
// Handler
// =============================================================================

export class UpdateJourneyDemandPricingHandler implements CommandHandler<UpdateJourneyDemandPricingCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  async execute(command: UpdateJourneyDemandPricingCommand): Promise<void> {
    // =========================================================================
    // Journey Demand Identity
    // =========================================================================

    const journeyDemandPublicId = new JourneyDemandPublicId(
      command.journeyDemandPublicId,
    );

    // =========================================================================
    // Load Aggregate
    // =========================================================================
    //
    // The complete Journey Demand aggregate must be rehydrated before any
    // component is created or modified.
    //
    const aggregate = await this.repository.findByPublicId(
      journeyDemandPublicId,
    );

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException(command.journeyDemandPublicId);
    }

    // =========================================================================
    // Domain Value Objects
    // =========================================================================
    //
    // Primitive command values become domain value objects at the application
    // boundary.
    //
    const currency = new JourneyDemandCurrency(command.currency);

    const maximumPricePerSeat = new JourneyDemandPrice(command.maxFare);

    // =========================================================================
    // First-Time Pricing Creation
    // =========================================================================
    //
    // A newly-created Journey Demand may not have a pricing child yet.
    //
    // In that case, aggregate.updatePricing(...) cannot be used if that
    // aggregate method assumes that the pricing entity already exists.
    //
    // The application handler therefore creates the child entity and attaches
    // it to the aggregate.
    //
    if (!aggregate.hasPricing()) {
      const pricing = JourneyDemandPricingEntity.create({
        publicId: new JourneyDemandPricingPublicId(),
        maximumPricePerSeat,
        currency,
      });

      aggregate.attachPricing(pricing);

      await this.repository.save(aggregate);

      return;
    }

    // =========================================================================
    // Existing Pricing Update
    // =========================================================================
    //
    // Once the pricing child exists, all subsequent changes go through the
    // aggregate's domain behavior.
    //
    aggregate.updatePricing(
      currency,
      maximumPricePerSeat,
      command.correlationId,
      command.causationId,
    );

    // =========================================================================
    // Persist Aggregate
    // =========================================================================

    await this.repository.save(aggregate);
  }
}
