// src/domains/trust/application/query-handlers/trust-badge/get-trust-badges-by-asset.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustBadgesByAssetQuery } from '../../queries/trust-badge/get-trust-badges-by-asset.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustBadgeEntity } from '../../../domain/entities/trust-badge.entity';

import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { AssetPublicId } from '../../../domain/value-objects/asset-public-id.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustBadgesByAssetQueryHandler implements QueryHandler<
  GetTrustBadgesByAssetQuery,
  TrustBadgeEntity[]
> {
  constructor(private readonly repository: TrustBadgeRepository) {}

  execute(query: GetTrustBadgesByAssetQuery): Promise<TrustBadgeEntity[]> {
    const assetPublicId = new AssetPublicId(query.assetPublicId);

    return this.repository.findByAssetPublicId(assetPublicId);
  }
}
