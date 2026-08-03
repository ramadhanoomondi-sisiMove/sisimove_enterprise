import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { AssetExistsByPublicIdQuery } from '../queries/asset-exists-by-public-id.query';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetId } from '../../domain/value-objects';

@Injectable()
export class AssetExistsByPublicIdHandler implements QueryHandler<
  AssetExistsByPublicIdQuery,
  boolean
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(query: AssetExistsByPublicIdQuery): Promise<boolean> {
    return this.repository.existsByPublicId(new AssetId(query.assetId));
  }
}
