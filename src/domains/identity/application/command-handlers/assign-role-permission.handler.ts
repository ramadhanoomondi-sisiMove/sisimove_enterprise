// -----------------------------------------------------------------------------
// Identity — Assign Role Permission Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for assigning a Permission to a Role.
//
// Aggregate:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// Responsibilities:
//
// - validate the command;
// - resolve the referenced Role;
// - resolve the referenced Permission;
// - validate assignment eligibility;
// - prevent duplicate RolePermission assignments;
// - create the RolePermissionEntity;
// - create the RolePermissionAggregate;
// - record RolePermissionAssignedEvent;
// - persist the aggregate.
//
// The handler does NOT:
//
// - mutate RoleEntity;
// - mutate PermissionEntity;
// - activate Roles;
// - activate Permissions;
// - assign Roles to Identities;
// - grant Permissions directly to Identities;
// - evaluate complete authorization policies;
// - access Prisma;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundaries:
//
// RoleAggregate
// └── RoleEntity
//
// PermissionAggregate
// └── PermissionEntity
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// RolePermission represents the authorization relationship:
//
//     Role ───────────── Permission
//              │
//              ▼
//        RolePermission
//
// The Role and Permission aggregates remain independently owned.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     AssignRolePermissionCommand
//                │
//                ▼
//       roleRepository.findByPublicId()
//                │
//                ├── missing → throw
//                │
//                ▼
//   permissionRepository.findByPublicId()
//                │
//                ├── missing → throw
//                │
//                ▼
//        role.canBeAssigned()
//                │
//                ├── false → throw
//                │
//                ▼
//     permission.canBeAssigned()
//                │
//                ├── false → throw
//                │
//                ▼
// rolePermissionRepository.existsByRolePublicIdAndPermissionPublicId()
//                │
//                ├── exists → throw
//                │
//                ▼
//      RolePermissionEntity.create()
//                │
//                ▼
//      RolePermissionAggregate.create()
//                │
//                ▼
//      aggregate.recordAssigned()
//                │
//                ▼
//      rolePermissionRepository.save()
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

import type { AssignRolePermissionCommand } from '../commands/assign-role-permission.command';

// -----------------------------------------------------------------------------
// Aggregates
// -----------------------------------------------------------------------------

import type { RoleAggregate } from '../../domain/aggregates/role.aggregate';

import type { PermissionAggregate } from '../../domain/aggregates/permission.aggregate';

import { RolePermissionAggregate } from '../../domain/aggregates/role-permission.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { RolePermissionEntity } from '../../domain/entities/role-permission.entity';

// -----------------------------------------------------------------------------
// Repositories
// -----------------------------------------------------------------------------

import type { RoleRepository } from '../../domain/repositories/role.repository';

import type { PermissionRepository } from '../../domain/repositories/permission.repository';

import type { RolePermissionRepository } from '../../domain/repositories/role-permission.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { RoleNotFoundException } from '../../domain/exceptions/role-not-found.exception';

import { PermissionNotFoundException } from '../../domain/exceptions/permission-not-found.exception';

import { RolePermissionException } from '../../domain/exceptions/role-permission.exception';

import { RolePermissionAlreadyAssignedException } from '../../domain/exceptions/role-permission-already-assigned.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Assigns a Permission to a Role by creating a RolePermission aggregate.
 *
 * The handler performs application-level orchestration only:
 *
 *     command
 *       ↓
 *     referenced aggregate resolution
 *       ↓
 *     eligibility validation
 *       ↓
 *     relationship uniqueness validation
 *       ↓
 *     RolePermissionEntity.create()
 *       ↓
 *     RolePermissionAggregate.create()
 *       ↓
 *     aggregate.recordAssigned()
 *       ↓
 *     repository.save()
 *
 * Role, Permission, and RolePermission remain separate aggregate boundaries.
 */
