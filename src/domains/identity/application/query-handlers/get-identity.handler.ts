// -----------------------------------------------------------------------------
// Identity — Get Identity Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a complete Identity aggregate.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// Responsibilities:
//
// - resolve the Identity aggregate through IdentityRepository;
// - ensure the aggregate exists;
// - return the complete rehydrated aggregate.
//
// The handler does NOT:
//
// - mutate IdentityEntity;
// - mutate IdentityRoleEntity;
// - activate, suspend, or close the Identity;
// - assign or revoke Identity Roles;
// - create domain events;
// - persist the aggregate;
// - access Prisma directly;
// - resolve persistence models;
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
//     GetIdentityQuery
//            │
//            ▼
// identityRepository.findByPublicId()
//            │
//            ├── not found → throw
//            │
//            ▼
//     IdentityAggregate
//            │
//            ▼
//          return
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// IdentityRepository.findByPublicId() is responsible for returning a complete
// aggregate containing:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
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

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetIdentityQuery } from '../queries/get-identity.query';

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
 * Handles retrieval of an Identity aggregate by public identity.
 *
 * The repository is responsible for rehydrating the complete aggregate:
 *
 * IdentityAggregate
 * └── IdentityEntity
 *     └── IdentityRoleEntity[]
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetIdentityHandler implements QueryHandler<
  GetIdentityQuery,
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
   * Executes the GetIdentityQuery.
   *
   * Returns the complete Identity aggregate when it exists.
   */
  public async execute(query: GetIdentityQuery): Promise<IdentityAggregate> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new IdentityNotFoundException('Identity query is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Identity public ID guard
    // -------------------------------------------------------------------------

    if (query.identityPublicId === undefined) {
      throw new IdentityNotFoundException('Identity public ID is required.');
    }

    // -------------------------------------------------------------------------
    // 3. Load complete aggregate
    // -------------------------------------------------------------------------
    //
    // IdentityRepository.findByPublicId() must return:
    //
    // IdentityAggregate
    // └── IdentityEntity
    //     └── IdentityRoleEntity[]
    //
    // Rehydration must not emit domain events.
    // -------------------------------------------------------------------------

    const aggregate = await this.identityRepository.findByPublicId(
      query.identityPublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new IdentityNotFoundException(
        `Identity ${query.identityPublicId.value} was not found.`,
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

export default GetIdentityHandler;
