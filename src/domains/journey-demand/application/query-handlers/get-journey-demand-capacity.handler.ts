// src/domains/journey-demand/application/handlers/get-journey-demand-capacity.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Journey Demand Capacity Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving the Capacity component of a
// specific Journey Demand.
//
// Responsibilities:
// - resolve the Journey Demand aggregate from its public identifier;
// - use the aggregate identity to retrieve its Capacity component;
// - translate missing Journey Demand or Capacity into the appropriate
//   domain-level not-found exception;
// - return the JourneyDemandCapacityEntity.
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

import type { GetJourneyDemandCapacityQuery } from '../queries/get-journey-demand-capacity.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandCapacityEntity } from '../../domain/entities/journey-demand-capacity.entity';
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
export class GetJourneyDemandCapacityQueryHandler implements QueryHandler<
  GetJourneyDemandCapacityQuery,
  JourneyDemandCapacityEntity
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
    query: GetJourneyDemandCapacityQuery,
  ): Promise<JourneyDemandCapacityEntity> {
    // -------------------------------------------------------------------------
    // Load Aggregate
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
    // Load Capacity
    //
    // JourneyDemandAggregate exposes its internal identity through aggregateId.
    // Do not access a non-existent journeyDemandId property.
    // -------------------------------------------------------------------------

    const capacity = await this.repository.findCapacity(aggregate.aggregateId);

    // -------------------------------------------------------------------------
    // Validate Capacity
    // -------------------------------------------------------------------------

    if (capacity === null) {
      throw new JourneyDemandNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Result
    // -------------------------------------------------------------------------

    return capacity;
  }
}
