// -----------------------------------------------------------------------------
// Identity — Role Permission Entity
// -----------------------------------------------------------------------------
//
// Represents the assignment of a Permission to a Role within the Identity
// domain authorization model.
//
// Aggregate:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// RolePermission is an independent aggregate boundary representing one logical
// Role-to-Permission authorization relationship.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Maintain assignment identity.
// - Maintain Role public identity reference.
// - Maintain Permission public identity reference.
// - Maintain assignment creation timestamp.
// - Maintain assignment update timestamp.
// - Enforce assignment-level invariants.
// - Provide relationship comparison operations.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - Create or modify Roles.
// - Create or modify Permissions.
// - Decide whether a Role may receive a Permission.
// - Decide whether a Permission may be assigned.
// - Evaluate authorization.
// - Persist itself.
// - Communicate with repositories.
// - Emit domain events.
// - Maintain an active/revoked lifecycle state.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT
//
// RolePermission is a relationship aggregate.
//
//     Role
//       │
//       ▼
// RolePermission
//       ▲
//       │
//   Permission
//
// The RolePermission public ID identifies the assignment itself.
//
// The Role and Permission are referenced through opaque public identifiers:
//
// - RolePermissionRolePublicId
// - RolePermissionPermissionPublicId
//
// Internal database foreign keys remain infrastructure concerns.
//
// -----------------------------------------------------------------------------
//
// Persistence:
//
// Prisma:
//
//   RolePermission
//   ├── id
//   ├── publicId
//   ├── roleId
//   ├── permissionId
//   ├── createdAt
//   └── updatedAt
//
// Domain:
//
//   UniqueEntityId
//   RolePermissionPublicId
//   RolePermissionRolePublicId
//   RolePermissionPermissionPublicId
//   createdAt
//   updatedAt
//
// The mapper/repository resolves:
//
//   rolePublicId       -> roleId
//   permissionPublicId -> permissionId
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// The persistence model enforces:
//
//     UNIQUE(roleId, permissionId)
//
// The entity represents one logical assignment. Duplicate prevention across
// aggregates/persistence belongs to the repository/application coordination
// boundary.
//
// -----------------------------------------------------------------------------
//
// Revocation:
//
// RolePermissionEntity intentionally does not contain:
//
// - isActive;
// - revokedAt;
// - revokedBy;
// - status.
//
// Revocation is represented by:
//
//     RolePermissionAggregate.revoke()
//
// and the resulting:
//
//     RolePermissionRevokedEvent
//
// Persistence policy determines whether the relationship is physically
// deleted or represented through another persistence mechanism.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { RolePermissionException } from '../exceptions/role-permission.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { RolePermissionPublicId } from '../value-objects/role-permission-public-id.vo';

import type { RolePermissionRolePublicId } from '../value-objects/role-permission-role-public-id.vo';

import type { RolePermissionPermissionPublicId } from '../value-objects/role-permission-permission-public-id.vo';

// =============================================================================
// Props
// =============================================================================

export interface RolePermissionProps {
  /**
   * Public identity reference of the Role receiving the Permission.
   *
   * This is an opaque cross-aggregate reference and does not expose the
   * internal Role persistence identifier.
   */
  rolePublicId: RolePermissionRolePublicId;

  /**
   * Public identity reference of the Permission assigned to the Role.
   *
   * This is an opaque cross-aggregate reference and does not expose the
   * internal Permission persistence identifier.
   */
  permissionPublicId: RolePermissionPermissionPublicId;

