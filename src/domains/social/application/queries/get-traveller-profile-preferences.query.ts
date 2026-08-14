// src/domains/social/application/queries/get-traveller-profile-preferences.query.ts

import { Query } from '../../../../foundation/kernel/application/query';

export class GetTravellerProfilePreferencesQuery extends Query {
  constructor(public readonly travellerProfileId: string) {
    super();
  }
}
