// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-reviews.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Profile Reviews Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving all reviews belonging to a
// Trust Profile.
//
// Responsibility:
// - Translate the primitive Trust Profile identifier into its domain value
//   object.
// - Delegate the review lookup to the TrustProfileRepository abstraction.
// - Return the TrustReviewEntity collection.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - resolve Traveller Profile data;
// - construct public Trust projections;
// - perform HTTP concerns.
//
// TrustReviewEntity is a child entity of TrustProfileAggregate and therefore
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
// Reviews are not independent aggregates.
//
// The repository operation:
//
//     findReviews(TrustProfileId)
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

import type { GetTrustProfileReviewsQuery } from '../../queries/trust-profile/get-trust-profile-reviews.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustReviewEntity } from '../../../domain/entities/trust-review.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects/trust-profile-id.vo';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_PROFILE_TOKENS } from '../../trust-profile.tokens';

// =============================================================================
// Query Handler
// =============================================================================

export class GetTrustProfileReviewsQueryHandler implements QueryHandler<
  GetTrustProfileReviewsQuery,
  TrustReviewEntity[]
> {
  constructor(
    @Inject(TRUST_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TrustProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------
  //
  // Convert the primitive Trust Profile identifier supplied by the query into
  // the Trust domain value object before crossing into the repository
  // abstraction.
  //
  // The repository remains responsible for retrieving the reviews belonging
  // to the specified Trust Profile.
  //
  // ---------------------------------------------------------------------------

  async execute(
    query: GetTrustProfileReviewsQuery,
  ): Promise<TrustReviewEntity[]> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);

    return this.repository.findReviews(trustProfileId);
  }
}
