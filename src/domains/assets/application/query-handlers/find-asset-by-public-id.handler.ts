import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetByPublicIdQuery } from '../queries/find-asset-by-public-id.query';

import type { AssetAggregate } from '../../domain/aggregates/asset.aggregate';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetId } from '../../domain/value-objects';

@Injectable()
export class FindAssetByPublicIdHandler implements QueryHandler<
  FindAssetByPublicIdQuery,
  AssetAggregate | null
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetByPublicIdQuery,
  ): Promise<AssetAggregate | null> {
    return this.repository.findByPublicId(new AssetId(query.assetId));
  }
}
