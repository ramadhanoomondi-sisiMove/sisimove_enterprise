// -----------------------------------------------------------------------------
// Assets — Get Assets By Owner Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_TOKENS } from '../asset.tokens';

import type { GetAssetsByOwnerQuery } from '../queries/get-assets-by-owner.query';

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAssetsByOwnerHandler implements QueryHandler<
  GetAssetsByOwnerQuery,
  AssetAggregate[]
> {
  public constructor(
    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,
  ) {}

  public async execute(
    query: GetAssetsByOwnerQuery,
  ): Promise<AssetAggregate[]> {
    return this.assetRepository.findByOwnerIdentityPublicId(
      query.identityPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetsByOwnerHandler;
