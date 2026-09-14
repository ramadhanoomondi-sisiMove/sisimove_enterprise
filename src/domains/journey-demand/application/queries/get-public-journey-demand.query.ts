// src/domains/journey-demand/application/queries/journey-demand/get-public-journey-demand.query.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Public Journey Demand Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving one publicly discoverable Journey Demand.
//
// This query is intentionally separate from the generic:
//
//   GetJourneyDemandByPublicIdQuery
//
// because public discovery is a distinct read concern.
//
// A Journey Demand may exist internally while not being publicly discoverable.
// The public query therefore delegates that visibility decision to the
// repository/application read boundary rather than treating every existing
// Journey Demand as public.
//
// The query does not:
// - enforce HTTP authorization;
// - contain business rules;
// - access Prisma directly;
// - compose Traveller Profile data;
// - compose Trust data;
// - compose Journey data;
// - perform marketplace composition.
//
// It only carries the domain value object required to identify the public
// Journey Demand being requested.
//
// -----------------------------------------------------------------------------
// Architecture
// -----------------------------------------------------------------------------
//
// HTTP Controller
//       │
//       ▼
// GetPublicJourneyDemandQuery
//       │
//       ▼
// GetPublicJourneyDemandQueryHandler
//       │
//       ▼
// JourneyDemandRepository
//       │
//       ▼
// Publicly discoverable Journey Demand
//
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

import type { JourneyDemandPublicId } from '../../domain/value-objects/journey-demand-public-id.vo';

// =============================================================================
// Get Public Journey Demand Query
// =============================================================================

export class GetPublicJourneyDemandQuery extends Query {
  constructor(public readonly journeyDemandPublicId: JourneyDemandPublicId) {
    super();
  }
}
