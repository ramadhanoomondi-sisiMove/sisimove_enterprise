// src/domains/trust/application/queries/trust-badge/get-trust-badge-by-name.query.ts

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustBadgeByNameQuery extends Query {
  constructor(public readonly name: string) {
    super();
  }
}
