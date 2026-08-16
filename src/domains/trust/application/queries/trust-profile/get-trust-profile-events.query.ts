// src/domains/trust/application/queries/trust-profile/get-trust-profile-events.query.ts

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustProfileEventsQuery extends Query {
  constructor(public readonly trustProfileId: string) {
    super();
  }
}
