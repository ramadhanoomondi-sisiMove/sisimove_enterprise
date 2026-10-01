// -----------------------------------------------------------------------------
// Path:
// src/domains/identity/application/services/authorization-snapshot.service.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Authorization Snapshot Service
//
// Resolves the current authorization state of an Identity for consumption by
// authentication/token workflows.
//
// Authorization snapshot:
//
//     Identity
//         │
//         └── active IdentityRole assignments
//                    │
//                    └── Role public IDs
//                              │
//                              ▼
//                    RolePermission assignments
//                              │
//                              └── Permission public IDs
//                                        │
//                                        ▼
//                              Permission aggregates
//                                        │
//                                        └── active Permission codes
//
// -----------------------------------------------------------------------------

// =============================================================================
// NestJS
// =============================================================================

import { Inject } from '@nestjs/common';

// =============================================================================
// Foundation / Identity
// =============================================================================

import type { IdentityPublicId } from '../../domain/value-objects/identity-public-id.vo';

// =============================================================================
// Repositories
// =============================================================================

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

import type { RolePermissionRepository } from '../../domain/repositories/role-permission.repository';

import type { PermissionRepository } from '../../domain/repositories/permission.repository';

// =============================================================================
// Identity Application Tokens
// =============================================================================

import { IDENTITY_TOKENS } from '../identity.tokens';

// =============================================================================
// Permission Value Object
// =============================================================================

import { PermissionPublicId } from '../../domain/value-objects/permission-public-id.vo';

// =============================================================================
// Authorization Snapshot
// =============================================================================

export interface AuthorizationSnapshot {
  readonly roles: readonly string[];

  readonly permissions: readonly string[];
}

// =============================================================================
// Service Contract
// =============================================================================

export interface AuthorizationSnapshotService {
  resolve(identityPublicId: IdentityPublicId): Promise<AuthorizationSnapshot>;
}

// =============================================================================
// Service Implementation
// =============================================================================

export class AuthorizationSnapshotServiceImpl implements AuthorizationSnapshotService {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.IDENTITY)
    private readonly identityRepository: IdentityRepository,

    @Inject(IDENTITY_TOKENS.REPOSITORIES.ROLE_PERMISSION)
    private readonly rolePermissionRepository: RolePermissionRepository,

    @Inject(IDENTITY_TOKENS.REPOSITORIES.PERMISSION)
    private readonly permissionRepository: PermissionRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Resolve
  // ---------------------------------------------------------------------------

  public async resolve(
    identityPublicId: IdentityPublicId,
  ): Promise<AuthorizationSnapshot> {
    const identity =
      await this.identityRepository.findByPublicId(identityPublicId);

    // -------------------------------------------------------------------------
    // Identity Not Found
    // -------------------------------------------------------------------------

    if (identity === null) {
      return AuthorizationSnapshotServiceImpl.emptySnapshot();
    }

    const referenceDate = new Date();

    // -------------------------------------------------------------------------
    // Active Roles
    // -------------------------------------------------------------------------

    const activeIdentityRoles = identity.identityRoles.filter((identityRole) =>
      identityRole.isActive(referenceDate),
    );

    if (activeIdentityRoles.length === 0) {
      return AuthorizationSnapshotServiceImpl.emptySnapshot();
    }

    // -------------------------------------------------------------------------
    // Role Claims
    // -------------------------------------------------------------------------

    const roleValues = new Set<string>();

    // -------------------------------------------------------------------------
    // Permission References
    // -------------------------------------------------------------------------

    const permissionPublicIdValues = new Set<string>();

    for (const identityRole of activeIdentityRoles) {
      roleValues.add(identityRole.rolePublicId.value);

      const assignments =
        await this.rolePermissionRepository.findAssignmentsByRolePublicId(
          identityRole.rolePublicId,
        );

      for (const assignment of assignments) {
        permissionPublicIdValues.add(assignment.permissionPublicId.value);
      }
    }

    // -------------------------------------------------------------------------
    // No Permissions
    // -------------------------------------------------------------------------

    if (permissionPublicIdValues.size === 0) {
      return {
        roles: Object.freeze([...roleValues]),
        permissions: Object.freeze([]),
      };
    }

    // -------------------------------------------------------------------------
    // Permission Resolution
    // -------------------------------------------------------------------------

    const permissionCodes = new Set<string>();

    for (const permissionPublicIdValue of permissionPublicIdValues) {
      const permissionPublicId = new PermissionPublicId(
        permissionPublicIdValue,
      );

      const permission =
        await this.permissionRepository.findByPublicId(permissionPublicId);

      // -----------------------------------------------------------------------
      // Missing Permission
      // -----------------------------------------------------------------------

      if (permission === null) {
        continue;
      }

      // -----------------------------------------------------------------------
      // Inactive Permission
      // -----------------------------------------------------------------------

      if (!permission.isActive) {
        continue;
      }

      permissionCodes.add(permission.code.value);
    }

    // -------------------------------------------------------------------------
    // Immutable Snapshot
    // -------------------------------------------------------------------------

    return {
      roles: Object.freeze([...roleValues]),
      permissions: Object.freeze([...permissionCodes]),
    };
  }

  // ---------------------------------------------------------------------------
  // Empty Snapshot
  // ---------------------------------------------------------------------------

  private static emptySnapshot(): AuthorizationSnapshot {
    return {
      roles: Object.freeze([]),
      permissions: Object.freeze([]),
    };
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default AuthorizationSnapshotServiceImpl;
