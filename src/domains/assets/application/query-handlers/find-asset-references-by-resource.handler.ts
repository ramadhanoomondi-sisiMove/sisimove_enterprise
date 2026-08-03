import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetReferencesByResourceQuery } from '../queries/find-asset-references-by-resource.query';

import type { AssetReferenceEntity } from '../../domain/entities/asset-reference.entity';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

@Injectable()
export class FindAssetReferencesByResourceHandler implements QueryHandler<
  FindAssetReferencesByResourceQuery,
  AssetReferenceEntity[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetReferencesByResourceQuery,
  ): Promise<AssetReferenceEntity[]> {
    return this.repository.findReferencesByResource(
      query.resourceType,
      query.resourcePublicId,
    );
  }
}
