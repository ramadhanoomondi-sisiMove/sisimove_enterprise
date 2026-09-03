// -----------------------------------------------------------------------------
// Identity — Permission Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the PermissionAggregate / PermissionEntity domain model into an
// application-facing response DTO.
//
// Aggregate:
//
// PermissionAggregate
// └── PermissionEntity
//
// Mapping principles:
//
// - Expose authorization-safe Permission state.
// - Serialize value objects into primitives.
// - Preserve optional description semantics.
// - Expose lifecycle and audit state.
// - Expose assignment eligibility as a derived authorization-safe predicate.
// - Do not expose domain entities or value objects directly.
// - Do not access Prisma or persistence models.
// - Do not map RolePermission relationships.
// - Do not evaluate whether a Role or Identity actually possesses this
//   Permission.
//
// RolePermission is a separate authorization relationship boundary and must
// be mapped by its appropriate application/read-model boundary.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map PermissionAggregate -> PermissionResponse.
// - Map PermissionEntity -> PermissionResponse.
// - Provide one canonical Permission mapping implementation.
// - Convert Permission value objects into primitive response values.
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
// - Resolve Role assignments.
// - Resolve Identity assignments.
// - Emit domain events.
// - Perform business validation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { PermissionAggregate } from '../../../domain/aggregates/permission.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { PermissionEntity } from '../../../domain/entities/permission.entity';

// =============================================================================
// Response
// =============================================================================

export interface PermissionResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: string;

  // ---------------------------------------------------------------------------
  // Permission Definition
  // ---------------------------------------------------------------------------

  code: string;

  name: string;

  resource: string;

  action: string;

  description?: string;

  // ---------------------------------------------------------------------------
  // Classification
  // ---------------------------------------------------------------------------

  isSystem: boolean;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  isActive: boolean;

  // ---------------------------------------------------------------------------
  // Assignment Eligibility
  // ---------------------------------------------------------------------------

  canBeAssigned: boolean;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class PermissionResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps a PermissionAggregate into a PermissionResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(aggregate: PermissionAggregate): PermissionResponse {
    if (aggregate === undefined) {
      throw new Error('Permission aggregate is required.');
    }

    return this.mapPermission(aggregate.permission);
  }

  // ===========================================================================
  // Entity -> Response
  // ===========================================================================

  /**
   * Maps a PermissionEntity directly into a PermissionResponse.
   *
   * Useful for application/read workflows where the aggregate wrapper is not
   * required by the caller.
   */
  public static fromEntity(permission: PermissionEntity): PermissionResponse {
    if (permission === undefined) {
      throw new Error('Permission entity is required.');
    }

    return this.mapPermission(permission);
  }

  // ===========================================================================
  // Internal Permission Mapping
  // ===========================================================================

  /**
   * Maps the PermissionEntity portion of the Permission aggregate.
   *
   * This is the single canonical implementation used by both:
   *
   * - toResponse();
   * - fromEntity();
   *
   * Keeping this logic centralized prevents aggregate and entity response
   * paths from drifting apart.
   */
  private static mapPermission(
    permission: PermissionEntity,
  ): PermissionResponse {
    const description = permission.description;

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: permission.publicId.value,

      // -----------------------------------------------------------------------
      // Permission Definition
      // -----------------------------------------------------------------------

      code: permission.code.value,

      name: permission.name,

      resource: permission.resource.value,

      action: permission.action.value,

      ...(description !== undefined ? { description } : {}),

      // -----------------------------------------------------------------------
      // Classification
      // -----------------------------------------------------------------------

      isSystem: permission.isSystem,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      isActive: permission.isActive,

      // -----------------------------------------------------------------------
      // Assignment Eligibility
      // -----------------------------------------------------------------------

      canBeAssigned: permission.canBeAssigned(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(permission.createdAt.getTime()),

      updatedAt: new Date(permission.updatedAt.getTime()),
    };
  }
}
