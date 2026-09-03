// -----------------------------------------------------------------------------
// Identity — REST Response Mapper
// -----------------------------------------------------------------------------
//
// Maps Identity domain objects into REST response representations.
//
// Aggregate boundary:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// IMPORTANT:
//
// IdentityRoleEntity is owned by IdentityAggregate. Therefore, a complete
// Identity response maps the role assignments through the Identity aggregate.
//
// Domain entities, aggregate roots, Entity IDs, and Value Objects are never
// exposed directly through the REST boundary.
//
// Value Objects are converted to their primitive representations here.
//
// Internal persistence identifiers are intentionally excluded.
//
// Separate aggregate concerns are intentionally NOT mapped here:
//
// - Verification;
// - Authentication;
// - Sessions;
// - Devices;
// - Recovery;
// - OTP challenges;
// - Role;
// - Permission;
// - RolePermission.
//
// Those concerns have independent aggregate and response boundaries.
//
// IMPORTANT:
//
// Identity currently has NO IdentityType.
//
// Therefore this mapper deliberately contains no:
//
// - IdentityType import;
// - type property;
// - type mapping;
// - Identity classification response field.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { IdentityAggregate } from '../../../domain/aggregates/identity.aggregate';

import type { IdentityEntity } from '../../../domain/entities/identity.entity';

import type { IdentityRoleEntity } from '../../../domain/entities/identity-role.entity';

// =============================================================================
// Response Types
// =============================================================================

/**
 * REST representation of an Identity aggregate.
 *
 * IdentityRoleEntity[] is included because Identity owns the role-assignment
 * collection as part of its aggregate boundary.
 */
export interface IdentityResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Identity aggregate.
   */
  publicId: string;

  /**
   * Identity email address.
   */
  email: string;

  /**
   * Identity phone number.
   */
  phoneNumber: string;

  /**
   * Current Identity lifecycle status.
   */
  status: string;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Time at which the Identity became ACTIVE.
   *
   * Undefined when the Identity has never been activated.
   */
  activatedAt: Date | undefined;

  /**
   * Time at which the Identity became SUSPENDED.
   *
   * Undefined when the Identity has never been suspended.
   */
  suspendedAt: Date | undefined;

  /**
   * Time at which the Identity became CLOSED.
   *
   * Undefined when the Identity has never been closed.
   */
  closedAt: Date | undefined;

  // ===========================================================================
  // Authorization
  // ===========================================================================

  /**
   * Role assignments owned by the Identity aggregate.
   *
   * These are IdentityRole assignment representations, not Role aggregate
   * representations.
   */
  roles: IdentityRoleResponse[];

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

/**
 * REST representation of an IdentityRole entity owned by IdentityAggregate.
 *
 * This represents the role assignment itself, not the Role aggregate.
 *
 * Role name, permissions, and other Role aggregate data are intentionally not
 * included because Role has an independent aggregate boundary.
 */
export interface IdentityRoleResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the role assignment.
   */
  publicId: string;

  /**
   * Public identity of the Identity owning the assignment.
   */
  identityPublicId: string;

  /**
   * Public identity of the assigned Role.
   */
  rolePublicId: string;

  // ===========================================================================
  // Assignment
  // ===========================================================================

  /**
   * Public identity of the Identity that assigned the role.
   *
   * Undefined when the assignment was created without an assigning Identity.
   */
  assignedByPublicId: string | undefined;

  /**
   * Time at which the role was assigned.
   */
  assignedAt: Date;

  /**
   * Optional expiration time.
   */
  expiresAt: Date | undefined;

  // ===========================================================================
  // Revocation
  // ===========================================================================

  /**
   * Time at which the role assignment was revoked.
   */
  revokedAt: Date | undefined;

  /**
   * Public identity of the Identity that revoked the role assignment.
   */
  revokedByPublicId: string | undefined;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

/**
 * Maps Identity domain objects into REST response objects.
 *
 * Preferred usage:
 *
 *     IdentityResponseMapper.toResponse(aggregate)
 *
 * for complete Identity aggregate responses.
 *
 * The mapper also supports mapping IdentityEntity and IdentityRoleEntity
 * independently when a query explicitly returns those domain objects.
 */
