import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_REPOSITORY } from '../asset.tokens';

import { FindAssetsByOwnerIdentityIdQuery } from '../queries/find-assets-by-owner-identity-id.query';

import type { AssetAggregate } from '../../domain/aggregates/asset.aggregate';
import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetOwnerIdentityId } from '../../domain/value-objects';

@Injectable()
export class FindAssetsByOwnerIdentityIdHandler implements QueryHandler<
  FindAssetsByOwnerIdentityIdQuery,
  AssetAggregate[]
> {
  constructor(
    @Inject(ASSET_REPOSITORY)
    private readonly repository: AssetRepository,
  ) {}

  async execute(
    query: FindAssetsByOwnerIdentityIdQuery,
  ): Promise<AssetAggregate[]> {
    return this.repository.findByOwnerIdentityId(
      new AssetOwnerIdentityId(query.ownerIdentityId),
    );
  }
}
