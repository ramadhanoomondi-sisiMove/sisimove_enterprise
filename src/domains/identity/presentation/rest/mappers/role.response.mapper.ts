// -----------------------------------------------------------------------------
// Identity — Role Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the RoleAggregate / RoleEntity domain model into an application-facing
// response DTO.
//
// Aggregate:
//
// RoleAggregate
// └── RoleEntity
//
// Mapping principles:
//
// - Expose authorization-safe Role state.
// - Serialize value objects into primitives.
// - Preserve optional description semantics.
// - Expose lifecycle and audit state.
// - Do not expose domain entities or value objects directly.
// - Do not access Prisma or persistence models.
// - Do not map IdentityRole relationships.
// - Do not map RolePermission relationships.
//
// RolePermission and IdentityRole are separate relationship boundaries and
// must be mapped by their respective application/read-model boundaries.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map RoleAggregate -> RoleResponse.
// - Map RoleEntity -> RoleResponse.
// - Provide one canonical Role mapping implementation.
// - Convert Role value objects into primitive response values.
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
// - Resolve permissions.
// - Resolve identity assignments.
// - Emit domain events.
// - Perform business validation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { RoleAggregate } from '../../../domain/aggregates/role.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { RoleEntity } from '../../../domain/entities/role.entity';

// =============================================================================
// Response
// =============================================================================

export interface RoleResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: string;

  // ---------------------------------------------------------------------------
  // Role Definition
  // ---------------------------------------------------------------------------

  code: string;

  name: string;

  description?: string;

  displayOrder: number;

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

export class RoleResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps a RoleAggregate into a RoleResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(aggregate: RoleAggregate): RoleResponse {
    if (aggregate === undefined) {
      throw new Error('Role aggregate is required.');
    }

    return this.mapRole(aggregate.role);
  }

  // ===========================================================================
  // Entity -> Response
  // ===========================================================================

  /**
   * Maps a RoleEntity directly into a RoleResponse.
   *
   * Useful for application/read workflows where the aggregate wrapper is not
   * required by the caller.
   */
  public static fromEntity(role: RoleEntity): RoleResponse {
    if (role === undefined) {
      throw new Error('Role entity is required.');
    }

    return this.mapRole(role);
  }

  // ===========================================================================
  // Internal Role Mapping
  // ===========================================================================

  /**
   * Maps the RoleEntity portion of the Role aggregate.
   *
   * This is the single canonical implementation used by both:
   *
   * - toResponse();
   * - fromEntity();
   *
   * Keeping the mapping centralized prevents aggregate and entity response
   * paths from drifting apart.
   */
  private static mapRole(role: RoleEntity): RoleResponse {
    const description = role.description;

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: role.publicId.value,

      // -----------------------------------------------------------------------
      // Role Definition
      // -----------------------------------------------------------------------

      code: role.code.value,

      name: role.name.value,

      ...(description !== undefined ? { description } : {}),

      displayOrder: role.displayOrder,

      // -----------------------------------------------------------------------
      // Classification
      // -----------------------------------------------------------------------

      isSystem: role.isSystem,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      isActive: role.isActive,

      // -----------------------------------------------------------------------
      // Assignment Eligibility
      // -----------------------------------------------------------------------

      canBeAssigned: role.canBeAssigned(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(role.createdAt.getTime()),

      updatedAt: new Date(role.updatedAt.getTime()),
    };
  }
}
