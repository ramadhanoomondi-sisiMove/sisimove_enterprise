import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetScansQuery } from '../queries/find-asset-scans.query';

import type { AssetRepository } from '../../domain/repositories/asset.repository';
import type { AssetScanEntity } from '../../domain/entities/asset-scan.entity';

@Injectable()
export class FindAssetScansHandler implements QueryHandler<
  FindAssetScansQuery,
  AssetScanEntity[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(query: FindAssetScansQuery): Promise<AssetScanEntity[]> {
    return this.repository.findScans(query.assetId);
  }
}
