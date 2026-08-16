// src/domains/trust/application/queries/trust-profile/get-trust-profile-badge.query.ts

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustProfileBadgeQuery extends Query {
  constructor(
    public readonly trustProfileId: string,
    public readonly profileBadgeId: string,
  ) {
    super();
  }
}
