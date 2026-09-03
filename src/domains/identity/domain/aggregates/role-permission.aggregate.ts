// -----------------------------------------------------------------------------
// Identity — Role Permission Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// RolePermissionAggregate
// └── RolePermissionEntity
//
// RolePermission is an independent relationship aggregate representing exactly
// one logical authorization relationship:
//
//     Role ───────────── Permission
//              │
//              ▼
//        RolePermission
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Own the RolePermissionEntity.
// - Expose the relationship through the aggregate boundary.
// - Record RolePermissionAssignedEvent.
// - Record RolePermissionRevokedEvent.
// - Enforce aggregate-level structural consistency.
// - Preserve correlation/causation metadata for domain events.
//
// -----------------------------------------------------------------------------
//
// This aggregate does NOT:
//
// - Create or modify Role.
// - Create or modify Permission.
// - Decide whether Role is eligible for permission assignment.
// - Decide whether Permission is eligible for assignment.
// - Evaluate authorization.
// - Manage IdentityRole.
// - Manage Role persistence.
// - Manage Permission persistence.
// - Access Prisma.
// - Communicate with external systems.
//
// Cross-aggregate eligibility and authorization rules belong to the
// application/domain coordination boundary.
//
// -----------------------------------------------------------------------------
//
// Aggregate identity:
//
// Internal identity:
// - RolePermissionEntity.id
//
// Public identity:
// - RolePermissionEntity.publicId
//
// Relationship references:
//
// - RolePermissionRolePublicId
// - RolePermissionPermissionPublicId
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
// RolePermissionEntity intentionally has no:
//
// - status;
// - isActive;
// - revokedAt;
// - revokedBy.
//
// Therefore the aggregate does not invent a persisted lifecycle state.
//
// Assignment:
//
//     recordAssigned()
//          │
//          ▼
//     RolePermissionAssignedEvent
//
// Revocation:
//
//     revoke()
//          │
//          ▼
//     RolePermissionRevokedEvent
//
// The persistence/application boundary determines whether a revoked
// relationship is physically deleted or represented through another mechanism.
//
// -----------------------------------------------------------------------------
//
// Persistence:
//
// Prisma RolePermission:
//
// - id
// - publicId
// - roleId
// - permissionId
// - createdAt
// - updatedAt
//
// Domain:
//
// - UniqueEntityId
// - RolePermissionPublicId
// - RolePermissionRolePublicId
// - RolePermissionPermissionPublicId
// - createdAt
// - updatedAt
//
// The mapper/repository resolves:
//
//     rolePublicId       -> roleId
//     permissionPublicId -> permissionId
//
// -----------------------------------------------------------------------------
//
// Domain events:
//
// - RolePermissionAssignedEvent
// - RolePermissionRevokedEvent
//
// correlationId is required.
// causationId is optional.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { RolePermissionEntity } from '../entities/role-permission.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { RolePermissionAssignedEvent } from '../events/role-permission-assigned.event';

import { RolePermissionRevokedEvent } from '../events/role-permission-revoked.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { RolePermissionException } from '../exceptions/role-permission.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { RolePermissionRolePublicId } from '../value-objects/role-permission-role-public-id.vo';

import type { RolePermissionPermissionPublicId } from '../value-objects/role-permission-permission-public-id.vo';

// =============================================================================
// Props
// =============================================================================

interface RolePermissionAggregateProps {
  /**
   * Root entity owned by the RolePermission aggregate.
   */
  rolePermission: RolePermissionEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

/**
 * RolePermission aggregate root.
 *
 * Owns exactly one RolePermissionEntity representing one logical
 * Role-to-Permission authorization relationship.
 */
export class RolePermissionAggregate extends AggregateRoot<RolePermissionAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: RolePermissionAggregateProps) {
    if (props === undefined) {
      throw new RolePermissionException(
        'Role Permission aggregate properties are required.',
      );
    }

    if (props.rolePermission === undefined) {
      throw new RolePermissionException(
        'Role Permission aggregate root is required.',
      );
    }

