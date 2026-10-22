import { Inject } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

import type { GetTrustBadgesQuery } from '../../queries/trust-badge/get-trust-badges.query';

import type { TrustBadgeEntity } from '../../../domain/entities/trust-badge.entity';
import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { TRUST_BADGE_TOKENS } from '../../trust-badge.tokens';

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Badges Query Handler
// -----------------------------------------------------------------------------
//
// Retrieves all Trust Badge entities through the repository abstraction.
//
// Responsibilities:
// - Delegate retrieval to TrustBadgeRepository.findAll().
// - Return the badge entities supplied by the repository.
//
// This handler does NOT:
// - Access Prisma directly.
// - Import infrastructure implementations.
// - Modify badge definitions.
// - Resolve Asset content or delivery URLs.
//
// -----------------------------------------------------------------------------

export class GetTrustBadgesQueryHandler implements QueryHandler<
  GetTrustBadgesQuery,
  TrustBadgeEntity[]
> {
  constructor(
    @Inject(TRUST_BADGE_TOKENS.REPOSITORY)
    private readonly repository: TrustBadgeRepository,
  ) {}

  async execute(query: GetTrustBadgesQuery): Promise<TrustBadgeEntity[]> {
    void query;

    return this.repository.findAll();
  }
}
