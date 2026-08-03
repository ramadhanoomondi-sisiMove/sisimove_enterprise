import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetEntityByPublicIdQuery } from '../queries/find-asset-entity-by-public-id.query';

import type { AssetEntity } from '../../domain/entities/asset.entity';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetId } from '../../domain/value-objects';

@Injectable()
export class FindAssetEntityByPublicIdHandler implements QueryHandler<
  FindAssetEntityByPublicIdQuery,
  AssetEntity | null
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetEntityByPublicIdQuery,
  ): Promise<AssetEntity | null> {
    return this.repository.findEntityByPublicId(new AssetId(query.assetId));
  }
}
