import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetEntityByObjectKeyQuery } from '../queries/find-asset-entity-by-object-key.query';

import type { AssetEntity } from '../../domain/entities/asset.entity';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

@Injectable()
export class FindAssetEntityByObjectKeyHandler implements QueryHandler<
  FindAssetEntityByObjectKeyQuery,
  AssetEntity | null
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetEntityByObjectKeyQuery,
  ): Promise<AssetEntity | null> {
    return this.repository.findEntityByObjectKey(query.objectKey);
  }
}
