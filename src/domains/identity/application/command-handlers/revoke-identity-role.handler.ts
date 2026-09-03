// -----------------------------------------------------------------------------
// Identity — Revoke Role Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for revoking a Role assignment from
// an Identity aggregate.
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
// - Invoke the aggregate's role-revocation behavior.
// - Persist the resulting aggregate state.
//
// The IdentityAggregate is responsible for:
//
// - locating the currently active Role assignment;
// - validating the Identity aggregate boundary;
// - determining the revocation timestamp;
// - revoking the IdentityRoleEntity;
// - recording IdentityRoleRevokedEvent.
//
// This handler does NOT:
//
// - construct IdentityEntity;
// - construct IdentityRoleEntity;
// - mutate IdentityEntity directly;
// - determine revokedAt;
// - delete the Identity;
// - delete or modify the Role aggregate;
// - modify Role permissions;
// - authenticate or de-authenticate the Identity;
// - create or revoke authentication credentials;
// - create or revoke sessions;
// - emit domain events directly;
// - perform external side effects.
//
// A later assignment of the same Role creates a new IdentityRoleEntity.
// Revocation is terminal for the existing assignment.
//
// -----------------------------------------------------------------------------
//
// Flow:
//
//     RevokeIdentityRoleCommand
//             │
//             ▼
//     IdentityRepository.findByPublicId()
//             │
//             ▼
//     IdentityAggregate.revokeRole()
//             │
//             ├── locate active assignment
//             ├── validate aggregate boundary
//             ├── determine revokedAt
//             ├── revoke IdentityRoleEntity
//             └── record IdentityRoleRevokedEvent
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

import type { RevokeIdentityRoleCommand } from '../commands/revoke-identity-role.command';

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
 * Revokes a Role assignment from an Identity aggregate.
 *
 * The handler intentionally performs only application orchestration.
 *
 * Role-revocation behavior remains inside IdentityAggregate.
 *
 * The revocation timestamp is intentionally not created by the handler.
 * IdentityAggregate determines revokedAt at the point of mutation.
 *
 * Flow:
 *
 *     Command
 *       │
 *       ▼
 *     Load IdentityAggregate
 *       │
 *       ▼
 *     aggregate.revokeRole()
 *       │
 *       ▼
 *     repository.save()
 *       │
 *       ▼
 *     Return aggregate
 */
@Injectable()
export class RevokeIdentityRoleHandler implements CommandHandler<
  RevokeIdentityRoleCommand,
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
    command: RevokeIdentityRoleCommand,
  ): Promise<IdentityAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load Identity aggregate
    // -------------------------------------------------------------------------
    //
    // The command already contains the domain IdentityPublicId and
    // IdentityRoleRolePublicId value objects.
    //
    // The Role aggregate is not loaded or modified. The Role public identity
    // is treated as an opaque cross-aggregate reference.
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
    // 3. Revoke Role through aggregate behavior
    // -------------------------------------------------------------------------
    //
    // IdentityAggregate.revokeRole() is the authoritative domain operation.
    //
    // The aggregate:
    //
    // - locates the currently active assignment;
    // - validates the assignment;
    // - determines revokedAt;
    // - revokes the IdentityRoleEntity;
    // - records IdentityRoleRevokedEvent.
    //
    // The handler does not construct or mutate IdentityRoleEntity directly.
    //
    // `revokedByPublicId` identifies the actor responsible for the operation.
    // `reason` provides optional business context for the resulting event.
    // -------------------------------------------------------------------------

    identity.revokeRole(
      command.rolePublicId,
      command.correlationId,
      command.revokedByPublicId,
      command.reason,
    );

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // IdentityRoleEntity is owned by IdentityAggregate and therefore its
    // revoked state is persisted as part of the Identity aggregate.
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

export default RevokeIdentityRoleHandler;
