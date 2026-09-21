// src/domains/social/application/query-handlers/get-traveller-profile-primary-corridor.query-handler.ts

import { Inject } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetTravellerProfilePrimaryCorridorQuery } from '../queries/get-traveller-profile-primary-corridor.query';

import type { TravellerProfileCorridorEntity } from '../../domain/entities/traveller-profile-corridor.entity';
import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

export class GetTravellerProfilePrimaryCorridorQueryHandler implements QueryHandler<
  GetTravellerProfilePrimaryCorridorQuery,
  TravellerProfileCorridorEntity | null
> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  async execute(
    query: GetTravellerProfilePrimaryCorridorQuery,
  ): Promise<TravellerProfileCorridorEntity | null> {
    const profileId = new TravellerProfileId(query.travellerProfileId);

    return this.repository.findPrimaryCorridor(profileId);
  }
}
