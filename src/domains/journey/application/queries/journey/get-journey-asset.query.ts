// src/domains/journey/application/queries/journey/get-journey-asset.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

import type { JourneyAssetId } from '../../../domain/value-objects/journey-asset-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyAssetQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey.
     */
    public readonly journeyPublicId: JourneyPublicId,

    /**
     * Public identifier of the Journey Asset.
     */
    public readonly assetId: JourneyAssetId,
  ) {
    super();
  }
}
