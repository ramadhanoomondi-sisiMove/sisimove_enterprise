// src/domains/trust/application/query-handlers/trust-badge/get-trust-badge-by-name.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Badge By Name Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a Trust Badge aggregate by its
// business name.
//
// Responsibility:
// - Translate the primitive badge name into the Trust domain value object.
// - Delegate persistence to the TrustBadgeRepository abstraction.
// - Return the TrustBadge aggregate or null.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - resolve Asset delivery URLs;
// - access physical Asset storage;
// - retrieve TrustProfile badge assignments;
// - perform HTTP concerns.
//
// TrustBadgeAggregate owns the reusable Trust Badge definition.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary
// -----------------------------------------------------------------------------
//
// TrustBadgeAggregate
// └── TrustBadgeEntity
//
// The badge name belongs to the Trust Badge aggregate and is therefore
// represented by the TrustBadgeName value object before crossing into the
// repository boundary.
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

import type { GetTrustBadgeByNameQuery } from '../../queries/trust-badge/get-trust-badge-by-name.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustBadgeAggregate } from '../../../domain/aggregates/trust-badge.aggregate';
import type { TrustBadgeRepository } from '../../../domain/repositories/trust-badge.repository';

import { TrustBadgeName } from '../../../domain/value-objects/trust-badge-name.vo';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_BADGE_TOKENS } from '../../trust-badge.tokens';

// =============================================================================
// Query Handler
// =============================================================================

export class GetTrustBadgeByNameQueryHandler implements QueryHandler<
  GetTrustBadgeByNameQuery,
  TrustBadgeAggregate | null
> {
  constructor(
    @Inject(TRUST_BADGE_TOKENS.REPOSITORY)
    private readonly repository: TrustBadgeRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------
  //
  // The query boundary supplies the badge name as a primitive string.
  //
  // Convert it into the Trust domain value object before crossing into the
  // repository abstraction.
  //
  // The repository remains responsible for locating the Trust Badge aggregate
  // by its business name.
  //
  // ---------------------------------------------------------------------------

  async execute(
    query: GetTrustBadgeByNameQuery,
  ): Promise<TrustBadgeAggregate | null> {
    const name = new TrustBadgeName(query.name);

    return this.repository.findByName(name);
  }
}
