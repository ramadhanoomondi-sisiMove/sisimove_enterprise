// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-badge.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Profile Badge Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving one badge assignment belonging to a
// Trust Profile.
//
// Responsibility:
// - Translate primitive query identifiers into Trust domain value objects.
// - Delegate the lookup to the TrustProfileRepository abstraction.
// - Return the requested TrustProfileBadgeEntity or null.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - resolve Trust Badge catalogue definitions;
// - resolve Asset data;
// - construct public marketplace projections;
// - perform HTTP concerns.
//
// The repository owns the persistence lookup for the TrustProfile aggregate
// and its child TrustProfileBadgeEntity.
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
// TrustProfileBadgeEntity is a child entity of TrustProfileAggregate.
//
// It is therefore addressed using BOTH:
// - the owning TrustProfile identifier;
// - the child TrustProfileBadge identifier.
//
// The application query preserves that aggregate boundary by passing:
//
//     TrustProfileId
//     TrustProfileBadgeId
//
// to the repository.
//
// -----------------------------------------------------------------------------
//
// Dependency injection
// -----------------------------------------------------------------------------
//
// TrustProfileRepository is a TypeScript interface and therefore does not
// exist at runtime.
//
// NestJS cannot resolve an interface from:
//
//     constructor(private readonly repository: TrustProfileRepository) {}
//
// The repository must instead be resolved through the application-layer DI
// token:
//
//     TRUST_PROFILE_TOKENS.REPOSITORY
//
// The infrastructure/composition layer binds that token to the concrete
// repository implementation.
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
// The application layer therefore remains independent of Prisma and all other
// infrastructure concerns.
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

import type { GetTrustProfileBadgeQuery } from '../../queries/trust-profile/get-trust-profile-badge.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustProfileBadgeEntity } from '../../../domain/entities/trust-profile-badge.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import {
  TrustProfileBadgeId,
  TrustProfileId,
} from '../../../domain/value-objects';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_PROFILE_TOKENS } from '../../trust-profile.tokens';

// =============================================================================
// Query Handler
// =============================================================================

export class GetTrustProfileBadgeQueryHandler implements QueryHandler<
  GetTrustProfileBadgeQuery,
  TrustProfileBadgeEntity | null
> {
  constructor(
    @Inject(TRUST_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TrustProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------
  //
  // The controller/application boundary supplies primitive identifiers.
  //
  // The application layer converts those primitives into the corresponding
  // Trust domain value objects before calling the repository.
  //
  // The child badge is resolved within the context of its owning Trust Profile.
  // This prevents the query from treating TrustProfileBadgeEntity as an
  // independent aggregate.
  //
  // ---------------------------------------------------------------------------

  async execute(
    query: GetTrustProfileBadgeQuery,
  ): Promise<TrustProfileBadgeEntity | null> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);
    const profileBadgeId = new TrustProfileBadgeId(query.profileBadgeId);

    return this.repository.findProfileBadgeById(trustProfileId, profileBadgeId);
  }
}
