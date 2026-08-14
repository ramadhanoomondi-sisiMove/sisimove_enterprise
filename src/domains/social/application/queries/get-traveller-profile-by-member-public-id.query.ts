// src/domains/social/application/queries/get-traveller-profile-by-member-public-id.query.ts

import { Query } from '../../../../foundation/kernel/application/query';

export class GetTravellerProfileByMemberPublicIdQuery extends Query {
  constructor(public readonly memberPublicId: string) {
    super();
  }
}
