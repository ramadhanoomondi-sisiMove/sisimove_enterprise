// -----------------------------------------------------------------------------
// Identity — Assign Role Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for assigning a Role to an
// Identity aggregate.
//
// Aggregate boundary:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity
//
// Responsibilities:
//
// - Load the Identity aggregate.
// - Invoke the aggregate's role-assignment behavior.
// - Persist the resulting aggregate state.
//
// The IdentityAggregate is responsible for:
//
// - validating the Identity lifecycle state;
// - preventing duplicate active role assignments;
// - determining the role-assignment timestamp;
// - creating IdentityRoleEntity;
// - establishing aggregate ownership;
// - recording IdentityRoleAssignedEvent.
//
// This handler does NOT:
//
// - construct IdentityEntity;
// - construct IdentityRoleEntity;
// - mutate IdentityEntity directly;
// - create or modify the Role aggregate;
// - modify Role permissions;
// - evaluate authorization policy;
// - authenticate the Identity;
// - create authentication credentials;
// - create a Session;
// - emit domain events directly;
// - perform external side effects.
//
// Cross-aggregate Role eligibility and authorization policy remain outside
// IdentityAggregate and must be handled by the appropriate application/domain
// coordination boundary.
//
// IMPORTANT:
//
// `assignedAt` is intentionally not supplied by this handler.
//
// The timestamp represents the fact of when the Role assignment occurred and
// is therefore determined by IdentityAggregate.
//
// -----------------------------------------------------------------------------
//
// Flow:
//
//     AssignIdentityRoleCommand
//             │
//             ▼
//     IdentityRepository.findByPublicId()
//             │
//             ▼
//     IdentityAggregate.assignRole()
//             │
//             ├── validate lifecycle
//             ├── determine assignedAt
//             ├── prevent duplicate active assignment
//             ├── create IdentityRoleEntity
//             └── record IdentityRoleAssignedEvent
//             │
//             ▼
//     IdentityRepository.save()
//             │
//             ▼
//     IdentityAggregate
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

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AssignIdentityRoleCommand } from '../commands/assign-identity-role.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { IdentityAggregate } from '../../domain/aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

// -----------------------------------------------------------------------------
// Exception
// -----------------------------------------------------------------------------

import { IdentityInvariantException } from '../../domain/exceptions/identity-invariant.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Assigns a Role to an Identity aggregate.
 *
 * The handler intentionally performs only application orchestration.
 *
 * Role assignment behavior remains inside IdentityAggregate.
 *
 * Flow:
 *
 *     Command
 *       │
 *       ▼
 *     Load IdentityAggregate
 *       │
 *       ▼
 *     aggregate.assignRole()
 *       │
 *       ▼
 *     repository.save()
 *       │
 *       ▼
 *     Return aggregate
 */
@Injectable()
export class AssignIdentityRoleHandler implements CommandHandler<
  AssignIdentityRoleCommand,
  IdentityAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.IDENTITY)
    private readonly repository: IdentityRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: AssignIdentityRoleCommand,
  ): Promise<IdentityAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load Identity aggregate
    // -------------------------------------------------------------------------
    //
    // The command already contains the domain IdentityPublicId value object.
    //
    // The Role is represented only by its opaque public identity. This handler
    // does not load or mutate the Role aggregate.
    // -------------------------------------------------------------------------

    const identity = await this.repository.findByPublicId(
      command.identityPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure Identity aggregate exists
    // -------------------------------------------------------------------------

    if (identity === null) {
      throw new IdentityInvariantException(
        `Identity ${command.identityPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Assign Role through aggregate behavior
    // -------------------------------------------------------------------------
    //
    // IdentityAggregate.assignRole() is the authoritative domain operation.
    //
    // The aggregate:
    //
    // - validates that the Identity may receive a Role;
    // - determines assignedAt;
    // - checks for an existing active assignment;
    // - creates IdentityRoleEntity;
    // - establishes ownership by the Identity;
    // - records IdentityRoleAssignedEvent.
    //
    // The handler does not construct or mutate IdentityRoleEntity directly.
    //
    // `assignedByPublicId` is an audit actor reference and does not establish
    // an ownership relationship with the assigning Identity.
    //
    // `expiresAt` is a business input and therefore remains part of the
    // command.
    // -------------------------------------------------------------------------

    identity.assignRole(
      command.rolePublicId,
      command.correlationId,
      command.assignedByPublicId,
      command.expiresAt,
    );

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // IdentityRoleEntity is owned by IdentityAggregate and therefore is
    // persisted as part of the complete Identity aggregate.
    //
    // There is intentionally no independent IdentityRole repository operation.
    // -------------------------------------------------------------------------

    await this.repository.save(identity);

    // -------------------------------------------------------------------------
    // 5. Return aggregate
    // -------------------------------------------------------------------------

    return identity;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AssignIdentityRoleHandler;
