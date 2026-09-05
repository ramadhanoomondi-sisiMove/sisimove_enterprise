// -----------------------------------------------------------------------------
// Assets — Get Assets By Status Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_TOKENS } from '../asset.tokens';

import type { GetAssetsByStatusQuery } from '../queries/get-assets-by-status.query';

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAssetsByStatusHandler implements QueryHandler<
  GetAssetsByStatusQuery,
  AssetAggregate[]
> {
  public constructor(
    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,
  ) {}

  public async execute(
    query: GetAssetsByStatusQuery,
  ): Promise<AssetAggregate[]> {
    return this.assetRepository.findByStatus(query.status);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetsByStatusHandler;
