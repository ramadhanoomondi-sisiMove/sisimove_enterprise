// src/domains/journey-demand/application/handlers/find-open-journey-demands.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { FindOpenJourneyDemandsQuery } from '../queries/find-open-journey-demands.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyDemandEntity } from '../../domain/entities/journey-demand.entity';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

// -----------------------------------------------------------------------------
// Journey Demand Status
// -----------------------------------------------------------------------------

import {
  JourneyDemandStatus,
  JourneyDemandStatusValueObject,
} from '../../domain/value-objects/journey-demand-status.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class FindOpenJourneyDemandsQueryHandler implements QueryHandler<
  FindOpenJourneyDemandsQuery,
  JourneyDemandEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyDemandRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: FindOpenJourneyDemandsQuery,
  ): Promise<JourneyDemandEntity[]> {
    // -------------------------------------------------------------------------
    // Validate Pagination
    // -------------------------------------------------------------------------

    const offset = query.offset ?? 0;
    const limit = query.limit;

    if (!Number.isInteger(offset) || offset < 0) {
      throw new Error(
        'Journey Demand query offset must be a non-negative integer.',
      );
    }

    if (limit !== undefined && (!Number.isInteger(limit) || limit <= 0)) {
      throw new Error('Journey Demand query limit must be a positive integer.');
    }

    // -------------------------------------------------------------------------
    // Open Status
    // -------------------------------------------------------------------------

    const openStatus = new JourneyDemandStatusValueObject(
      JourneyDemandStatus.OPEN,
    );

    // -------------------------------------------------------------------------
    // Query Repository
    // -------------------------------------------------------------------------

    const demands =
      await this.repository.findJourneyDemandsByStatus(openStatus);

    // -------------------------------------------------------------------------
    // Pagination
    // ----------------------------------------------------------------------------

    if (limit === undefined) {
      return demands.slice(offset);
    }

    return demands.slice(offset, offset + limit);
  }
}
