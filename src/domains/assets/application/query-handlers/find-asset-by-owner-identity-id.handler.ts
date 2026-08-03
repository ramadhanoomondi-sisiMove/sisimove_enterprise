import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetEntitiesByOwnerIdentityIdQuery } from '../queries/find-asset-by-owner-identity-id.handler';

import type { AssetEntity } from '../../domain/entities/asset.entity';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetOwnerIdentityId } from '../../domain/value-objects';

@Injectable()
export class FindAssetByOwnerIdentityIdHandler implements QueryHandler<
  FindAssetEntitiesByOwnerIdentityIdQuery,
  AssetEntity[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetEntitiesByOwnerIdentityIdQuery,
  ): Promise<AssetEntity[]> {
    return this.repository.findEntitiesByOwnerIdentityId(
      new AssetOwnerIdentityId(query.ownerIdentityId),
    );
  }
}
