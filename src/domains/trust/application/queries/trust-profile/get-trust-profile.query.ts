// src/domains/trust/application/queries/trust-profile/get-trust-profile.query.ts

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustProfileQuery extends Query {
  constructor(public readonly trustProfileId: string) {
    super();
  }
}
