// src/domains/trust/application/queries/trust-profile/get-trust-profile-rating.query.ts

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustProfileRatingQuery extends Query {
  constructor(
    public readonly trustProfileId: string,
    public readonly ratingId: string,
  ) {
    super();
  }
}