  /**
   * Timestamp at which the RolePermission assignment was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the RolePermission assignment was last updated.
   *
   * RolePermission currently has no mutable business lifecycle after
   * creation, but this remains part of the persistence/audit contract.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

/**
 * RolePermission aggregate-root entity.
 *
 * Represents exactly one logical authorization relationship between one Role
 * and one Permission.
 */
export class RolePermissionEntity extends Entity<
  RolePermissionProps,
  RolePermissionPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(
    props: RolePermissionProps,
    id: UniqueEntityId,
    publicId: RolePermissionPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new RolePermission assignment.
   *
   * The entity creates:
   *
   * - internal UniqueEntityId;
   * - RolePermissionPublicId;
   * - creation timestamp;
   * - update timestamp.
   *
   * Role and Permission aggregates are not loaded here.
   */
  public static create(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
    createdAt: Date = new Date(),
  ): RolePermissionEntity {
    RolePermissionEntity.ensureReference(rolePublicId, 'Role public identity');

    RolePermissionEntity.ensureReference(
      permissionPublicId,
      'Permission public identity',
    );

    RolePermissionEntity.ensureValidDate(createdAt, 'creation timestamp');

    const timestamp = RolePermissionEntity.cloneDate(createdAt);

    return new RolePermissionEntity(
      {
        rolePublicId,

        permissionPublicId,

        createdAt: timestamp,

        updatedAt: RolePermissionEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new RolePermissionPublicId(),
    );
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates a persisted RolePermission entity.
   *
   * Persistence identities are authoritative:
   *
   * - id       -> UniqueEntityId
   * - publicId -> RolePermissionPublicId
   *
   * Rehydration performs entity-level validation only.
   */
  public static rehydrate(
    props: RolePermissionProps,
    id: UniqueEntityId,
    publicId: RolePermissionPublicId,
  ): RolePermissionEntity {
    if (props === undefined) {
      throw new RolePermissionException(
        'Role Permission rehydration properties are required.',
      );
    }

    if (id === undefined) {
      throw new RolePermissionException(
        'Role Permission internal identity is required for rehydration.',
      );
    }

    if (publicId === undefined) {
      throw new RolePermissionException(
        'Role Permission public identity is required for rehydration.',
      );
    }

    RolePermissionEntity.ensureReference(
      props.rolePublicId,
      'Role public identity',
    );

    RolePermissionEntity.ensureReference(
      props.permissionPublicId,
      'Permission public identity',
    );

    RolePermissionEntity.ensureValidDate(props.createdAt, 'creation timestamp');

    RolePermissionEntity.ensureValidDate(props.updatedAt, 'update timestamp');

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new RolePermissionException(
        'Role Permission updated timestamp cannot be before its creation timestamp.',
      );
    }

    return new RolePermissionEntity(
      {
        rolePublicId: props.rolePublicId,

        permissionPublicId: props.permissionPublicId,

        createdAt: RolePermissionEntity.cloneDate(props.createdAt),

        updatedAt: RolePermissionEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the RolePermission assignment.
   *
   * This identifies the relationship itself, not the Role or Permission.
   */
  public override get publicId(): RolePermissionPublicId {
    return super.publicId;
  }

  // ===========================================================================
  // Role
  // ===========================================================================

  /**
   * Public identity reference of the Role associated with this assignment.
   */
  public get rolePublicId(): RolePermissionRolePublicId {
    return this.props.rolePublicId;
  }

  /**
   * Determines whether this assignment belongs to the supplied Role.
   */
  public belongsToRole(rolePublicId: RolePermissionRolePublicId): boolean {
    RolePermissionEntity.ensureReference(rolePublicId, 'Role public identity');

    return this.props.rolePublicId.equals(rolePublicId);
  }

  /**
   * Determines whether this assignment references the supplied Role.
   */
  public referencesRole(rolePublicId: RolePermissionRolePublicId): boolean {
    return this.belongsToRole(rolePublicId);
  }

  // ===========================================================================
  // Permission
  // ===========================================================================

  /**
   * Public identity reference of the Permission associated with this
   * assignment.
   */
  public get permissionPublicId(): RolePermissionPermissionPublicId {
    return this.props.permissionPublicId;
  }

  /**
   * Determines whether this assignment references the supplied Permission.
   */
  public referencesPermission(
    permissionPublicId: RolePermissionPermissionPublicId,
  ): boolean {
    RolePermissionEntity.ensureReference(
      permissionPublicId,
      'Permission public identity',
    );

    return this.props.permissionPublicId.equals(permissionPublicId);
  }

  // ===========================================================================
  // Relationship
  // ===========================================================================

  /**
   * Determines whether this entity represents the supplied Role and
   * Permission combination.
   *
   * This performs entity-level comparison only.
   *
   * It does not determine whether another assignment already exists.
   */
  public represents(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
  ): boolean {
    RolePermissionEntity.ensureReference(rolePublicId, 'Role public identity');

    RolePermissionEntity.ensureReference(
      permissionPublicId,
      'Permission public identity',
    );

    return (
      this.props.rolePublicId.equals(rolePublicId) &&
      this.props.permissionPublicId.equals(permissionPublicId)
    );
  }

  /**
   * Determines whether this entity represents an assignment between the
   * supplied Role and Permission.
   */
  public isAssignmentBetween(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
  ): boolean {
    return this.represents(rolePublicId, permissionPublicId);
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Assignment creation timestamp.
   *
   * A defensive copy prevents mutation outside the entity.
   */
  public get createdAt(): Date {
    return RolePermissionEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Assignment last-update timestamp.
   *
   * A defensive copy prevents mutation outside the entity.
   */
  public get updatedAt(): Date {
    return RolePermissionEntity.cloneDate(this.props.updatedAt);
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence audit timestamp.
   *
   * This does not represent a business lifecycle transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    RolePermissionEntity.ensureValidDate(updatedAt, 'update timestamp');

    const timestamp = RolePermissionEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new RolePermissionException(
        'Role Permission updated timestamp cannot be before its creation timestamp.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Equality
  // ===========================================================================

  /**
   * Determines whether another RolePermissionEntity represents the same
   * persisted entity.
   */
  public override equals(other?: RolePermissionEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Ensures a required cross-aggregate reference is present.
   */
  private static ensureReference(
    value:
      RolePermissionRolePublicId | RolePermissionPermissionPublicId | undefined,
    fieldName: string,
  ): void {
    if (value === undefined) {
      throw new RolePermissionException(`${fieldName} is required.`);
    }
  }

  /**
   * Validates a Date value.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new RolePermissionException(
        `Role Permission ${fieldName} must be a valid date.`,
      );
    }
  }

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    RolePermissionEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
