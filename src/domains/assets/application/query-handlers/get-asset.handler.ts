// -----------------------------------------------------------------------------
// Assets — Get Asset Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving a single Asset aggregate by public ID.
//
// Responsibilities:
//
// - load the Asset aggregate through AssetRepository;
// - return the aggregate;
// - translate absence into AssetNotFoundException.
//
// The handler does NOT:
//
// - modify the Asset;
// - access Prisma;
// - access physical storage;
// - generate URLs;
// - perform authorization.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_TOKENS } from '../asset.tokens';

import type { GetAssetQuery } from '../queries/get-asset.query';

import { AssetAggregate } from '../../domain/aggregates/asset.aggregate';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetNotFoundException } from '../../domain/exceptions/asset-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetAssetHandler implements QueryHandler<
  GetAssetQuery,
  AssetAggregate
> {
  public constructor(
    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,
  ) {}

  public async execute(query: GetAssetQuery): Promise<AssetAggregate> {
    const aggregate = await this.assetRepository.findByPublicId(query.publicId);

    if (!aggregate) {
      throw new AssetNotFoundException(
        `Asset with public ID ${query.publicId.value} was not found.`,
      );
    }

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAssetHandler;
