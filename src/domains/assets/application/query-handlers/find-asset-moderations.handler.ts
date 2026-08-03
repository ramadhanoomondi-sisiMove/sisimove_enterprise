import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetModerationsQuery } from '../queries/find-asset-moderations.query';

import type { AssetModerationEntity } from '../../domain/entities/asset-moderation.entity';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

@Injectable()
export class FindAssetModerationsHandler implements QueryHandler<
  FindAssetModerationsQuery,
  AssetModerationEntity[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetModerationsQuery,
  ): Promise<AssetModerationEntity[]> {
    return this.repository.findModerations(query.assetId);
  }
}
