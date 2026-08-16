// src/domains/journey/application/queries/journey/get-journeys-by-provider-and-status.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyStatus } from '../../../domain/value-objects/journey-status.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneysByProviderAndStatusQuery extends Query {
  constructor(
    /**
     * Public identifier of the provider.
     *
     * Provider identity belongs to the external Identity domain.
     */
    public readonly providerPublicId: string,

    /**
     * Journey lifecycle status.
     */
    public readonly status: JourneyStatus,
  ) {
    super();
  }
}
