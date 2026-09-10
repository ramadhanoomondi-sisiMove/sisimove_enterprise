// src/domains/journey/application/queries/journey/search-published-journeys.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class SearchPublishedJourneysQuery extends Query {
  constructor(
    /**
     * Journey origin.
     *
     * Supplied by the public journey discovery/search form.
     */
    public readonly origin: string,

    /**
     * Journey destination.
     *
     * Supplied by the public journey discovery/search form.
     */
    public readonly destination: string,

    /**
     * Requested journey date.
     *
     * Calendar date in YYYY-MM-DD format.
     */
    public readonly date: string,
  ) {
    super();
  }
}