    super(props, props.rolePermission.id, props.rolePermission.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new RolePermission aggregate around an existing
   * RolePermissionEntity.
   *
   * Entity creation and domain-event recording remain separate operations.
   */
  public static create(
    rolePermission: RolePermissionEntity,
  ): RolePermissionAggregate {
    if (rolePermission === undefined) {
      throw new RolePermissionException('Role Permission entity is required.');
    }

    const aggregate = new RolePermissionAggregate({
      rolePermission,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates a persisted RolePermission aggregate.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    rolePermission: RolePermissionEntity,
  ): RolePermissionAggregate {
    if (rolePermission === undefined) {
      throw new RolePermissionException(
        'Role Permission aggregate root is required for rehydration.',
      );
    }

    const aggregate = new RolePermissionAggregate({
      rolePermission,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the aggregate root entity.
   */
  public get rolePermission(): RolePermissionEntity {
    return this.props.rolePermission;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal persistence identity of the aggregate.
   */
  public override get id(): typeof this.rolePermission.id {
    return this.rolePermission.id;
  }

  /**
   * Public identity of the RolePermission assignment.
   *
   * This identifies the relationship itself.
   */
  public override get publicId(): typeof this.rolePermission.publicId {
    return this.rolePermission.publicId;
  }

  // ===========================================================================
  // Role Reference
  // ===========================================================================

  /**
   * Public identity of the Role receiving the Permission.
   */
  public get rolePublicId(): RolePermissionRolePublicId {
    return this.rolePermission.rolePublicId;
  }

  /**
   * Determines whether this assignment belongs to the supplied Role.
   */
  public belongsToRole(rolePublicId: RolePermissionRolePublicId): boolean {
    return this.rolePermission.belongsToRole(rolePublicId);
  }

  /**
   * Semantic alias for belongsToRole().
   */
  public referencesRole(rolePublicId: RolePermissionRolePublicId): boolean {
    return this.rolePermission.referencesRole(rolePublicId);
  }

  // ===========================================================================
  // Permission Reference
  // ===========================================================================

  /**
   * Public identity of the Permission assigned to the Role.
   */
  public get permissionPublicId(): RolePermissionPermissionPublicId {
    return this.rolePermission.permissionPublicId;
  }

  /**
   * Determines whether this assignment references the supplied Permission.
   */
  public referencesPermission(
    permissionPublicId: RolePermissionPermissionPublicId,
  ): boolean {
    return this.rolePermission.referencesPermission(permissionPublicId);
  }

  // ===========================================================================
  // Relationship
  // ===========================================================================

  /**
   * Determines whether this aggregate represents the supplied Role/Permission
   * relationship.
   */
  public represents(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
  ): boolean {
    return this.rolePermission.represents(rolePublicId, permissionPublicId);
  }

  /**
   * Semantic alias for represents().
   */
  public isAssignmentBetween(
    rolePublicId: RolePermissionRolePublicId,
    permissionPublicId: RolePermissionPermissionPublicId,
  ): boolean {
    return this.rolePermission.isAssignmentBetween(
      rolePublicId,
      permissionPublicId,
    );
  }

  // ===========================================================================
  // Assignment
  // ===========================================================================

  /**
   * Records establishment of the Role-to-Permission relationship.
   *
   * Cross-aggregate checks are intentionally outside this aggregate.
   */
  public recordAssigned(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.addDomainEvent(
      new RolePermissionAssignedEvent(
        this.id.value,
        this.publicId,
        this.rolePublicId,
        this.permissionPublicId,
        this.createdAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Revocation
  // ===========================================================================

  /**
   * Records revocation of the RolePermission relationship.
   *
   * No revoked state is added to the entity because the current domain model
   * intentionally represents the relationship without lifecycle status.
   */
  public revoke(
    revokedAt: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    RolePermissionAggregate.ensureValidDate(
      revokedAt,
      'Role Permission revocation timestamp must be valid.',
    );

    this.addDomainEvent(
      new RolePermissionRevokedEvent(
        this.id.value,
        this.publicId,
        this.rolePublicId,
        this.permissionPublicId,
        revokedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Assignment creation timestamp.
   */
  public get createdAt(): Date {
    return this.rolePermission.createdAt;
  }

  /**
   * Assignment last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.rolePermission.updatedAt;
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the aggregate's persistence audit timestamp.
   *
   * This does not emit a domain event.
   */
  public setUpdatedAt(updatedAt: Date): void {
    RolePermissionAggregate.ensureValidDate(
      updatedAt,
      'Role Permission update timestamp must be valid.',
    );

    this.rolePermission.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Validates structural consistency of the aggregate.
   *
   * Entity-level invariants remain the responsibility of
   * RolePermissionEntity.
   *
   * Cross-aggregate validation such as Role/Permission existence or activity
   * remains outside this aggregate.
   */
  private ensureAggregateConsistency(): void {
    if (this.rolePermission === undefined) {
      throw new RolePermissionException(
        'Role Permission aggregate root is required.',
      );
    }

    if (this.rolePermission.id === undefined) {
      throw new RolePermissionException(
        'Role Permission aggregate internal identity is required.',
      );
    }

    if (this.rolePermission.publicId === undefined) {
      throw new RolePermissionException(
        'Role Permission aggregate public identity is required.',
      );
    }

    if (this.rolePublicId === undefined) {
      throw new RolePermissionException(
        'Role Permission Role public identity is required.',
      );
    }

    if (this.permissionPublicId === undefined) {
      throw new RolePermissionException(
        'Role Permission Permission public identity is required.',
      );
    }

    RolePermissionAggregate.ensureValidDate(
      this.createdAt,
      'Role Permission creation timestamp must be valid.',
    );

    RolePermissionAggregate.ensureValidDate(
      this.updatedAt,
      'Role Permission update timestamp must be valid.',
    );

    if (this.updatedAt.getTime() < this.createdAt.getTime()) {
      throw new RolePermissionException(
        'Role Permission updated timestamp cannot be before its creation timestamp.',
      );
    }

    if (
      !this.rolePermission.represents(
        this.rolePublicId,
        this.permissionPublicId,
      )
    ) {
      throw new RolePermissionException(
        'Role Permission aggregate relationship is internally inconsistent.',
      );
    }
  }

  // ===========================================================================
  // Correlation Guard
  // ===========================================================================

  /**
   * Ensures a correlation identifier exists before recording a domain event.
   */
  private ensureCorrelationId(correlationId: string): void {
    if (
      typeof correlationId !== 'string' ||
      correlationId.trim().length === 0
    ) {
      throw new RolePermissionException(
        'Role Permission operation correlation ID is required.',
      );
    }
  }

  // ===========================================================================
  // Date Guard
  // ===========================================================================

  /**
   * Validates a Date value.
   */
  private static ensureValidDate(value: Date, message: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new RolePermissionException(message);
    }
  }
}
