// src/domains/trust/application/queries/trust-profile/get-trust-profile-review.query.ts

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustProfileReviewQuery extends Query {
  constructor(
    public readonly trustProfileId: string,
    public readonly reviewId: string,
  ) {
    super();
  }
}