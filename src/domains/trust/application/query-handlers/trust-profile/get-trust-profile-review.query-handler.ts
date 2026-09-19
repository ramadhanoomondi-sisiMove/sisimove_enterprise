// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-review.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Profile Review Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving one review belonging to a
// Trust Profile.
//
// Responsibility:
// - Translate primitive Trust Profile and Trust Review identifiers into their
//   corresponding domain value objects.
// - Delegate the lookup to the TrustProfileRepository abstraction.
// - Return the TrustReviewEntity or null.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - resolve Traveller Profile data;
// - construct public Trust projections;
// - perform HTTP concerns.
//
// TrustReviewEntity is a child entity of TrustProfileAggregate and is therefore
// addressed within the context of its owning Trust Profile.
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
// A review is not an independent aggregate.
//
// The repository operation:
//
//     findReviewById(TrustProfileId, TrustReviewId)
//
// preserves the parent-child aggregate boundary by requiring both identifiers.
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
// The repository is therefore injected through the application-layer DI token:
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

import type { GetTrustProfileReviewQuery } from '../../queries/trust-profile/get-trust-profile-review.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustReviewEntity } from '../../../domain/entities/trust-review.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId, TrustReviewId } from '../../../domain/value-objects';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_PROFILE_TOKENS } from '../../trust-profile.tokens';

// =============================================================================
// Query Handler
// =============================================================================

export class GetTrustProfileReviewQueryHandler implements QueryHandler<
  GetTrustProfileReviewQuery,
  TrustReviewEntity | null
> {
  constructor(
    @Inject(TRUST_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TrustProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------
  //
  // Convert the primitive identifiers supplied by the query into Trust domain
  // value objects before crossing into the repository abstraction.
  //
  // Both identifiers are required because TrustReviewEntity belongs to the
  // TrustProfile aggregate.
  //
  // ---------------------------------------------------------------------------

  async execute(
    query: GetTrustProfileReviewQuery,
  ): Promise<TrustReviewEntity | null> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);
    const reviewId = new TrustReviewId(query.reviewId);

    return this.repository.findReviewById(trustProfileId, reviewId);
  }
}
