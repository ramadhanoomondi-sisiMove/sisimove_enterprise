// src/domains/trust/application/queries/trust-profile/get-trust-profile-badges.query.ts

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustProfileBadgesQuery extends Query {
  constructor(public readonly trustProfileId: string) {
    super();
  }
}
