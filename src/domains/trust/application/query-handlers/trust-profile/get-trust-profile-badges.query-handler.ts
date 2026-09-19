// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-badges.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Profile Badges Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving all badge assignments belonging to
// a Trust Profile.
//
// Responsibility:
// - Translate the primitive Trust Profile identifier into a domain value
//   object.
// - Delegate the lookup to the TrustProfileRepository abstraction.
// - Return the TrustProfileBadgeEntity collection.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - resolve Trust Badge catalogue definitions;
// - resolve Asset data;
// - construct public marketplace projections;
// - perform HTTP concerns.
//
// TrustProfileBadgeEntity is a child entity of TrustProfileAggregate.
// Therefore badge assignments are retrieved through the owning Trust Profile
// rather than being treated as independent aggregates.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary
// -----------------------------------------------------------------------------
//
// TrustProfileAggregate
// ├── TrustProfileEntity
// ├── TrustRatingEntity
// ├── TrustReviewEntity
// ├── TrustProfileBadgeEntity
// └── TrustEventEntity
//
// The repository operation:
//
//     findProfileBadges(TrustProfileId)
//
// preserves this ownership boundary.
//
// -----------------------------------------------------------------------------
//
// Dependency injection
// -----------------------------------------------------------------------------
//
// TrustProfileRepository is a TypeScript interface and therefore does not
// exist at runtime.
//
// NestJS cannot resolve:
//
//     constructor(private readonly repository: TrustProfileRepository) {}
//
// as a runtime dependency.
//
// The repository is therefore injected through the application-layer token:
//
//     TRUST_PROFILE_TOKENS.REPOSITORY
//
// The composition layer binds that token to the concrete infrastructure
// implementation.
//
// Dependency direction:
//
//     Query Handler
//          │
//          │ @Inject(TRUST_PROFILE_TOKENS.REPOSITORY)
//          ▼
//     TrustProfileRepository abstraction
//          │
//          ▼
//     Concrete infrastructure implementation
//
// The application layer remains independent of Prisma and infrastructure.
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

import type { GetTrustProfileBadgesQuery } from '../../queries/trust-profile/get-trust-profile-badges.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustProfileBadgeEntity } from '../../../domain/entities/trust-profile-badge.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects/trust-profile-id.vo';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_PROFILE_TOKENS } from '../../trust-profile.tokens';

// =============================================================================
// Query Handler
// =============================================================================

export class GetTrustProfileBadgesQueryHandler implements QueryHandler<
  GetTrustProfileBadgesQuery,
  TrustProfileBadgeEntity[]
> {
  constructor(
    @Inject(TRUST_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TrustProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------
  //
  // The query boundary supplies the Trust Profile identifier as a primitive.
  //
  // Convert it into the Trust domain value object before crossing into the
  // repository abstraction.
  //
  // The repository then retrieves the badge assignments owned by that Trust
  // Profile.
  //
  // ---------------------------------------------------------------------------

  async execute(
    query: GetTrustProfileBadgesQuery,
  ): Promise<TrustProfileBadgeEntity[]> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);

    return this.repository.findProfileBadges(trustProfileId);
  }
}
