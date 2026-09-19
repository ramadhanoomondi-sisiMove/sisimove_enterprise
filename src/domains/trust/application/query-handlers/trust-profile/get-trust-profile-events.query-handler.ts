// src/domains/trust/application/query-handlers/trust-profile/get-trust-profile-events.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Profile Events Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving Trust events belonging to a
// Trust Profile.
//
// Responsibility:
// - Translate the primitive Trust Profile identifier into a domain value
//   object.
// - Delegate the event lookup to the TrustProfileRepository abstraction.
// - Return the TrustEventEntity collection.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - perform HTTP concerns;
// - construct public Trust projections;
// - resolve Traveller Profile data;
// - resolve Asset data.
//
// Trust events are an operational Trust Profile read concern. They are not
// part of the public marketplace Trust projection.
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
// TrustEventEntity belongs to the TrustProfile aggregate boundary.
//
// The query therefore identifies the owning Trust Profile using:
//
//     TrustProfileId
//
// before delegating to:
//
//     TrustProfileRepository.findEvents(...)
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
// The repository must be resolved through the application-layer DI token:
//
//     TRUST_PROFILE_TOKENS.REPOSITORY
//
// The composition layer binds this token to the concrete infrastructure
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
// This preserves the application's dependency inversion boundary and prevents
// the query handler from depending directly on Prisma or infrastructure.
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

import type { GetTrustProfileEventsQuery } from '../../queries/trust-profile/get-trust-profile-events.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustEventEntity } from '../../../domain/entities/trust-event.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

import { TrustProfileId } from '../../../domain/value-objects/trust-profile-id.vo';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_PROFILE_TOKENS } from '../../trust-profile.tokens';

// =============================================================================
// Query Handler
// =============================================================================

export class GetTrustProfileEventsQueryHandler implements QueryHandler<
  GetTrustProfileEventsQuery,
  TrustEventEntity[]
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
  // Convert that primitive into the Trust domain value object before crossing
  // into the repository abstraction.
  //
  // The repository remains responsible for retrieving the events belonging to
  // the specified Trust Profile.
  //
  // ---------------------------------------------------------------------------

  async execute(
    query: GetTrustProfileEventsQuery,
  ): Promise<TrustEventEntity[]> {
    const trustProfileId = new TrustProfileId(query.trustProfileId);

    return this.repository.findEvents(trustProfileId);
  }
}
