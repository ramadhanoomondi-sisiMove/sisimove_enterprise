// src/domains/journey/application/queries/journey/get-journeys-by-provider.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneysByProviderQuery extends Query {
  constructor(
    /**
     * Public identifier of the provider.
     *
     * Provider identity belongs to the external Identity domain.
     */
    public readonly providerPublicId: string,
  ) {
    super();
  }
}
