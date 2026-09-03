// -----------------------------------------------------------------------------
// Identity — Get Identity By Email Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving an Identity aggregate by email.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// Responsibilities:
//
// - resolve the Identity aggregate through IdentityRepository.findByEmail();
// - ensure the aggregate exists;
// - return the complete rehydrated aggregate.
//
// The handler does NOT:
//
// - mutate IdentityEntity;
// - mutate IdentityRoleEntity;
// - activate, suspend, or close Identity;
// - assign or revoke Identity Roles;
// - create domain events;
// - persist the aggregate;
// - access Prisma directly;
// - expose persistence models;
// - execute authentication;
// - manage sessions, devices, recovery, or OTP challenges;
// - manage Verification;
// - evaluate authorization;
// - perform external side effects.
//
// Query behavior belongs to the application layer.
// Aggregate reconstruction belongs to the repository/infrastructure layer.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetIdentityByEmailQuery
//              │
//              ▼
// identityRepository.findByEmail()
//              │
//              ├── not found → throw
//              │
//              ▼
//       IdentityAggregate
//              │
//              ▼
//            return
//
// -----------------------------------------------------------------------------
//
// Domain boundary:
//
// The query accepts IdentityEmail rather than a raw string.
//
// IdentityRepository is responsible for translating the IdentityEmail value
// object into the persistence representation required by the underlying store.
//
// The handler never performs that translation itself.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetIdentityByEmailQuery } from '../queries/get-identity-by-email.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { IdentityAggregate } from '../../domain/aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { IdentityNotFoundException } from '../../domain/exceptions/identity-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of an Identity aggregate by email address.
 *
 * The repository is responsible for returning the complete aggregate:
 *
 * IdentityAggregate
 * └── IdentityEntity
 *     └── IdentityRoleEntity[]
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetIdentityByEmailHandler implements QueryHandler<
  GetIdentityByEmailQuery,
  IdentityAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.IDENTITY)
    private readonly identityRepository: IdentityRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the GetIdentityByEmailQuery.
   *
   * Returns the complete Identity aggregate when an Identity exists for the
   * supplied email address.
   */
  public async execute(
    query: GetIdentityByEmailQuery,
  ): Promise<IdentityAggregate> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new IdentityNotFoundException(
        'Get identity by email query is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Email guard
    // -------------------------------------------------------------------------

    if (query.email === undefined) {
      throw new IdentityNotFoundException('Identity email is required.');
    }

    // -------------------------------------------------------------------------
    // 3. Load complete aggregate
    // -------------------------------------------------------------------------
    //
    // The repository performs the persistence lookup and rehydrates:
    //
    // IdentityAggregate
    // └── IdentityEntity
    //     └── IdentityRoleEntity[]
    //
    // No mutation or domain event generation occurs during query execution.
    // -------------------------------------------------------------------------

    const aggregate = await this.identityRepository.findByEmail(query.email);

    // -------------------------------------------------------------------------
    // 4. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new IdentityNotFoundException(
        `Identity with email ${query.email.value} was not found.`,
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

export default GetIdentityByEmailHandler;
