// src/domains/trust/application/queries/trust-profile/get-trust-profile-reviews.query.ts

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustProfileReviewsQuery extends Query {
  constructor(public readonly trustProfileId: string) {
    super();
  }
}
