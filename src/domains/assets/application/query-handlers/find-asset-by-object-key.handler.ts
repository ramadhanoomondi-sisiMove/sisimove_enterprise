import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetByObjectKeyQuery } from '../queries/find-asset-by-object-key.query';

import type { AssetAggregate } from '../../domain/aggregates/asset.aggregate';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

@Injectable()
export class FindAssetByObjectKeyHandler implements QueryHandler<
  FindAssetByObjectKeyQuery,
  AssetAggregate | null
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetByObjectKeyQuery,
  ): Promise<AssetAggregate | null> {
    return this.repository.findByObjectKey(query.objectKey);
  }
}
