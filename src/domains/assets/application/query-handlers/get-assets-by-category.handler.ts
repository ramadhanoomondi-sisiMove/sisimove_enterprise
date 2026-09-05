// -----------------------------------------------------------------------------
// Assets — Get Assets By Category Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_TOKENS } from '../asset.tokens';

import type { GetAssetsByCategoryQuery } from '../queries/get-assets-by-category.query';

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAssetsByCategoryHandler implements QueryHandler<
  GetAssetsByCategoryQuery,
  AssetAggregate[]
> {
  public constructor(
    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,
  ) {}

  public async execute(
    query: GetAssetsByCategoryQuery,
  ): Promise<AssetAggregate[]> {
    return this.assetRepository.findByCategory(query.category);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetsByCategoryHandler;
