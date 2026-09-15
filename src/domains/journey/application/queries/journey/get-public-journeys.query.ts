// src/domains/journey/application/queries/public/get-public-journeys.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Retrieves publicly discoverable Journeys through the public Journey
 * read boundary.
 *
 * This query represents the public Journey collection used by marketplace
 * discovery.
 *
 * An empty query is valid and means:
 *
 *   "Return all Journeys currently eligible for public discovery."
 *
 * Optional discovery criteria narrow that public collection without changing
 * the underlying public visibility rules.
 *
 * The query intentionally belongs to the plural public-read architecture.
 * There is no separate GetPublicJourneyQuery.
 *
 * A public Journey detail request is therefore represented by the same query
 * with `publicId` supplied. The public read handler may use that identifier
 * to select one Journey from the same public projection boundary.
 *
 * The query does not expose Journey persistence entities and does not define
 * how the public projection is assembled. Those responsibilities belong to
 * the application handler and its public read dependencies.
 *
 * Public result shape:
 *
 *   PublicJourney
 *     ├── publicId
 *     ├── provider
 *     │   ├── traveller
 *     │   └── trust
 *     ├── route
 *     ├── schedule
 *     ├── vehicle
 *     ├── capacity
 *     ├── pricing
 *     ├── preferences
 *     └── assets
 *
 * Internal Journey identifiers, provider identity references, lifecycle
 * metadata, persistence timestamps, booking information, settlement data,
 * and other operational fields are intentionally outside this query's
 * public contract.
 */
export class GetPublicJourneysQuery extends Query {
  constructor(
    /**
     * Optional public Journey identifier.
     *
     * When supplied, the public read boundary selects the publicly
     * discoverable Journey with this identifier.
     *
     * This supports public Journey detail without introducing a separate
     * singular public query.
     */
    public readonly publicId?: string,

    /**
     * Optional origin filter.
     *
     * When omitted, Journeys are not restricted by origin.
     */
    public readonly from?: string,

    /**
     * Optional destination filter.
     *
     * When omitted, Journeys are not restricted by destination.
     */
    public readonly to?: string,

    /**
     * Optional journey date filter.
     *
     * When omitted, Journeys are not restricted by departure date.
     */
    public readonly date?: string,
  ) {
    super();
  }
}
