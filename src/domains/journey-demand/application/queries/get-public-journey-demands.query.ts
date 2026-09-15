// src/domains/journey-demand/application/queries/journey-demand/get-public-journey-demands.query.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Public Journey Demands Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving publicly discoverable Journey Demands.
//
// This query represents the public Journey Demand collection used by the
// marketplace.
//
// It is intentionally separate from:
//
//   GetJourneyDemandsQuery
//
// because the generic Journey Demand collection is an internal application
// read concern, while this query represents the public marketplace read
// boundary.
//
// It is also intentionally separate from:
//
//   GetPublicJourneyDemandQuery
//
// because that query retrieves one specific publicly discoverable Journey
// Demand by its public identifier.
//
// An empty query is valid and means:
//
//   "Return all publicly discoverable Journey Demands."
//
// This is important for the sisiMove marketplace because public discovery is
// marketplace-first rather than search-first. The landing page must be able
// to display available Journey Demands before a traveller applies filters.
//
// Optional filters narrow the public collection:
//
//   from
//   to
//   date
//
// Pagination is kept at the application-query boundary so the controller can
// bind HTTP primitives and construct this query without exposing HTTP concerns
// inside the application layer.
//
// The query does not:
//
// - enforce HTTP authorization;
// - contain business rules;
// - access Prisma directly;
// - compose Traveller Profile data;
// - compose Trust data;
// - compose Journey data;
// - construct the public response;
// - decide how Traveller or Trust data is represented.
//
// Those responsibilities belong to the repository/application read boundary
// and the public query handler.
//
// -----------------------------------------------------------------------------
// Architecture
// -----------------------------------------------------------------------------
//
// HTTP Controller
//       │
//       ▼
// GetPublicJourneyDemandsQuery
//       │
//       ▼
// GetPublicJourneyDemandsQueryHandler
//       │
//       ├── JourneyDemandRepository
//       │
//       ├── Traveller public query capability
//       │
//       └── Trust public query capability
//       │
//       ▼
// Public Journey Demand collection
//
// -----------------------------------------------------------------------------
// Public Marketplace Semantics
// -----------------------------------------------------------------------------
//
// No filters:
//
//   GetPublicJourneyDemandsQuery
//
// means:
//
//   "Give me all Journey Demands that are publicly discoverable."
//
// Filters are optional and are applied to the public collection:
//
//   from  → origin/location filter
//   to    → destination/location filter
//   date  → journey-date filter
//
// The query therefore supports both:
//
//   marketplace browsing
//
// and:
//
//   marketplace filtering/search.
//
// Search is a refinement of public discovery, not a prerequisite for it.
//
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Get Public Journey Demands Query
// =============================================================================

/**
 * Retrieves publicly discoverable Journey Demands for marketplace discovery.
 *
 * All filters are optional.
 *
 * An instance with no filters requests the complete publicly discoverable
 * collection.
 */
export class GetPublicJourneyDemandsQuery extends Query {
  constructor(
    public readonly from?: string,
    public readonly to?: string,
    public readonly date?: string,
    public readonly limit?: number,
    public readonly offset?: number,
  ) {
    super();
  }
}
