// src/domains/trust/application/query-handlers/trust-badge/get-trust-badge.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------
//
// Application-layer query handler.
//
// This handler coordinates the retrieval of a Trust Badge through the domain
// repository abstraction. It does not know how the repository is implemented.
//
// IMPORTANT:
// `TrustBadgeRepository` is a TypeScript interface and therefore does not
// exist at runtime. NestJS cannot use the interface itself as a dependency
// injection token. The concrete repository must therefore be resolved through
// the explicit TRUST_BADGE_TOKENS.REPOSITORY runtime token.
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustBadgeQuery } from '../../queries/trust-badge/get-trust-badge.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustBadgeEntity } from '../../../domain/entities/trust-badge.entity';
import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { TrustBadgeId } from '../../../domain/value-objects/trust-badge-id.vo';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------
//
// Runtime dependency-injection tokens belong to the application boundary.
// Infrastructure provides the concrete implementation and binds it to this
// token in the module composition root.
// -----------------------------------------------------------------------------

import { TRUST_BADGE_TOKENS } from '../../trust-badge.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------
//
// Responsibility:
// - Translate the primitive query identifier into the domain TrustBadgeId VO.
// - Retrieve the Trust Badge aggregate through the repository abstraction.
// - Return the contained TrustBadgeEntity to the application caller.
//
// Non-responsibilities:
// - Persistence implementation.
// - Prisma/database access.
// - Asset storage or delivery.
// - Badge awarding.
// - Trust Profile badge assignment.
//
// The TrustBadge aggregate owns the badge definition. The Trust Profile owns
// assignments of badges to travellers.
// -----------------------------------------------------------------------------

export class GetTrustBadgeQueryHandler implements QueryHandler<
  GetTrustBadgeQuery,
  TrustBadgeEntity | null
> {
  constructor(
    @Inject(TRUST_BADGE_TOKENS.REPOSITORY)
    private readonly repository: TrustBadgeRepository,
  ) {}

  async execute(query: GetTrustBadgeQuery): Promise<TrustBadgeEntity | null> {
    const trustBadgeId = new TrustBadgeId(query.trustBadgeId);

    const aggregate = await this.repository.findById(trustBadgeId);

    if (aggregate === null) {
      return null;
    }

    return aggregate.badge;
  }
}
