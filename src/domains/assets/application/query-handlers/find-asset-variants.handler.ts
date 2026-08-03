import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetVariantsQuery } from '../queries/find-asset-variants.query';

import type { AssetRepository } from '../../domain/repositories/asset.repository';
import type { AssetVariantEntity } from '../../domain/entities/asset-variant.entity';

@Injectable()
export class FindAssetVariantsHandler implements QueryHandler<
  FindAssetVariantsQuery,
  AssetVariantEntity[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(query: FindAssetVariantsQuery): Promise<AssetVariantEntity[]> {
    return this.repository.findVariants(query.assetId);
  }
}
