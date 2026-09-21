// src/domains/social/application/query-handlers/get-traveller-profile.query-handler.ts

import { Inject } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetTravellerProfileQuery } from '../queries/get-traveller-profile.query';

import type { TravellerProfileAggregate } from '../../domain/aggregates/traveller-profile.aggregate';
import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

export class GetTravellerProfileQueryHandler implements QueryHandler<
  GetTravellerProfileQuery,
  TravellerProfileAggregate | null
> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  async execute(
    query: GetTravellerProfileQuery,
  ): Promise<TravellerProfileAggregate | null> {
    const travellerProfileId = new TravellerProfileId(query.travellerProfileId);

    return this.repository.findById(travellerProfileId);
  }
}
