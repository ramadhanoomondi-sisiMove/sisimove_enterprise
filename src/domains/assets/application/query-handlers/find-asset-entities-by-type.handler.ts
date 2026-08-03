import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetEntitiesByTypeQuery } from '../queries/find-asset-entities-by-type.query';

import type { AssetEntity } from '../../domain/entities/asset.entity';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

@Injectable()
export class FindAssetEntitiesByTypeHandler implements QueryHandler<
  FindAssetEntitiesByTypeQuery,
  AssetEntity[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(query: FindAssetEntitiesByTypeQuery): Promise<AssetEntity[]> {
    return this.repository.findEntitiesByType(query.type);
  }
}
