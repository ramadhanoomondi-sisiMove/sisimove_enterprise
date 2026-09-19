// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-by-member.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Profile By Member Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving the operational Trust Profile
// belonging to a member identified by the member's opaque public identifier.
//
// Responsibility:
// - Translate the primitive query input into the Trust domain value object.
// - Delegate persistence to the TrustProfileRepository abstraction.
// - Return the TrustProfile aggregate or null.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - expose a public marketplace projection;
// - resolve Assets;
// - resolve Traveller Profile data;
// - perform HTTP concerns.
//
// Public marketplace reads use the dedicated public Trust query handler.
//
// -----------------------------------------------------------------------------
//
// Dependency injection
// -----------------------------------------------------------------------------
//
// TrustProfileRepository is a TypeScript interface and therefore does not
// exist at runtime. NestJS cannot use:
//
//     constructor(private readonly repository: TrustProfileRepository) {}
//
// as a runtime injection contract.
//
// The repository is therefore injected explicitly through the application-layer
// DI token:
//
//     TRUST_PROFILE_TOKENS.REPOSITORY
//
// The composition layer binds that token to the concrete infrastructure
// repository implementation.
//
// Dependency direction:
//
//     Query Handler
//          │
//          │ TRUST_PROFILE_TOKENS.REPOSITORY
//          ▼
//     TrustProfileRepository abstraction
//          │
//          ▼
//     Infrastructure implementation
//
// This keeps the application layer independent of Prisma and infrastructure.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Foundation
// =============================================================================

import { Inject } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// =============================================================================
// Query
// =============================================================================

import type { GetTrustProfileByMemberQuery } from '../../queries/trust-profile/get-trust-profile-by-member.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustProfileAggregate } from '../../../domain/aggregates/trust-profile.aggregate';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { MemberPublicId } from '../../../domain/value-objects/member-public-id.vo';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_PROFILE_TOKENS } from '../../trust-profile.tokens';

// =============================================================================
// Query Handler
// =============================================================================

export class GetTrustProfileByMemberQueryHandler implements QueryHandler<
  GetTrustProfileByMemberQuery,
  TrustProfileAggregate | null
> {
  constructor(
    @Inject(TRUST_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TrustProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------
  //
  // The HTTP/controller layer supplies the primitive memberPublicId string.
  //
  // The application layer converts that primitive into the Trust domain
  // MemberPublicId value object before crossing into the domain repository.
  //
  // ---------------------------------------------------------------------------

  async execute(
    query: GetTrustProfileByMemberQuery,
  ): Promise<TrustProfileAggregate | null> {
    const memberPublicId = new MemberPublicId(query.memberPublicId);

    return this.repository.findByMemberPublicId(memberPublicId);
  }
}
