// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-by-member.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetTrustProfileByMemberQuery } from '../../queries/trust-profile/get-trust-profile-by-member.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { TrustProfileAggregate } from '../../../domain/aggregates/trust-profile.aggregate';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { MemberPublicId } from '../../../domain/value-objects/member-public-id.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetTrustProfileByMemberQueryHandler implements QueryHandler<
  GetTrustProfileByMemberQuery,
  TrustProfileAggregate | null
> {
  constructor(private readonly repository: TrustProfileRepository) {}

  async execute(
    query: GetTrustProfileByMemberQuery,
  ): Promise<TrustProfileAggregate | null> {
    const memberPublicId = new MemberPublicId(query.memberPublicId);

    return this.repository.findByMemberPublicId(memberPublicId);
  }
}
