// src/domains/identity/application/queries/get-verification-summary.query.ts

import { Query } from '../../../../foundation/kernel/application/query';

export class GetVerificationSummaryQuery extends Query {
  constructor(public readonly verificationPublicId: string) {
    super();
  }
}
