// src/domains/social/application/query-handlers/get-traveller-profile-by-public-id.query-handler.ts

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetTravellerProfileByPublicIdQuery } from '../queries/get-traveller-profile-by-public-id.query';

import type { TravellerProfileAggregate } from '../../domain/aggregates/traveller-profile.aggregate';
import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfilePublicId } from '../../domain/value-objects/traveller-profile-public-id.vo';

export class GetTravellerProfileByPublicIdQueryHandler implements QueryHandler<
  GetTravellerProfileByPublicIdQuery,
  TravellerProfileAggregate | null
> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    query: GetTravellerProfileByPublicIdQuery,
  ): Promise<TravellerProfileAggregate | null> {
    const publicId = new TravellerProfilePublicId(query.publicId);

    return this.repository.findByPublicId(publicId);
  }
}
