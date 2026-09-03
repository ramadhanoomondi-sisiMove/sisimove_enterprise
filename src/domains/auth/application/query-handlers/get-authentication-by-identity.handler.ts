// -----------------------------------------------------------------------------
// Authentication — Get Authentication By Identity Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving an Authentication aggregate by
// its associated Identity public identifier.
//
// Aggregate:
//
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Relationship:
//
// IdentityAggregate
//        │
//        │ Identity public ID
//        ▼
// AuthenticationAggregate
// └── AuthenticationEntity
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - resolve Authentication through AuthenticationRepository;
// - use the opaque Identity public reference for lookup;
// - ensure the query exists;
// - ensure the Identity public ID exists;
// - ensure the Authentication aggregate exists;
// - return the complete rehydrated aggregate.
//
// The handler does NOT:
//
// - load the Identity aggregate;
// - validate Identity domain state;
// - mutate AuthenticationEntity;
// - activate, disable, lock, or unlock Authentication;
// - change passwords;
// - record authentication failures;
// - record successful authentication;
// - create domain events;
// - persist the aggregate;
// - access Prisma directly;
// - resolve persistence models;
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
// Identity reference:
//
// AuthenticationRepository.findByIdentityPublicId() treats
// AuthenticationIdentityPublicId as an opaque cross-aggregate reference.
//
// The repository does not:
//
// - dereference Identity;
// - load IdentityAggregate;
// - validate Identity existence;
// - inspect Identity status;
// - inspect Identity roles.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetAuthenticationByIdentityQuery
//                 │
//                 ▼
// authenticationRepository.findByIdentityPublicId()
//                 │
//                 ├── not found → throw
//                 │
//                 ▼
//       AuthenticationAggregate
//                 │
//                 ▼
//               return
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

import type { GetAuthenticationByIdentityQuery } from '../queries/get-authentication-by-identity.query';

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
 * Handles retrieval of an Authentication aggregate by its associated
 * Identity public identifier.
 *
 * The repository is responsible for locating and rehydrating the complete
 * Authentication aggregate.
 *
 * AuthenticationAggregate
 * └── AuthenticationEntity
 *
 * The handler performs no domain mutation and does not load the Identity
 * aggregate.
 */
@Injectable()
export class GetAuthenticationByIdentityHandler implements QueryHandler<
  GetAuthenticationByIdentityQuery,
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
   * Executes the GetAuthenticationByIdentityQuery.
   *
   * Returns the Authentication aggregate associated with the supplied
   * Identity public identifier.
   */
  public async execute(
    query: GetAuthenticationByIdentityQuery,
  ): Promise<AuthenticationAggregate> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new AuthenticationNotFoundException(
        'Authentication-by-Identity query is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Identity public ID guard
    // -------------------------------------------------------------------------

    if (query.identityPublicId === undefined) {
      throw new AuthenticationNotFoundException(
        'Identity public ID is required to retrieve Authentication.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load Authentication aggregate
    // -------------------------------------------------------------------------
    //
    // AuthenticationRepository treats identityPublicId as an opaque
    // cross-aggregate reference.
    //
    // It is responsible for:
    //
    // - locating Authentication;
    // - reconstructing AuthenticationEntity;
    // - rehydrating AuthenticationAggregate.
    //
    // It does NOT load or validate IdentityAggregate.
    //
    // Rehydration must not emit domain events.
    // -------------------------------------------------------------------------

    const aggregate =
      await this.authenticationRepository.findByIdentityPublicId(
        query.identityPublicId,
      );

    // -------------------------------------------------------------------------
    // 4. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new AuthenticationNotFoundException(
        `Authentication for identity ${query.identityPublicId.value} was not found.`,
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

export default GetAuthenticationByIdentityHandler;
