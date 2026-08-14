// src/domains/social/application/query-handlers/get-traveller-profile-preferences.query-handler.ts

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetTravellerProfilePreferencesQuery } from '../queries/get-traveller-profile-preferences.query';

import type { TravellerProfilePreferencesEntity } from '../../domain/entities/traveller-profile-preferences.entity';
import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileId } from '../../domain/value-objects/traveller-profile-id.vo';

export class GetTravellerProfilePreferencesQueryHandler implements QueryHandler<
  GetTravellerProfilePreferencesQuery,
  TravellerProfilePreferencesEntity | null
> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    query: GetTravellerProfilePreferencesQuery,
  ): Promise<TravellerProfilePreferencesEntity | null> {
    const profileId = new TravellerProfileId(query.travellerProfileId);

    return this.repository.findPreferences(profileId);
  }
}
