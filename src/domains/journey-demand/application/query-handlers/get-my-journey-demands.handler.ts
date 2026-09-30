// -----------------------------------------------------------------------------
// Path: src/domains/journey-demand/application/handlers/get-my-journey-demands.handler.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Get My Journey Demands Query Handler
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetMyJourneyDemandsQuery } from '../queries/get-my-journey-demands.query';

import type { JourneyDemandAggregate } from '../../domain/aggregates/journey-demand.aggregate';
import type { JourneyDemandRepository } from '../../domain/repositories/journey-demand.repository';

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
    const demands = await this.repository.findByRequesterPublicId(
      query.requesterPublicId,
    );

    const offset = Math.max(0, query.offset ?? 0);

    if (query.limit === undefined) {
      return demands.slice(offset);
    }

    const limit = Math.max(0, query.limit);

    return demands.slice(offset, offset + limit);
  }
}
