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
//                    ├── Role public IDs
//                    ├── Role codes
//                    │
//                    └── RolePermission assignments
//                              │
//                              └── Permission public IDs
//                                        │
//                                        ▼
//                              Permission aggregates
//                                        │
//                                        └── active Permission codes
//
// Notes:
// - `roles` retains role public IDs for existing JWT compatibility.
// - `roleCodes` exposes stable role codes such as ADMIN and SUPER_ADMIN.
// - `permissions` retains active permission codes.
// - Backend guards remain responsible for authorization.
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

import type { RoleRepository } from '../../domain/repositories/role.repository';

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
  /**
   * Role public IDs.
   *
   * Preserved for compatibility with existing JWT role claims.
   */
  readonly roles: readonly string[];

  /**
   * Stable role codes used by application workflows, including post-login
   * navigation.
   *
   * Examples: MEMBER, DRIVER, ADMIN, SUPER_ADMIN.
   */
  readonly roleCodes: readonly string[];

  /**
   * Active permission codes.
   */
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

    @Inject(IDENTITY_TOKENS.REPOSITORIES.ROLE)
    private readonly roleRepository: RoleRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Resolve
  // ---------------------------------------------------------------------------

  public async resolve(
    identityPublicId: IdentityPublicId,
  ): Promise<AuthorizationSnapshot> {
    const identity =
      await this.identityRepository.findByPublicId(identityPublicId);

    if (identity === null) {
      return AuthorizationSnapshotServiceImpl.emptySnapshot();
    }

    const referenceDate = new Date();

    // -------------------------------------------------------------------------
    // Active Identity Role Assignments
    // -------------------------------------------------------------------------

    const activeIdentityRoles = identity.identityRoles.filter((identityRole) =>
      identityRole.isActive(referenceDate),
    );

    if (activeIdentityRoles.length === 0) {
      return AuthorizationSnapshotServiceImpl.emptySnapshot();
    }

    // -------------------------------------------------------------------------
    // Role Public IDs and Role Codes
    // -------------------------------------------------------------------------

    const rolePublicIds = new Set<string>();
    const roleCodes = new Set<string>();

    // -------------------------------------------------------------------------
    // Permission References
    // -------------------------------------------------------------------------

    const permissionPublicIdValues = new Set<string>();

    for (const identityRole of activeIdentityRoles) {
      const rolePublicId = identityRole.rolePublicId;

      rolePublicIds.add(rolePublicId.value);

      const role = await this.roleRepository.findByPublicId(rolePublicId);

      if (role !== null && role.isActive) {
        roleCodes.add(role.code.value);
      }

      const assignments =
        await this.rolePermissionRepository.findAssignmentsByRolePublicId(
          rolePublicId,
        );

      for (const assignment of assignments) {
        permissionPublicIdValues.add(assignment.permissionPublicId.value);
      }
    }

    // -------------------------------------------------------------------------
    // No Permission Assignments
    // -------------------------------------------------------------------------

    if (permissionPublicIdValues.size === 0) {
      return {
        roles: Object.freeze([...rolePublicIds]),
        roleCodes: Object.freeze([...roleCodes]),
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

      if (permission === null || !permission.isActive) {
        continue;
      }

      permissionCodes.add(permission.code.value);
    }

    // -------------------------------------------------------------------------
    // Immutable Snapshot
    // -------------------------------------------------------------------------

    return {
      roles: Object.freeze([...rolePublicIds]),
      roleCodes: Object.freeze([...roleCodes]),
      permissions: Object.freeze([...permissionCodes]),
    };
  }

  // ---------------------------------------------------------------------------
  // Empty Snapshot
  // ---------------------------------------------------------------------------

  private static emptySnapshot(): AuthorizationSnapshot {
    return {
      roles: Object.freeze([]),
      roleCodes: Object.freeze([]),
      permissions: Object.freeze([]),
    };
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default AuthorizationSnapshotServiceImpl;
