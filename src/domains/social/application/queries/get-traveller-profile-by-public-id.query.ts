// src/domains/social/application/queries/get-traveller-profile-by-public-id.query.ts

import { Query } from '../../../../foundation/kernel/application/query';

export class GetTravellerProfileByPublicIdQuery extends Query {
  constructor(public readonly publicId: string) {
    super();
  }
}
