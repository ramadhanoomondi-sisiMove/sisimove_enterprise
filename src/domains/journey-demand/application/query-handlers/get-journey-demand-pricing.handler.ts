// src/domains/journey-demand/application/handlers/get-journey-demand-pricing.handler.ts

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
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyDemandPricingQueryHandler implements QueryHandler<
  GetJourneyDemandPricingQuery,
  JourneyDemandPricingEntity
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyDemandRepository) {}

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
