// -----------------------------------------------------------------------------
// Session — Get Session Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a complete Session aggregate.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// Responsibilities:
//
// - resolve the Session aggregate through SessionRepository;
// - ensure the aggregate exists;
// - return the complete rehydrated aggregate.
//
// The handler does NOT:
//
// - mutate SessionEntity;
// - refresh or rotate tokens;
// - revoke or expire the Session;
// - record domain events;
// - persist the aggregate;
// - access Prisma directly;
// - resolve persistence models;
// - generate or hash refresh tokens;
// - compare refresh tokens;
// - sign or verify JWTs;
// - validate Identity domain state;
// - validate Device domain state;
// - revoke other Sessions;
// - manage token-family security policy;
// - perform authorization;
// - communicate with external systems.
//
// Query behavior belongs to the application layer.
// Aggregate reconstruction belongs to the repository/infrastructure layer.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetSessionQuery
//            │
//            ▼
// sessionRepository.findByPublicId()
//            │
//            ├── not found → throw
//            │
//            ▼
//      SessionAggregate
//            │
//            ▼
//          return
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// SessionRepository.findByPublicId() is responsible for returning a complete
// aggregate containing:
//
// SessionAggregate
// └── SessionEntity
//
// The handler intentionally does not reconstruct the aggregate itself.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../auth.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetSessionQuery } from '../queries/get-session.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { SessionAggregate } from '../../domain/aggregates/session.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { SessionRepository } from '../../domain/repositories/session.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { SessionNotFoundException } from '../../domain/exceptions/session-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of a Session aggregate by its public identifier.
 *
 * The repository is responsible for rehydrating the complete aggregate:
 *
 * SessionAggregate
 * └── SessionEntity
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetSessionHandler implements QueryHandler<
  GetSessionQuery,
  SessionAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.SESSION)
    private readonly sessionRepository: SessionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the GetSessionQuery.
   *
   * Returns the complete Session aggregate when it exists.
   */
  public async execute(query: GetSessionQuery): Promise<SessionAggregate> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new SessionNotFoundException('Session query is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Session public ID guard
    // -------------------------------------------------------------------------

    if (query.sessionPublicId === undefined) {
      throw new SessionNotFoundException('Session public ID is required.');
    }

    // -------------------------------------------------------------------------
    // 3. Load complete aggregate
    // -------------------------------------------------------------------------
    //
    // SessionRepository.findByPublicId() is responsible for returning:
    //
    // SessionAggregate
    // └── SessionEntity
    //
    // Rehydration must not emit domain events.
    // -------------------------------------------------------------------------

    const aggregate = await this.sessionRepository.findByPublicId(
      query.sessionPublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new SessionNotFoundException(
        `Session ${query.sessionPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 5. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSessionHandler;
