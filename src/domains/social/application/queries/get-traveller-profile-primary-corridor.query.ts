// src/domains/social/application/queries/get-traveller-profile-primary-corridor.query.ts

import { Query } from '../../../../foundation/kernel/application/query';

export class GetTravellerProfilePrimaryCorridorQuery extends Query {
  constructor(public readonly travellerProfileId: string) {
    super();
  }
}
