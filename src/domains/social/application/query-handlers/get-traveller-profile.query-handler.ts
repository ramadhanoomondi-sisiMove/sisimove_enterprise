// src/domains/social/application/query-handlers/get-traveller-profile.query-handler.ts

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetTravellerProfileQuery } from '../queries/get-traveller-profile.query';

import type { TravellerProfileAggregate } from '../../domain/aggregates/traveller-profile.aggregate';
import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

export class GetTravellerProfileQueryHandler implements QueryHandler<
  GetTravellerProfileQuery,
  TravellerProfileAggregate | null
> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    query: GetTravellerProfileQuery,
  ): Promise<TravellerProfileAggregate | null> {
    const travellerProfileId = new TravellerProfileId(query.travellerProfileId);

    return this.repository.findById(travellerProfileId);
  }
}
