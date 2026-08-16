// src/domains/journey/application/query-handlers/journey/get-journey-vehicle.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyVehicleQuery } from '../../queries/journey/get-journey-vehicle.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyVehicleEntity } from '../../../domain/entities/journey-vehicle.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyVehicleQueryHandler implements QueryHandler<
  GetJourneyVehicleQuery,
  JourneyVehicleEntity | null
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(
    query: GetJourneyVehicleQuery,
  ): Promise<JourneyVehicleEntity | null> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Vehicle
    //
    // Vehicle is owned by the Journey aggregate.
    // The repository therefore receives the aggregate's internal JourneyId.
    // -------------------------------------------------------------------------

    return this.repository.findVehicle(aggregate.journeyId);
  }
}
