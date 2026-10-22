// src/domains/trust/application/queries/trust-badge/get-trust-badges.query.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Badges Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving all Trust Badge entities.
//
// Responsibilities:
// - Represent the request to retrieve all registered Trust Badges.
//
// This query does NOT:
// - Access the repository directly.
// - Access Prisma or infrastructure.
// - Perform HTTP or authorization concerns.
//
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

export class GetTrustBadgesQuery extends Query {}
