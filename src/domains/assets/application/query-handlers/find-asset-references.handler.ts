import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetReferencesQuery } from '../queries/find-asset-references.query';

import type { AssetRepository } from '../../domain/repositories/asset.repository';
import type { AssetReferenceEntity } from '../../domain/entities/asset-reference.entity';

@Injectable()
export class FindAssetReferencesHandler implements QueryHandler<
  FindAssetReferencesQuery,
  AssetReferenceEntity[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetReferencesQuery,
  ): Promise<AssetReferenceEntity[]> {
    return this.repository.findReferences(query.assetId);
  }
}
