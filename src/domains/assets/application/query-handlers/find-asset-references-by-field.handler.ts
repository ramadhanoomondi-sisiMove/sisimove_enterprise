import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetReferencesByFieldQuery } from '../queries/find-asset-references-by-field.query';

import type { AssetReferenceEntity } from '../../domain/entities/asset-reference.entity';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

@Injectable()
export class FindAssetReferencesByFieldHandler implements QueryHandler<
  FindAssetReferencesByFieldQuery,
  AssetReferenceEntity[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetReferencesByFieldQuery,
  ): Promise<AssetReferenceEntity[]> {
    return this.repository.findReferencesByField(
      query.resourceType,
      query.resourcePublicId,
      query.referenceField,
    );
  }
}
