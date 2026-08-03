import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { AssetExistsByObjectKeyQuery } from '../queries/asset-exists-by-object-key.query';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

@Injectable()
export class AssetExistsByObjectKeyHandler implements QueryHandler<
  AssetExistsByObjectKeyQuery,
  boolean
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(query: AssetExistsByObjectKeyQuery): Promise<boolean> {
    return this.repository.existsByObjectKey(query.objectKey);
  }
}
