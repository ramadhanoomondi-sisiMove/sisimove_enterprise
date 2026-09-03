// -----------------------------------------------------------------------------
// Authentication — Get Authentication Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving an Authentication aggregate.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Responsibilities:
//
// - resolve the Authentication aggregate through AuthenticationRepository;
// - ensure the query exists;
// - ensure the Authentication public ID exists;
// - ensure the aggregate exists;
// - return the complete rehydrated aggregate.
//
// The handler does NOT:
//
// - mutate AuthenticationEntity;
// - activate, disable, lock, or unlock Authentication;
// - change passwords;
// - record authentication failures;
// - record successful authentication;
// - create domain events;
// - persist the aggregate;
// - access Prisma directly;
// - resolve persistence models;
// - validate Identity domain state;
// - load the Identity aggregate;
// - create Sessions;
// - manage Devices;
// - execute Recovery;
// - generate OTP challenges;
// - perform authorization;
// - perform external side effects.
//
// Query behavior belongs to the application layer.
// Aggregate reconstruction belongs to the repository/infrastructure layer.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetAuthenticationQuery
//            │
//            ▼
// authenticationRepository.findByPublicId()
//            │
//            ├── not found → throw
//            │
//            ▼
//     AuthenticationAggregate
//            │
//            ▼
//          return
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// AuthenticationRepository.findByPublicId() is responsible for returning
// the complete Authentication aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
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

import type { GetAuthenticationQuery } from '../queries/get-authentication.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { AuthenticationAggregate } from '../../domain/aggregates/authentication.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { AuthenticationRepository } from '../../domain/repositories/authentication.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AuthenticationNotFoundException } from '../../domain/exceptions/authentication-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of an Authentication aggregate by public identifier.
 *
 * The repository is responsible for rehydrating the complete aggregate:
 *
 * AuthenticationAggregate
 * └── AuthenticationEntity
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetAuthenticationHandler implements QueryHandler<
  GetAuthenticationQuery,
  AuthenticationAggregate
> {
  // ===========================================================================

  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.AUTHENTICATION)
    private readonly authenticationRepository: AuthenticationRepository,
  ) {}

  // ===========================================================================

  // Execute
  // ===========================================================================

  /**
   * Executes the GetAuthenticationQuery.
   *
   * Returns the complete Authentication aggregate when it exists.
   */
  public async execute(
    query: GetAuthenticationQuery,
  ): Promise<AuthenticationAggregate> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new AuthenticationNotFoundException(
        'Authentication query is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Authentication public ID guard
    // -------------------------------------------------------------------------

    if (query.authenticationPublicId === undefined) {
      throw new AuthenticationNotFoundException(
        'Authentication public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load complete aggregate
    // -------------------------------------------------------------------------
    //
    // AuthenticationRepository.findByPublicId() is responsible for returning
    // the rehydrated Authentication aggregate:
    //
    // AuthenticationAggregate
    // └── AuthenticationEntity
    //
    // Rehydration must not emit domain events.
    // -------------------------------------------------------------------------

    const aggregate = await this.authenticationRepository.findByPublicId(
      query.authenticationPublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new AuthenticationNotFoundException(
        `Authentication ${query.authenticationPublicId.value} was not found.`,
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

export default GetAuthenticationHandler;
