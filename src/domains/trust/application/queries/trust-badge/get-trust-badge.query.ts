// src/domains/trust/application/queries/trust-badge/get-trust-badge.query.ts

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustBadgeQuery extends Query {
  constructor(public readonly trustBadgeId: string) {
    super();
  }
}
