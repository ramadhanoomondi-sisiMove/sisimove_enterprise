// -----------------------------------------------------------------------------
// Identity — Role Permission Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the RolePermissionAggregate / RolePermissionEntity domain model into an
// application-facing response DTO.
//
// Aggregate:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// Mapping principles:
//
// - Expose the authorization-safe RolePermission relationship state.
// - Serialize value objects into primitives.
// - Expose opaque public references to Role and Permission.
// - Expose assignment identity.
// - Expose audit state.
// - Do not expose domain entities or value objects directly.
// - Do not expose internal persistence identifiers.
// - Do not access Prisma or persistence models.
// - Do not resolve Role or Permission aggregates.
// - Do not map Role relationships.
// - Do not map Permission relationships.
//
// Role and Permission are separate aggregate boundaries.
//
// Their complete representations must be mapped by their respective
// application/read-model boundaries.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map RolePermissionAggregate -> RolePermissionResponse.
// - Map RolePermissionEntity -> RolePermissionResponse.
// - Provide one canonical RolePermission mapping implementation.
// - Convert RolePermission value objects into primitive response values.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the aggregate.
// - Persist the aggregate.
// - Access Prisma.
// - Evaluate authorization.
// - Resolve Role.
// - Resolve Permission.
// - Determine whether the assignment is currently valid.
// - Emit domain events.
// - Perform business validation.
// - Invent lifecycle state such as isActive or revokedAt.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
// RolePermissionEntity intentionally has no lifecycle state.
//
// Therefore this response does NOT expose:
//
// - isActive;
// - status;
// - revokedAt;
// - revokedBy.
//
// Revocation is represented by the domain/application operation and its
// resulting RolePermissionRevokedEvent, not by mutable state on the entity.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { RolePermissionAggregate } from '../../../domain/aggregates/role-permission.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { RolePermissionEntity } from '../../../domain/entities/role-permission.entity';

// =============================================================================
// Response
// =============================================================================

export interface RolePermissionResponse {
  // ---------------------------------------------------------------------------
  // Assignment Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the RolePermission relationship itself.
   */
  publicId: string;

  // ---------------------------------------------------------------------------
  // Role Reference
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Role receiving the Permission.
   *
   * This remains an opaque cross-aggregate reference.
   */
  rolePublicId: string;

  // ---------------------------------------------------------------------------
  // Permission Reference
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Permission assigned to the Role.
   *
   * This remains an opaque cross-aggregate reference.
   */
  permissionPublicId: string;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the assignment was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the assignment was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class RolePermissionResponseMapper {
  // ===========================================================================

  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps a RolePermissionAggregate into a RolePermissionResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(
    aggregate: RolePermissionAggregate,
  ): RolePermissionResponse {
    if (aggregate === undefined) {
      throw new Error('Role Permission aggregate is required.');
    }

    return this.mapRolePermission(aggregate.rolePermission);
  }

  // ===========================================================================

  // Entity -> Response
  // ===========================================================================

  /**
   * Maps a RolePermissionEntity directly into a RolePermissionResponse.
   *
   * Useful for application/read workflows where the aggregate wrapper is not
   * required by the caller.
   */
  public static fromEntity(
    rolePermission: RolePermissionEntity,
  ): RolePermissionResponse {
    if (rolePermission === undefined) {
      throw new Error('Role Permission entity is required.');
    }

    return this.mapRolePermission(rolePermission);
  }

  // ===========================================================================

  // Internal RolePermission Mapping
  // ===========================================================================

  /**
   * Maps the RolePermissionEntity portion of the aggregate.
   *
   * This is the single canonical implementation used by both:
   *
   * - toResponse();
   * - fromEntity();
   *
   * Keeping the mapping centralized prevents aggregate and entity response
   * paths from drifting apart.
   */
  private static mapRolePermission(
    rolePermission: RolePermissionEntity,
  ): RolePermissionResponse {
    return {
      // -----------------------------------------------------------------------
      // Assignment Identity
      // -----------------------------------------------------------------------

      publicId: rolePermission.publicId.value,

      // -----------------------------------------------------------------------
      // Role Reference
      // -----------------------------------------------------------------------

      rolePublicId: rolePermission.rolePublicId.value,

      // -----------------------------------------------------------------------
      // Permission Reference
      // -----------------------------------------------------------------------

      permissionPublicId: rolePermission.permissionPublicId.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(rolePermission.createdAt.getTime()),

      updatedAt: new Date(rolePermission.updatedAt.getTime()),
    };
  }
}
