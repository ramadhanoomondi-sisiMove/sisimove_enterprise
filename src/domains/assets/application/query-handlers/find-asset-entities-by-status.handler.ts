import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetEntitiesByStatusQuery } from '../queries/find-asset-entities-by-status.query';

import type { AssetEntity } from '../../domain/entities/asset.entity';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

@Injectable()
export class FindAssetEntitiesByStatusHandler implements QueryHandler<
  FindAssetEntitiesByStatusQuery,
  AssetEntity[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(query: FindAssetEntitiesByStatusQuery): Promise<AssetEntity[]> {
    return this.repository.findEntitiesByStatus(query.status);
  }
}
