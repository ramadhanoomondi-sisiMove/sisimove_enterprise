import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetVariantQuery } from '../queries/find-asset-variant.query';

import type { AssetRepository } from '../../domain/repositories/asset.repository';
import type { AssetVariantEntity } from '../../domain/entities/asset-variant.entity';

@Injectable()
export class FindAssetVariantHandler implements QueryHandler<
  FindAssetVariantQuery,
  AssetVariantEntity | null
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetVariantQuery,
  ): Promise<AssetVariantEntity | null> {
    return this.repository.findVariant(query.assetId, query.variant);
  }
}
