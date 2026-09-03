// -----------------------------------------------------------------------------
// Identity — Revoke Role Permission Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for revoking a RolePermission authorization relationship.
//
// Aggregate:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// The handler:
//
// - validates the command;
// - resolves the RolePermission aggregate;
// - invokes RolePermissionAggregate.revoke();
// - persists the aggregate.
//
// The handler does NOT:
//
// - construct RolePermissionEntity;
// - construct RolePermissionAggregate;
// - mutate RoleEntity;
// - mutate PermissionEntity;
// - deactivate the Role;
// - deactivate the Permission;
// - revoke IdentityRole assignments;
// - modify Identity authentication;
// - evaluate authorization;
// - emit RolePermissionRevokedEvent directly;
// - access Prisma;
// - communicate with external systems.
//
// RolePermissionAggregate is responsible for:
//
// - applying the relationship revocation operation;
// - recording RolePermissionRevokedEvent.
//
// -----------------------------------------------------------------------------
//
// Expected relationship lifecycle:
//
// ASSIGNED ───────► REVOKED
//
// REVOKED is terminal.
//
// The RolePermission aggregate intentionally does not invent an active/revoked
// state property when the underlying entity does not contain one. Revocation
// is represented by the aggregate operation and resulting domain event.
//
// The persistence policy determines whether the revoked relationship is
// physically deleted or represented as historical state.
//
// -----------------------------------------------------------------------------
//
// Aggregate identity:
//
// The command targets the existing RolePermission aggregate using:
//
//     rolePermissionPublicId
//
// The handler therefore does not need to resolve Role or Permission aggregates.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     RevokeRolePermissionCommand
//                │
//                ▼
// rolePermissionRepository.findByPublicId()
//                │
//                ├── missing → throw
//                │
//                ▼
//      RolePermissionAggregate
//                │
//                ▼
//       aggregate.revoke()
//                │
//                ▼
// rolePermissionRepository.save()
//                │
//                ▼
//      RolePermissionAggregate
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Identity Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RevokeRolePermissionCommand } from '../commands/revoke-role-permission.command';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { RolePermissionRepository } from '../../domain/repositories/role-permission.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { RolePermissionException } from '../../domain/exceptions/role-permission.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Revokes an existing RolePermission authorization relationship.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     aggregate lookup
 *       ↓
 *     aggregate.revoke()
 *       ↓
 *     aggregate persistence
 *
 * No Role or Permission aggregate is mutated by this operation.
 */
@Injectable()
export class RevokeRolePermissionHandler implements CommandHandler<RevokeRolePermissionCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.ROLE_PERMISSION)
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the RevokeRolePermissionCommand.
   *
   * A successful execution records the revocation of the existing
   * RolePermission relationship and persists the aggregate.
   */
  public async execute(command: RevokeRolePermissionCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new RolePermissionException(
        'Revoke role permission command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. RolePermission public identity guard
    // -------------------------------------------------------------------------

    if (command.rolePermissionPublicId === undefined) {
      throw new RolePermissionException(
        'RolePermission public ID is required to revoke the relationship.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Resolve RolePermission aggregate
    // -------------------------------------------------------------------------
    //
    // RolePermissionPublicId uniquely identifies the relationship being
    // revoked.
    //
    // The repository rehydrates the complete aggregate before mutation.
    // -------------------------------------------------------------------------

    const aggregate = await this.rolePermissionRepository.findByPublicId(
      command.rolePermissionPublicId,
    );

    if (aggregate === null) {
      throw new RolePermissionException(
        `RolePermission ${command.rolePermissionPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 4. Revoke through aggregate
    // -------------------------------------------------------------------------
    //
    // RolePermissionAggregate.revoke() owns:
    //
    // - the relationship revocation operation;
    // - RolePermissionRevokedEvent recording.
    //
    // The handler does not mutate the RolePermissionEntity directly.
    // -------------------------------------------------------------------------

    aggregate.revoke(
      command.revokedAt ?? new Date(),
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // RolePermissionAggregate remains the unit of persistence.
    //
    // This operation does not:
    //
    // - deactivate the Role;
    // - deactivate the Permission;
    // - alter other RolePermission relationships;
    // - modify IdentityRole assignments;
    // - change authentication state.
    //
    // Those concerns remain separate lifecycle boundaries.
    // -------------------------------------------------------------------------

    await this.rolePermissionRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RevokeRolePermissionHandler;
