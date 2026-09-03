// -----------------------------------------------------------------------------
// Identity — Get Identity Roles Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving the Role assignments owned by an
// Identity.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// Responsibilities:
//
// - resolve the complete Identity aggregate;
// - ensure the Identity exists;
// - read the aggregate-owned IdentityRoleEntity collection;
// - return the role assignments without mutating the aggregate.
//
// The handler does NOT:
//
// - mutate IdentityEntity;
// - mutate IdentityRoleEntity;
// - assign Roles;
// - revoke Roles;
// - create or remove RolePermission relationships;
// - load or mutate RoleAggregate;
// - evaluate authorization;
// - create domain events;
// - persist the aggregate;
// - access Prisma directly;
// - expose persistence models;
// - perform authentication;
// - manage sessions, devices, recovery, or OTP challenges;
// - manage Verification;
// - perform external side effects.
//
// Query behavior belongs to the application layer.
// Aggregate reconstruction belongs to the repository/infrastructure layer.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetIdentityRolesQuery
//              │
//              ▼
// identityRepository.findByPublicId()
//              │
//              ├── not found → throw
//              │
//              ▼
//        IdentityAggregate
//              │
//              ▼
//     aggregate.identityRoles
//              │
//              ▼
//             return
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// IdentityRoleEntity is owned by IdentityAggregate.
//
// Therefore the handler obtains role assignments through:
//
//     aggregate.identityRoles
//
// rather than querying IdentityRoleEntity through an independent repository.
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

import type { GetIdentityRolesQuery } from '../queries/get-identity-roles.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { IdentityAggregate } from '../../domain/aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { IdentityRoleEntity } from '../../domain/entities/identity-role.entity';

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
 * Handles retrieval of Role assignments owned by an Identity.
 *
 * The repository rehydrates the complete aggregate:
 *
 * IdentityAggregate
 * └── IdentityEntity
 *     └── IdentityRoleEntity[]
 *
 * The handler then exposes the aggregate-owned role assignments as a
 * read-only collection.
 *
 * No domain mutation occurs during query execution.
 */
@Injectable()
export class GetIdentityRolesHandler implements QueryHandler<
  GetIdentityRolesQuery,
  readonly IdentityRoleEntity[]
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
   * Executes the GetIdentityRolesQuery.
   *
   * Returns all IdentityRoleEntity assignments currently owned by the
   * specified Identity aggregate.
   */
  public async execute(
    query: GetIdentityRolesQuery,
  ): Promise<readonly IdentityRoleEntity[]> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new IdentityNotFoundException(
        'Get identity roles query is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Identity public ID guard
    // -------------------------------------------------------------------------

    if (query.identityPublicId === undefined) {
      throw new IdentityNotFoundException('Identity public ID is required.');
    }

    // -------------------------------------------------------------------------
    // 3. Load complete Identity aggregate
    // -------------------------------------------------------------------------
    //
    // IdentityRepository.findByPublicId() is responsible for rehydrating:
    //
    // IdentityAggregate
    // └── IdentityEntity
    //     └── IdentityRoleEntity[]
    //
    // The repository, not the handler, owns persistence reconstruction.
    // -------------------------------------------------------------------------

    const aggregate: IdentityAggregate | null =
      await this.identityRepository.findByPublicId(query.identityPublicId);

    // -------------------------------------------------------------------------
    // 4. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new IdentityNotFoundException(
        `Identity ${query.identityPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 5. Return aggregate-owned Role assignments
    // -------------------------------------------------------------------------
    //
    // IdentityAggregate.identityRoles is already exposed as a defensive,
    // read-only collection.
    //
    // No separate IdentityRole repository is required because IdentityRole is
    // not an independent aggregate boundary.
    // -------------------------------------------------------------------------

    return aggregate.identityRoles;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetIdentityRolesHandler;