@Injectable()
export class AssignRolePermissionHandler implements CommandHandler<AssignRolePermissionCommand> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.ROLE)
    private readonly roleRepository: RoleRepository,

    @Inject(IDENTITY_TOKENS.REPOSITORIES.PERMISSION)
    private readonly permissionRepository: PermissionRepository,

    @Inject(IDENTITY_TOKENS.REPOSITORIES.ROLE_PERMISSION)
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the AssignRolePermissionCommand.
   *
   * A successful execution establishes one RolePermission relationship.
   */
  public async execute(command: AssignRolePermissionCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // 1. Command guard
    // -------------------------------------------------------------------------

    if (command === undefined) {
      throw new RolePermissionException(
        'Assign role permission command is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Role public identity guard
    // -------------------------------------------------------------------------

    if (command.roleId === undefined) {
      throw new RoleNotFoundException(
        'Role public ID is required to assign a Permission.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Permission public identity guard
    // -------------------------------------------------------------------------

    if (command.permissionId === undefined) {
      throw new PermissionNotFoundException(
        'Permission public ID is required to assign a Permission to a Role.',
      );
    }

    // -------------------------------------------------------------------------
    // 4. Resolve Role aggregate
    // -------------------------------------------------------------------------

    const role: RoleAggregate | null = await this.roleRepository.findByPublicId(
      command.roleId,
    );

    if (role === null) {
      throw new RoleNotFoundException(
        `Role ${command.roleId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 5. Validate Role assignment eligibility
    // -------------------------------------------------------------------------

    if (!role.canBeAssigned()) {
      throw new RolePermissionException(
        `Role ${role.publicId.value} cannot currently receive Permission assignments.`,
      );
    }

    // -------------------------------------------------------------------------
    // 6. Resolve Permission aggregate
    // -------------------------------------------------------------------------

    const permission: PermissionAggregate | null =
      await this.permissionRepository.findByPublicId(command.permissionId);

    if (permission === null) {
      throw new PermissionNotFoundException(
        `Permission ${command.permissionId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 7. Validate Permission assignment eligibility
    // -------------------------------------------------------------------------

    if (!permission.canBeAssigned()) {
      throw new RolePermissionException(
        `Permission ${permission.publicId.value} cannot currently be assigned.`,
      );
    }

    // -------------------------------------------------------------------------
    // 8. Relationship uniqueness
    // -------------------------------------------------------------------------
    //
    // A Role may receive a given Permission only once.
    //
    // The persistence model additionally enforces:
    //
    //     UNIQUE(roleId, permissionId)
    // -------------------------------------------------------------------------

    const alreadyAssigned =
      await this.rolePermissionRepository.existsByRolePublicIdAndPermissionPublicId(
        command.roleId,
        command.permissionId,
      );

    if (alreadyAssigned) {
      throw new RolePermissionAlreadyAssignedException(
        `Permission ${command.permissionId.value} is already assigned to Role ${command.roleId.value}.`,
      );
    }

    // -------------------------------------------------------------------------
    // 9. Create RolePermissionEntity
    // -------------------------------------------------------------------------
    //
    // RolePermissionEntity.create() uses positional parameters:
    //
    //     create(
    //       rolePublicId,
    //       permissionPublicId,
    //       assignedAt?,
    //     )
    //
    // Only the public identifiers cross the aggregate boundary.
    // -------------------------------------------------------------------------

    const rolePermission = RolePermissionEntity.create(
      command.roleId,
      command.permissionId,
      command.assignedAt ?? new Date(),
    );

    // -------------------------------------------------------------------------
    // 10. Create RolePermission aggregate
    // -------------------------------------------------------------------------

    const aggregate = RolePermissionAggregate.create(rolePermission);

    // -------------------------------------------------------------------------
    // 11. Record assignment
    // -------------------------------------------------------------------------
    //
    // The aggregate records RolePermissionAssignedEvent.
    // -------------------------------------------------------------------------

    aggregate.recordAssigned(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 12. Persist aggregate
    // -------------------------------------------------------------------------

    await this.rolePermissionRepository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AssignRolePermissionHandler;
