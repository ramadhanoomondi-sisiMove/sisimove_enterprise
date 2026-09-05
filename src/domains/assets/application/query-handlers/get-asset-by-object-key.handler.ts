// -----------------------------------------------------------------------------
// Assets — Get Asset By Object Key Query Handler
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_TOKENS } from '../asset.tokens';

import type { GetAssetByObjectKeyQuery } from '../queries/get-asset-by-object-key.query';

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetNotFoundException } from '../../domain/exceptions/asset-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAssetByObjectKeyHandler implements QueryHandler<
  GetAssetByObjectKeyQuery,
  AssetAggregate
> {
  public constructor(
    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,
  ) {}

  public async execute(
    query: GetAssetByObjectKeyQuery,
  ): Promise<AssetAggregate> {
    const aggregate = await this.assetRepository.findByObjectKey(
      query.objectKey,
    );

    if (!aggregate) {
      throw new AssetNotFoundException(
        `Asset with object key ${query.objectKey.value} was not found.`,
      );
    }

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetByObjectKeyHandler;
