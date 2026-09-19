// src/domains/trust/application/query-handlers/trust-badge/get-trust-badges-by-asset.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------
//
// Application-layer query handler.
//
// This handler retrieves Trust Badge definitions associated with a particular
// public Asset identifier through the Trust Badge repository abstraction.
//
// IMPORTANT:
// `TrustBadgeRepository` is a TypeScript interface and therefore does not
// exist at runtime. NestJS cannot resolve it directly as a dependency-injection
// token. The repository must be injected through the explicit
// TRUST_BADGE_TOKENS.REPOSITORY runtime token.
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustBadgesByAssetQuery } from '../../queries/trust-badge/get-trust-badges-by-asset.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustBadgeEntity } from '../../../domain/entities/trust-badge.entity';

import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { AssetPublicId } from '../../../domain/value-objects/asset-public-id.vo';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------
//
// The application layer owns the dependency-injection contract.
//
// Infrastructure is responsible for binding its concrete Trust Badge
// repository implementation to TRUST_BADGE_TOKENS.REPOSITORY.
// -----------------------------------------------------------------------------

import { TRUST_BADGE_TOKENS } from '../../trust-badge.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------
//
// Responsibility:
// - Translate the primitive asset public ID from the query into its domain
//   value object.
// - Retrieve Trust Badge definitions associated with that asset.
// - Return the domain entities to the application caller.
//
// Non-responsibilities:
// - Asset storage or delivery.
// - Asset existence validation outside the Trust Badge repository contract.
// - Prisma/database access.
// - Trust Profile badge assignments.
// - Badge awarding or revocation decisions.
//
// Asset references remain opaque public identifiers. The Trust Badge domain
// does not own the Asset aggregate or create a persistence relationship to it.
// -----------------------------------------------------------------------------

export class GetTrustBadgesByAssetQueryHandler implements QueryHandler<
  GetTrustBadgesByAssetQuery,
  TrustBadgeEntity[]
> {
  constructor(
    @Inject(TRUST_BADGE_TOKENS.REPOSITORY)
    private readonly repository: TrustBadgeRepository,
  ) {}

  execute(query: GetTrustBadgesByAssetQuery): Promise<TrustBadgeEntity[]> {
    const assetPublicId = new AssetPublicId(query.assetPublicId);

    return this.repository.findByAssetPublicId(assetPublicId);
  }
}