export class IdentityResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Identity aggregate.
   *
   * This is the preferred mapper for complete Identity detail responses because
   * the aggregate owns both the Identity entity and its role assignments.
   */
  public static toResponse(aggregate: IdentityAggregate): IdentityResponse {
    const identity = aggregate.identity;

    return this.mapIdentity(identity);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps an Identity root entity.
   *
   * IdentityEntity currently owns its IdentityRoleEntity collection, so role
   * assignments can be represented directly from the entity.
   */
  public static fromEntity(identity: IdentityEntity): IdentityResponse {
    return this.mapIdentity(identity);
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Identity aggregates.
   */
  public static fromAggregates(
    aggregates: readonly IdentityAggregate[],
  ): IdentityResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps a collection of Identity root entities.
   *
   * Each IdentityEntity carries its aggregate-owned IdentityRoleEntity
   * collection.
   */
  public static fromEntities(
    identities: readonly IdentityEntity[],
  ): IdentityResponse[] {
    return identities.map((identity) => this.fromEntity(identity));
  }

  // ===========================================================================
  // Identity Mapping
  // ===========================================================================

  /**
   * Maps the IdentityEntity portion of the Identity aggregate.
   *
   * This method is private because the public API should distinguish between
   * aggregate mapping and standalone role-assignment mapping.
   */
  private static mapIdentity(identity: IdentityEntity): IdentityResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: identity.publicId.value,

      email: identity.email.toString(),

      phoneNumber: identity.phoneNumber.toString(),

      status: identity.status.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      activatedAt: identity.activatedAt,

      suspendedAt: identity.suspendedAt,

      closedAt: identity.closedAt,

      // -----------------------------------------------------------------------
      // Authorization
      // -----------------------------------------------------------------------

      roles: identity.identityRoles.map((identityRole) =>
        this.mapRole(identity, identityRole),
      ),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: identity.createdAt,

      updatedAt: identity.updatedAt,
    };
  }

  // ===========================================================================
  // Role Assignment
  // ===========================================================================

  /**
   * Maps an aggregate-owned IdentityRoleEntity.
   *
   * The IdentityEntity is supplied separately so that aggregate ownership can
   * be verified before the role assignment crosses the REST boundary.
   */
  private static mapRole(
    identity: IdentityEntity,
    identityRole: IdentityRoleEntity,
  ): IdentityRoleResponse {
    // -------------------------------------------------------------------------
    // Aggregate Integrity
    // -------------------------------------------------------------------------

    if (!identityRole.identityPublicId.equals(identity.publicId)) {
      throw new Error(
        `IdentityRole "${identityRole.publicId.value}" does not belong ` +
          `to Identity "${identity.publicId.value}".`,
      );
    }

    return this.mapRoleProperties(identityRole);
  }

  /**
   * Maps an IdentityRoleEntity without requiring its owning IdentityEntity.
   *
   * This is appropriate for dedicated IdentityRole queries where the entity
   * itself already carries the owning Identity public identity.
   */
  public static roleFromEntity(
    identityRole: IdentityRoleEntity,
  ): IdentityRoleResponse {
    return this.mapRoleProperties(identityRole);
  }

  /**
   * Maps the primitive representation of an IdentityRoleEntity.
   *
   * No persistence identifiers are exposed.
   */
  private static mapRoleProperties(
    identityRole: IdentityRoleEntity,
  ): IdentityRoleResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: identityRole.publicId.value,

      identityPublicId: identityRole.identityPublicId.value,

      rolePublicId: identityRole.rolePublicId.value,

      // -----------------------------------------------------------------------
      // Assignment
      // -----------------------------------------------------------------------

      assignedByPublicId: identityRole.assignedByPublicId?.value,

      assignedAt: identityRole.assignedAt,

      expiresAt: identityRole.expiresAt,

      // -----------------------------------------------------------------------
      // Revocation
      // -----------------------------------------------------------------------

      revokedAt: identityRole.revokedAt,

      revokedByPublicId: identityRole.revokedByPublicId?.value,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: identityRole.createdAt,

      updatedAt: identityRole.updatedAt,
    };
  }

  // ===========================================================================
  // Role Assignment Collection
  // ===========================================================================

  /**
   * Maps a collection of IdentityRoleEntity instances.
   *
   * Intended for dedicated IdentityRole assignment queries.
   */
  public static rolesFromEntities(
    identityRoles: readonly IdentityRoleEntity[],
  ): IdentityRoleResponse[] {
    return identityRoles.map((identityRole) =>
      this.roleFromEntity(identityRole),
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default IdentityResponseMapper;
