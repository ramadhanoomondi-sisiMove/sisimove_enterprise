import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { AssetExistsByChecksumQuery } from '../queries/asset-exists-by-checksum.query';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

@Injectable()
export class AssetExistsByChecksumHandler implements QueryHandler<
  AssetExistsByChecksumQuery,
  boolean
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(query: AssetExistsByChecksumQuery): Promise<boolean> {
    return this.repository.existsByChecksum(query.algorithm, query.checksum);
  }
}
