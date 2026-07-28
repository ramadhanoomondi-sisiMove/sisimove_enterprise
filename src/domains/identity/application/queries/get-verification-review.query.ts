// src/domains/identity/application/queries/get-verification-review.query.ts

import { Query } from '../../../../foundation/kernel/application/query';

export class GetVerificationReviewQuery extends Query {
  constructor(public readonly requestPublicId: string) {
    super();
  }
}
