import { Inject } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import type { GetTrustBadgeByPublicIdQuery } from '../../queries/trust-badge/get-trust-badge-by-public-id.query';

import type { TrustBadgeAggregate } from '../../../domain/aggregates/trust-badge.aggregate';
import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { TrustBadgeId } from '../../../domain/value-objects/trust-badge-id.vo';

import { TRUST_BADGE_TOKENS } from '../../trust-badge.tokens';

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Badge By Public ID Query Handler
// -----------------------------------------------------------------------------
//
// Retrieves a Trust Badge aggregate by its public identifier.
//
// Responsibilities:
// - Convert the primitive public ID into TrustBadgeId.
// - Delegate retrieval to TrustBadgeRepository.findByPublicId().
// - Return the aggregate or null.
//
// This handler does NOT:
// - Access Prisma directly.
// - Import infrastructure implementations.
// - Modify the Trust Badge aggregate.
// - Resolve physical Asset content or delivery URLs.
//
// -----------------------------------------------------------------------------

export class GetTrustBadgeByPublicIdQueryHandler implements QueryHandler<
  GetTrustBadgeByPublicIdQuery,
  TrustBadgeAggregate | null
> {
  constructor(
    @Inject(TRUST_BADGE_TOKENS.REPOSITORY)
    private readonly repository: TrustBadgeRepository,
  ) {}

  async execute(
    query: GetTrustBadgeByPublicIdQuery,
  ): Promise<TrustBadgeAggregate | null> {
    const publicId = new TrustBadgeId(query.publicId);

    return this.repository.findByPublicId(publicId);
  }
}
