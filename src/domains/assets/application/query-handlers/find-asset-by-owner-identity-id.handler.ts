import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetByOwnerIdentityIdQuery } from '../queries/find-asset-by-owner-identity-id.query';

import type { AssetEntity } from '../../domain/entities/asset.entity';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetOwnerIdentityId } from '../../domain/value-objects';

@Injectable()
export class FindAssetByOwnerIdentityIdHandler implements QueryHandler<
  FindAssetByOwnerIdentityIdQuery,
  AssetEntity[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetByOwnerIdentityIdQuery,
  ): Promise<AssetEntity[]> {
    return this.repository.findEntitiesByOwnerIdentityId(
      new AssetOwnerIdentityId(query.ownerIdentityId),
    );
  }
}
