// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-ratings.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Profile Ratings Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving all ratings belonging to a
// Trust Profile.
//
// Responsibility:
// - Translate the primitive Trust Profile identifier into its domain value
//   object.
// - Delegate the rating lookup to the TrustProfileRepository abstraction.
// - Return the TrustRatingEntity collection.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - resolve Traveller Profile data;
// - construct public Trust projections;
// - perform HTTP concerns.
//
// TrustRatingEntity is a child entity of TrustProfileAggregate and therefore
// remains addressed through its owning Trust Profile.
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
// Ratings are not independent aggregates.
//
// The repository operation:
//
//     findRatings(TrustProfileId)
//
// preserves the TrustProfile aggregate ownership boundary.
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
// The repository must therefore be injected through the application-layer DI
// token:
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

import type { GetTrustProfileRatingsQuery } from '../../queries/trust-profile/get-trust-profile-ratings.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustRatingEntity } from '../../../domain/entities/trust-rating.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects/trust-profile-id.vo';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_PROFILE_TOKENS } from '../../trust-profile.tokens';

// =============================================================================
// Query Handler
// =============================================================================

export class GetTrustProfileRatingsQueryHandler implements QueryHandler<
  GetTrustProfileRatingsQuery,
  TrustRatingEntity[]
> {
  constructor(
    @Inject(TRUST_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TrustProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------
  //
  // Convert the primitive Trust Profile identifier from the query into the
  // Trust domain value object before crossing into the repository abstraction.
  //
  // The repository remains responsible for retrieving the ratings belonging to
  // the specified Trust Profile.
  //
  // ---------------------------------------------------------------------------

  async execute(
    query: GetTrustProfileRatingsQuery,
  ): Promise<TrustRatingEntity[]> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);

    return this.repository.findRatings(trustProfileId);
  }
}
