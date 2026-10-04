// src/domains/journey/application/queries/public/get-public-journeys.query.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Public Journeys Query
// -----------------------------------------------------------------------------
//
// Retrieves Journeys through the public marketplace read boundary.
//
// Public discoverability is determined by the Journey repository, not by
// callers of this query.
//
// A Journey is publicly discoverable only when:
//
//   1. its lifecycle status is marketplace-visible; and
//   2. its scheduled departure time has not elapsed.
//
// Therefore:
//
//   marketplace-visible status
//   AND
//   departureAt > now
//   =
//   publicly discoverable
//
// The query does not expose lifecycle status as a caller-controlled filter.
// Callers cannot use this query to bypass public visibility rules.
//
// Public visibility is enforced consistently for:
//
//   - public Journey collection;
//   - public Journey search;
//   - public Journey detail by publicId.
//
// A Journey whose departure time has elapsed is therefore excluded from public
// discovery even if its persisted lifecycle status has not yet transitioned
// to EXPIRED.
//
// EXPIRED and CANCELLED Journeys are also excluded from public discovery.
//
// Marketplace price filtering is an additional discovery constraint:
//
//   minPrice <= Journey price per seat <= maxPrice
//
// Price boundaries are optional and expressed in KES.
//
// The query does not change Journey visibility. It only narrows the set of
// Journeys that are already publicly discoverable.
//
// The provider's Journey history is a separate read boundary and is not
// governed by this query.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetPublicJourneysQuery extends Query {
  constructor(
    /**
     * Optional public Journey identifier.
     *
     * When supplied, the public read boundary returns the Journey only when
     * it is currently publicly discoverable.
     *
     * A Journey is not returned merely because the publicId exists.
     */
    public readonly publicId?: string,

    /**
     * Optional origin filter.
     *
     * Narrows the already-publicly-discoverable Journey collection.
     */
    public readonly from?: string,

    /**
     * Optional destination filter.
     *
     * Narrows the already-publicly-discoverable Journey collection.
     */
    public readonly to?: string,

    /**
     * Optional Journey date filter.
     *
     * Narrows the already-publicly-discoverable Journey collection.
     */
    public readonly date?: string,

    /**
     * Optional minimum Journey price per seat.
     *
     * Currency:
     *   KES
     *
     * The value is inclusive.
     *
     * Example:
     *
     *   minPrice = 500
     *
     * means:
     *
     *   Journey price per seat >= KES 500
     */
    public readonly minPrice?: number,

    /**
     * Optional maximum Journey price per seat.
     *
     * Currency:
     *   KES
     *
     * The value is inclusive.
     *
     * Example:
     *
     *   maxPrice = 1500
     *
     * means:
     *
     *   Journey price per seat <= KES 1,500
     */
    public readonly maxPrice?: number,
  ) {
    super();
  }
}
