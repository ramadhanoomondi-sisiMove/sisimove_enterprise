// src/domains/trust/application/query-handlers/trust-badge/get-trust-badge-by-type.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Badge By Type Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a Trust Badge definition by its
// stable business type.
//
// Responsibility:
// - Translate the primitive badge type into the Trust domain value object.
// - Delegate persistence to the TrustBadgeRepository abstraction.
// - Return the TrustBadgeEntity or null.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - resolve Asset delivery URLs;
// - access physical Asset storage;
// - retrieve TrustProfile badge assignments;
// - perform HTTP concerns.
//
// TrustBadge owns the reusable badge definition.
//
// TrustProfile owns profile-badge assignments.
//
// These remain separate aggregate concerns.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary
// -----------------------------------------------------------------------------
//
// TrustBadgeAggregate
// └── TrustBadgeEntity
//
// The badge type is part of the Trust Badge definition and is represented by
// TrustBadgeTypeValueObject before crossing into the repository boundary.
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

import type { GetTrustBadgeByTypeQuery } from '../../queries/trust-badge/get-trust-badge-by-type.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustBadgeEntity } from '../../../domain/entities/trust-badge.entity';
import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { TrustBadgeTypeValueObject } from '../../../domain/value-objects/trust-badge-type.vo';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_BADGE_TOKENS } from '../../trust-badge.tokens';

// =============================================================================
// Query Handler
// =============================================================================

export class GetTrustBadgeByTypeQueryHandler implements QueryHandler<
  GetTrustBadgeByTypeQuery,
  TrustBadgeEntity | null
> {
  constructor(
    @Inject(TRUST_BADGE_TOKENS.REPOSITORY)
    private readonly repository: TrustBadgeRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------
  //
  // The query boundary supplies the badge type as a primitive value.
  //
  // Convert it into the Trust domain value object before crossing into the
  // repository abstraction.
  //
  // The repository remains responsible for locating the badge definition by
  // its stable business type.
  //
  // ---------------------------------------------------------------------------

  async execute(
    query: GetTrustBadgeByTypeQuery,
  ): Promise<TrustBadgeEntity | null> {
    const type = new TrustBadgeTypeValueObject(query.type);

    return this.repository.findBadgeByType(type);
  }
}
