// src/domains/trust/application/queries/trust-badge/get-trust-badge-by-type.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustBadgeType } from '../../../domain/value-objects/trust-badge-type.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetTrustBadgeByTypeQuery extends Query {
  constructor(public readonly type: TrustBadgeType) {
    super();
  }
}
