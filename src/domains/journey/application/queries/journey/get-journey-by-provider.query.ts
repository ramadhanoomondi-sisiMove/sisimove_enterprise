// src/domains/journey/application/queries/journey/get-journeys-by-provider.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyByProviderQuery extends Query {
  constructor(
    /**
     * Public identifier of the provider.
     *
     * Provider identity belongs to the Identity domain, so Journey
     * does not introduce a Journey-specific ProviderPublicId value object.
     */
    public readonly providerPublicId: string,
  ) {
    super();
  }
}
