// -----------------------------------------------------------------------------
// Session — Get Active Sessions Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving all active Session aggregates
// belonging to an Identity.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// Query:
//
// GetActiveSessionsQuery
//        │
//        │ Identity public ID
//        ▼
// SessionRepository.findActiveByIdentityPublicId()
//        │
//        ▼
//     SessionAggregate[]
//
// Responsibilities:
//
// - retrieve active Session aggregates through SessionRepository;
// - scope the retrieval to the supplied Identity;
// - return the complete rehydrated Session aggregates.
//
// The handler does NOT:
//
// - mutate SessionEntity;
// - refresh or rotate Sessions;
// - revoke Sessions;
// - expire Sessions;
// - record domain events;
// - persist aggregates;
// - access Prisma directly;
// - reconstruct aggregates;
// - generate or hash refresh tokens;
// - compare refresh tokens;
// - sign or verify JWTs;
// - validate Identity domain state;
// - validate Device domain state;
// - perform authorization;
// - communicate with external systems.
//
// Aggregate reconstruction belongs to the repository/infrastructure layer.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetActiveSessionsQuery
//              │
//              ▼
// sessionRepository.findActiveByIdentityPublicId()
//              │
//              ▼
//       SessionAggregate[]
//              │
//              ▼
//            return
//
// -----------------------------------------------------------------------------
//
// Empty result:
//
// An Identity with no active Sessions is a valid result.
//
// Therefore:
//
//     []  → valid result
//
// No not-found exception is thrown.
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

import type { GetActiveSessionsQuery } from '../queries/get-active-sessions.query';

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

import { SessionException } from '../../domain/exceptions/session.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of all active Sessions belonging to an Identity.
 *
 * The repository is responsible for querying persistence and rehydrating
 * the complete Session aggregates.
 */
@Injectable()
export class GetActiveSessionsHandler implements QueryHandler<
  GetActiveSessionsQuery,
  SessionAggregate[]
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
   * Executes the GetActiveSessionsQuery.
   *
   * Returns all active Session aggregates belonging to the supplied Identity.
   */
  public async execute(
    query: GetActiveSessionsQuery,
  ): Promise<SessionAggregate[]> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new SessionException('Active Sessions query is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Retrieve active Sessions
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for:
    //
    // - querying persistence;
    // - filtering Sessions by active lifecycle state;
    // - scoping the result to the supplied Identity;
    // - rehydrating SessionEntity instances;
    // - constructing SessionAggregate instances.
    //
    // The handler does not reconstruct or mutate aggregates.
    // -------------------------------------------------------------------------

    const sessions: SessionAggregate[] =
      await this.sessionRepository.findActiveByIdentityPublicId(
        query.identityPublicId,
      );

    // -------------------------------------------------------------------------
    // 3. Return result
    // -------------------------------------------------------------------------
    //
    // An empty collection is a valid result when the Identity has no active
    // Sessions.
    // -------------------------------------------------------------------------

    return sessions;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetActiveSessionsHandler;
