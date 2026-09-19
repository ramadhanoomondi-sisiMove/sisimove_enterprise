// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Profile Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a Trust Profile aggregate by its
// Trust Profile identifier.
//
// Responsibility:
// - Translate the primitive Trust Profile identifier into its domain value
//   object.
// - Delegate persistence to the TrustProfileRepository abstraction.
// - Return the TrustProfile aggregate or null.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - resolve Traveller Profile data;
// - construct public Trust projections;
// - perform HTTP concerns.
//
// Public marketplace reads use dedicated public Trust query handlers and must
// not reuse this operational aggregate query as a public projection boundary.
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
// This query retrieves the aggregate through its canonical TrustProfileId.
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

import type { GetTrustProfileQuery } from '../../queries/trust-profile/get-trust-profile.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustProfileAggregate } from '../../../domain/aggregates/trust-profile.aggregate';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects/trust-profile-id.vo';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_PROFILE_TOKENS } from '../../trust-profile.tokens';

// =============================================================================
// Query Handler
// =============================================================================

export class GetTrustProfileQueryHandler implements QueryHandler<
  GetTrustProfileQuery,
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
  // Convert the primitive Trust Profile identifier supplied by the query into
  // the Trust domain value object before crossing into the repository
  // abstraction.
  //
  // The repository remains responsible for loading the complete operational
  // TrustProfile aggregate.
  //
  // ---------------------------------------------------------------------------

  async execute(
    query: GetTrustProfileQuery,
  ): Promise<TrustProfileAggregate | null> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);

    return this.repository.findById(trustProfileId);
  }
}
