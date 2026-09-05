// -----------------------------------------------------------------------------
// Assets — Get Assets Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_TOKENS } from '../asset.tokens';

import type { GetAssetsQuery } from '../queries/get-assets.query';

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAssetsHandler implements QueryHandler<
  GetAssetsQuery,
  AssetAggregate[]
> {
  public constructor(
    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,
  ) {}

  public async execute(): Promise<AssetAggregate[]> {
    return this.assetRepository.findAll();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetsHandler;
