// src/domains/trust/application/queries/trust-badge/get-trust-badge-by-public-id.query.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Badge By Public ID Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a Trust Badge aggregate by its public ID.
//
// Responsibilities:
// - Carry the public identifier required to retrieve a Trust Badge.
//
// This query does NOT:
// - Convert the identifier into a domain value object.
// - Access the repository directly.
// - Access Prisma or infrastructure.
// - Perform HTTP or authorization concerns.
//
// Identifier conversion and repository access belong to the query handler.
//
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustBadgeByPublicIdQuery extends Query {
  constructor(public readonly publicId: string) {
    super();
  }
}
