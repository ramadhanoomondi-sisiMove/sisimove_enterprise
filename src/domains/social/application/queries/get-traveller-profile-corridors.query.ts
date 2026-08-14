// src/domains/social/application/queries/get-traveller-profile-corridors.query.ts

import { Query } from '../../../../foundation/kernel/application/query';

export class GetTravellerProfileCorridorsQuery extends Query {
  constructor(public readonly travellerProfileId: string) {
    super();
  }
}
