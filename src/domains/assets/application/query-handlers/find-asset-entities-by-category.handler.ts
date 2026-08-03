import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetEntitiesByCategoryQuery } from '../queries/find-asset-entities-by-category.query';

import type { AssetEntity } from '../../domain/entities/asset.entity';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetCategory } from '../../domain/value-objects';

@Injectable()
export class FindAssetEntitiesByCategoryHandler implements QueryHandler<
  FindAssetEntitiesByCategoryQuery,
  AssetEntity[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetEntitiesByCategoryQuery,
  ): Promise<AssetEntity[]> {
    return this.repository.findEntitiesByCategory(
      query.category as AssetCategory,
    );
  }
}
