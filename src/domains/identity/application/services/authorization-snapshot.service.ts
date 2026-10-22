// -----------------------------------------------------------------------------
// Path:
// src/domains/identity/application/services/authorization-snapshot.service.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Authorization Snapshot Service
//
// Resolves the current Identity lifecycle and authorization state for
// authentication and token workflows.
//
// Authorization snapshot:
//
//     Identity
//         ├── lifecycle status
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
// Lifecycle policy:
//
// - ACTIVE identities may proceed to authorization resolution.
// - PENDING identities must not authenticate.
// - SUSPENDED identities must not authenticate.
// - CLOSED identities must not authenticate.
// - A missing Identity is represented by identityStatus: null.
//
// IMPORTANT:
//
// This service reports the current Identity status. Authentication and token
// workflows must enforce that status before issuing or refreshing tokens.
// Returning an empty authorization snapshot is not sufficient to deny login.
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

import type { IdentityStatusValue } from '../../domain/value-objects/identity-status.vo';

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
   * Current lifecycle status of the Identity.
   *
   * `null` means the Identity could not be found.
   *
   * Consumers responsible for authentication must require `ACTIVE`.
   */
  readonly identityStatus: IdentityStatusValue | null;

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
  // ===========================================================================
  // Constructor
  // ===========================================================================

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

  // ===========================================================================
  // Resolve
  // ===========================================================================

  public async resolve(
    identityPublicId: IdentityPublicId,
  ): Promise<AuthorizationSnapshot> {
    // -------------------------------------------------------------------------
    // 1. Resolve Identity
    // -------------------------------------------------------------------------

    const identity =
      await this.identityRepository.findByPublicId(identityPublicId);

    // -------------------------------------------------------------------------
    // 2. Represent a missing Identity explicitly
    // -------------------------------------------------------------------------

    if (identity === null) {
      return AuthorizationSnapshotServiceImpl.emptySnapshot(null);
    }

    // -------------------------------------------------------------------------
    // 3. Capture the current lifecycle status
    // -------------------------------------------------------------------------
    //
    // The Identity aggregate is authoritative for lifecycle status.
    //
    // This service exposes the status to authentication/token workflows.
    // It does not independently change Identity lifecycle state.
    //
    // -------------------------------------------------------------------------

    const identityStatus = identity.status.value;

    // -------------------------------------------------------------------------
    // 4. Do not resolve permissions for unusable Identity states
    // -------------------------------------------------------------------------
    //
    // This is an optimization and defense-in-depth measure, not a substitute
    // for the explicit status check required by the login/refresh handlers.
    //
    // Only ACTIVE identities receive a populated authorization snapshot.
    //
    // -------------------------------------------------------------------------

    if (identityStatus !== 'ACTIVE') {
      return AuthorizationSnapshotServiceImpl.emptySnapshot(identityStatus);
    }

    const referenceDate = new Date();

    // -------------------------------------------------------------------------
    // 5. Resolve active Identity Role assignments
    // -------------------------------------------------------------------------

    const activeIdentityRoles = identity.identityRoles.filter((identityRole) =>
      identityRole.isActive(referenceDate),
    );

    if (activeIdentityRoles.length === 0) {
      return AuthorizationSnapshotServiceImpl.emptySnapshot(identityStatus);
    }

    // -------------------------------------------------------------------------
    // 6. Collect Role public IDs and Role codes
    // -------------------------------------------------------------------------

    const rolePublicIds = new Set<string>();
    const roleCodes = new Set<string>();

    // -------------------------------------------------------------------------
    // 7. Collect Permission references
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
    // 8. Return when there are no Permission assignments
    // -------------------------------------------------------------------------

    if (permissionPublicIdValues.size === 0) {
      return {
        identityStatus,
        roles: Object.freeze([...rolePublicIds]),
        roleCodes: Object.freeze([...roleCodes]),
        permissions: Object.freeze([]),
      };
    }

    // -------------------------------------------------------------------------
    // 9. Resolve active Permission codes
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
    // 10. Return immutable authorization snapshot
    // -------------------------------------------------------------------------

    return {
      identityStatus,
      roles: Object.freeze([...rolePublicIds]),
      roleCodes: Object.freeze([...roleCodes]),
      permissions: Object.freeze([...permissionCodes]),
    };
  }

  // ===========================================================================
  // Empty Snapshot
  // ===========================================================================

  private static emptySnapshot(
    identityStatus: IdentityStatusValue | null,
  ): AuthorizationSnapshot {
    return {
      identityStatus,
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
