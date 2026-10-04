// -----------------------------------------------------------------------------
// Path: src/domains/journey-demand/application/handlers/get-my-journey-demands.handler.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Get My Journey Demands Query Handler
//
// Responsibilities:
// - retrieve Journey Demand aggregates owned by the authenticated requester;
// - apply offset pagination;
// - apply optional limit pagination;
// - return hydrated JourneyDemandAggregate instances.
//
// The handler intentionally returns aggregates because the authenticated-owner
// presentation mapper consumes the aggregate and projects its owned entity:
//
//     JourneyDemandAggregate
//             ↓
//     MyJourneyDemandMapper.fromAggregate()
//             ↓
//     MyJourneyDemandResponse
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { JourneyDemandAggregate } from '../../domain/aggregates/journey-demand.aggregate';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

import type { GetMyJourneyDemandsQuery } from '../queries/get-my-journey-demands.query';

import { JOURNEY_DEMAND_TOKENS } from '../journey-demand.tokens';

@Injectable()
export class GetMyJourneyDemandsQueryHandler implements QueryHandler<
  GetMyJourneyDemandsQuery,
  JourneyDemandAggregate[]
> {
  public constructor(
    @Inject(JOURNEY_DEMAND_TOKENS.REPOSITORY)
    private readonly repository: JourneyDemandRepository,
  ) {}

  public async execute(
    query: GetMyJourneyDemandsQuery,
  ): Promise<JourneyDemandAggregate[]> {
    const aggregates = await this.repository.findByRequesterPublicId(
      query.requesterPublicId,
    );

    const offset = Math.max(0, query.offset ?? 0);

    if (query.limit === undefined) {
      return aggregates.slice(offset);
    }

    const limit = Math.max(0, query.limit);

    return aggregates.slice(offset, offset + limit);
  }
}
