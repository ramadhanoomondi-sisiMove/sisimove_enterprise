import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetProcessingsQuery } from '../queries/find-asset-processings.query';

import type { AssetProcessingEntity } from '../../domain/entities/asset-processing.entity';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

@Injectable()
export class FindAssetProcessingsHandler implements QueryHandler<
  FindAssetProcessingsQuery,
  AssetProcessingEntity[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetProcessingsQuery,
  ): Promise<AssetProcessingEntity[]> {
    return this.repository.findProcessings(query.assetId);
  }
}
