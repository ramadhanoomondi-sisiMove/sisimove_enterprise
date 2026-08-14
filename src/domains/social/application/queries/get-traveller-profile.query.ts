// src/domains/social/application/queries/get-traveller-profile.query.ts

import { Query } from '../../../../foundation/kernel/application/query';

export class GetTravellerProfileQuery extends Query {
  constructor(public readonly travellerProfileId: string) {
    super();
  }
}
