// src/domains/journey/application/queries/journey/get-journey-asset-by-reference.query.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';

import type { JourneyAssetPublicIdReference } from '../../../domain/value-objects/journey-asset-public-id-reference.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyAssetByReferenceQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey.
     */
    public readonly journeyPublicId: JourneyPublicId,

    /**
     * External Asset public identifier referenced by the Journey Asset.
     */
    public readonly assetPublicId: JourneyAssetPublicIdReference,
  ) {
    super();
  }
}
