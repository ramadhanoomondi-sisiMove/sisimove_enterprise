// -----------------------------------------------------------------------------
// Session — Get Sessions Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving all Session aggregates belonging
// to an Identity.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// Query:
//
// GetSessionsQuery
//        │
//        │ Identity public ID
//        ▼
// SessionRepository.findByIdentityPublicId()
//        │
//        ▼
// SessionAggregate[]
//
// Responsibilities:
//
// - resolve Session aggregates through SessionRepository;
// - retrieve Sessions belonging to the supplied Identity;
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
// - resolve persistence models;
// - generate or hash refresh tokens;
// - compare refresh tokens;
// - sign or verify JWTs;
// - validate Identity domain state;
// - validate Device domain state;
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
//     GetSessionsQuery
//            │
//            ▼
// sessionRepository.findByIdentityPublicId()
//            │
//            ▼
//     SessionAggregate[]
//            │
//            ▼
//          return
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// SessionRepository.findByIdentityPublicId() is responsible for retrieving
// and rehydrating the complete Session aggregates.
//
// The handler intentionally does not reconstruct individual aggregates.
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

import type { GetSessionsQuery } from '../queries/get-sessions.query';

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
 * Handles retrieval of all Sessions belonging to an Identity.
 *
 * The repository is responsible for retrieving and rehydrating the complete
 * Session aggregates:
 *
 * SessionAggregate[]
 * └── SessionEntity
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetSessionsHandler implements QueryHandler<
  GetSessionsQuery,
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
   * Executes the GetSessionsQuery.
   *
   * Returns all Session aggregates belonging to the supplied Identity.
   */
  public async execute(query: GetSessionsQuery): Promise<SessionAggregate[]> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new SessionException('Session query is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Identity public ID guard
    // -------------------------------------------------------------------------

    if (query.identityPublicId === undefined) {
      throw new SessionException(
        'Identity public ID is required to retrieve Sessions.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load Session aggregates
    // -------------------------------------------------------------------------
    //
    // SessionRepository.findByIdentityPublicId() is responsible for:
    //
    // - querying persistence;
    // - rehydrating each SessionEntity;
    // - constructing each SessionAggregate.
    //
    // The handler does not reconstruct aggregates itself.
    // -------------------------------------------------------------------------

    const aggregates = await this.sessionRepository.findByIdentityPublicId(
      query.identityPublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Return aggregates
    // -------------------------------------------------------------------------
    //
    // An Identity with no Sessions is a valid result.
    //
    // Therefore, an empty array is returned rather than throwing a
    // SessionNotFoundException.
    // -------------------------------------------------------------------------

    return aggregates;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetSessionsHandler;
