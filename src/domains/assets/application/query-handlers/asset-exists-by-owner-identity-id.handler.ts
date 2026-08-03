import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { AssetExistsByOwnerIdentityIdQuery } from '../queries/asset-exists-by-owner-identity-id.query';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetOwnerIdentityId } from '../../domain/value-objects';

@Injectable()
export class AssetExistsByOwnerIdentityIdHandler implements QueryHandler<
  AssetExistsByOwnerIdentityIdQuery,
  boolean
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(query: AssetExistsByOwnerIdentityIdQuery): Promise<boolean> {
    return this.repository.existsByOwnerIdentityId(
      new AssetOwnerIdentityId(query.ownerIdentityId),
    );
  }
}
