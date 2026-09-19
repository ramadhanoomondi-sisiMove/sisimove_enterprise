// src/domains/trust/application/query-handlers/trust-badge/get-active-trust-badges.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Active Trust Badges Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving active Trust Badge definitions.
//
// Responsibility:
// - Accept the GetActiveTrustBadgesQuery application request.
// - Delegate retrieval to the TrustBadgeRepository abstraction.
// - Return active TrustBadgeEntity definitions.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - resolve Asset delivery URLs;
// - access physical Asset storage;
// - retrieve TrustProfile badge assignments;
// - decide whether a badge should be awarded to a traveller;
// - perform HTTP concerns.
//
// TrustBadge owns reusable badge definitions.
//
// TrustProfile owns profile-badge assignments.
//
// These are separate aggregate boundaries.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary
// -----------------------------------------------------------------------------
//
// TrustBadgeAggregate
// └── TrustBadgeEntity
//
// The query retrieves Trust Badge definitions only.
//
// It does not retrieve:
//
//     TrustProfile
//     TrustProfileBadgeEntity
//     TrustRatingEntity
//     TrustReviewEntity
//
// Profile-badge assignment remains a TrustProfile concern.
//
// -----------------------------------------------------------------------------
//
// Active badge catalogue
// -----------------------------------------------------------------------------
//
// `findActive()` represents the application-level catalogue query for badge
// definitions that are currently active.
//
// The repository is responsible for translating that requirement into the
// persistence query.
//
// The handler does not know how "active" is represented in persistence.
//
// -----------------------------------------------------------------------------
//
// Dependency injection
// -----------------------------------------------------------------------------
//
// TrustBadgeRepository is a TypeScript interface and therefore does not exist
// at runtime.
//
// NestJS cannot resolve:
//
//     constructor(private readonly repository: TrustBadgeRepository) {}
//
// as a runtime dependency.
//
// The repository must therefore be injected through the application-layer DI
// token:
//
//     TRUST_BADGE_TOKENS.REPOSITORY
//
// The composition layer binds that token to the concrete infrastructure
// implementation.
//
// Dependency direction:
//
//     Query Handler
//          │
//          │ @Inject(TRUST_BADGE_TOKENS.REPOSITORY)
//          ▼
//     TrustBadgeRepository abstraction
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

import type { GetActiveTrustBadgesQuery } from '../../queries/trust-badge/get-active-trust-badges.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustBadgeEntity } from '../../../domain/entities/trust-badge.entity';
import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_BADGE_TOKENS } from '../../trust-badge.tokens';

// =============================================================================
// Query Handler
// =============================================================================

export class GetActiveTrustBadgesQueryHandler implements QueryHandler<
  GetActiveTrustBadgesQuery,
  TrustBadgeEntity[]
> {
  constructor(
    @Inject(TRUST_BADGE_TOKENS.REPOSITORY)
    private readonly repository: TrustBadgeRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------
  //
  // This query currently carries no filtering criteria because the use case
  // asks specifically for the active Trust Badge catalogue.
  //
  // The query parameter is intentionally consumed to satisfy the common
  // QueryHandler contract while keeping the handler free of artificial
  // query-to-repository parameters.
  //
  // ---------------------------------------------------------------------------

  async execute(query: GetActiveTrustBadgesQuery): Promise<TrustBadgeEntity[]> {
    void query;

    return this.repository.findActive();
  }
}
