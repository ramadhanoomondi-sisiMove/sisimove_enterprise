// -----------------------------------------------------------------------------
// Assets — Check Asset Exists Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for checking Asset existence.
//
// Supported lookup criteria:
//
// - AssetPublicId
// - AssetObjectKey
//
// Exactly one criterion is expected.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { ASSET_TOKENS } from '../asset.tokens';

import type {
  CheckAssetExistsCriteria,
  CheckAssetExistsQuery,
} from '../queries/check-asset-exists.query';

import type { AssetRepository } from '../../domain/repositories/asset.repository';

import { AssetException } from '../../domain/exceptions/asset.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CheckAssetExistsHandler implements QueryHandler<
  CheckAssetExistsQuery,
  boolean
> {
  public constructor(
    @Inject(ASSET_TOKENS.REPOSITORIES.ASSET)
    private readonly assetRepository: AssetRepository,
  ) {}

  public async execute(query: CheckAssetExistsQuery): Promise<boolean> {
    const criteria = query.criteria;

    this.ensureExactlyOneCriterion(criteria);

    if (criteria.publicId !== undefined) {
      return this.assetRepository.existsByPublicId(criteria.publicId);
    }

    if (criteria.objectKey !== undefined) {
      return this.assetRepository.existsByObjectKey(criteria.objectKey);
    }

    throw new AssetException(
      'Asset existence criteria must contain a supported lookup value.',
    );
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  private ensureExactlyOneCriterion(criteria: CheckAssetExistsCriteria): void {
    const criterionCount =
      Number(criteria.publicId !== undefined) +
      Number(criteria.objectKey !== undefined);

    if (criterionCount !== 1) {
      throw new AssetException(
        'Asset existence query requires exactly one lookup criterion.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CheckAssetExistsHandler;
