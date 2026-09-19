// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-rating.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Profile Rating Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving one rating belonging to a
// Trust Profile.
//
// Responsibility:
// - Translate primitive Trust Profile and Trust Rating identifiers into their
//   corresponding domain value objects.
// - Delegate the lookup to the TrustProfileRepository abstraction.
// - Return the TrustRatingEntity or null.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - resolve Traveller Profile data;
// - resolve public Trust projections;
// - perform HTTP concerns.
//
// TrustRatingEntity is a child entity of the TrustProfile aggregate and is
// therefore addressed in the context of its owning Trust Profile.
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
// A rating is not treated as an independent aggregate.
//
// The repository operation:
//
//     findRatingById(TrustProfileId, TrustRatingId)
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

import type { GetTrustProfileRatingQuery } from '../../queries/trust-profile/get-trust-profile-rating.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustRatingEntity } from '../../../domain/entities/trust-rating.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId, TrustRatingId } from '../../../domain/value-objects';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_PROFILE_TOKENS } from '../../trust-profile.tokens';

// =============================================================================
// Query Handler
// =============================================================================

export class GetTrustProfileRatingQueryHandler implements QueryHandler<
  GetTrustProfileRatingQuery,
  TrustRatingEntity | null
> {
  constructor(
    @Inject(TRUST_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TrustProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------
  //
  // Convert the primitive query identifiers into Trust domain value objects
  // before crossing into the repository abstraction.
  //
  // Both identifiers are required because TrustRatingEntity belongs to the
  // TrustProfile aggregate.
  //
  // ---------------------------------------------------------------------------

  async execute(
    query: GetTrustProfileRatingQuery,
  ): Promise<TrustRatingEntity | null> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);
    const ratingId = new TrustRatingId(query.ratingId);

    return this.repository.findRatingById(trustProfileId, ratingId);
  }
}
