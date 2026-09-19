// src/domains/journey-demand/application/handlers/get-journey-demand-pricing.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Pricing Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving the Pricing component of a
// specific Journey Demand.
//
// Responsibilities:
// - resolve the Journey Demand aggregate from its public identifier;
// - use the aggregate identity to retrieve its Pricing component;
// - translate missing Journey Demand or Pricing into the appropriate
//   domain-level not-found exception;
// - return the JourneyDemandPricingEntity.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - perform authentication;
// - perform authorization;
// - instantiate a repository;
// - expose Prisma models.
//
// Dependency injection is resolved through Journey Demand application tokens.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyDemandPricingQuery } from '../queries/get-journey-demand-pricing.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandPricingEntity } from '../../domain/entities/journey-demand-pricing.entity';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyDemandNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Journey Demand Application
// -----------------------------------------------------------------------------

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneyDemandPricingQueryHandler implements QueryHandler<
  GetJourneyDemandPricingQuery,
  JourneyDemandPricingEntity
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyDemandPricingQuery,
  ): Promise<JourneyDemandPricingEntity> {
    // -------------------------------------------------------------------------
    // Load Journey Demand Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyDemandPublicId,
    );

    // -------------------------------------------------------------------------
    // Validate Journey Demand
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Load Pricing
    //
    // JourneyDemandAggregate exposes its internal identity through aggregateId.
    // There is intentionally no journeyDemandId property on the aggregate.
    // -------------------------------------------------------------------------

    const pricing = await this.repository.findPricing(aggregate.aggregateId);

    // -------------------------------------------------------------------------
    // Validate Pricing
    // -------------------------------------------------------------------------

    if (pricing === null) {
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return pricing;
  }
}
