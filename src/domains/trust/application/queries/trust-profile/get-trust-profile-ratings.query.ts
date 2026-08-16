// src/domains/trust/application/queries/trust-profile/get-trust-profile-ratings.query.ts

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustProfileRatingsQuery extends Query {
  constructor(public readonly trustProfileId: string) {
    super();
  }
}
