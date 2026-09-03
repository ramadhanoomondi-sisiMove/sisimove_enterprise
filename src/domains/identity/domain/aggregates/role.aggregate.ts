// -----------------------------------------------------------------------------
// Identity — Role Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate root for a Role within the Identity / Authorization domain.
//
// Aggregate:
// RoleAggregate
// └── RoleEntity
//
// Responsibilities:
//
// - Own the RoleEntity.
// - Enforce role aggregate invariants.
// - Coordinate Role lifecycle transitions.
// - Emit Role domain events.
// - Expose authorization-safe Role state.
//
// This aggregate does NOT:
//
// - Assign the Role to an Identity.
// - Revoke the Role from an Identity.
// - Manage IdentityRole persistence.
// - Manage RolePermission persistence.
// - Evaluate permissions.
// - Persist itself.
// - Access Prisma.
// - Communicate with external systems.
//
// IdentityRole and RolePermission are separate relationship boundaries.
// Cross-aggregate coordination belongs to the appropriate application/domain
// service boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { RoleEntity } from '../entities/role.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { RoleCreatedEvent } from '../events/role-created.event';
import { RoleActivatedEvent } from '../events/role-activated.event';
import { RoleDeactivatedEvent } from '../events/role-deactivated.event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { RolePublicId } from '../value-objects/role-public-id.vo';
import type { RoleCode } from '../value-objects/role-code.vo';
import type { RoleName } from '../value-objects/role-name.vo';

// =============================================================================
// Props
// =============================================================================

interface RoleAggregateProps {
  role: RoleEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

export class RoleAggregate extends AggregateRoot<RoleAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: RoleAggregateProps) {
    super(props);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(role: RoleEntity): RoleAggregate {
    return new RoleAggregate({
      role,
    });
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(role: RoleEntity): RoleAggregate {
    return new RoleAggregate({
      role,
    });
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  public get role(): RoleEntity {
    return this.props.role;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  public override get id() {
    return this.role.id;
  }

  public override get publicId(): RolePublicId {
    return this.role.publicId;
  }

  // ===========================================================================
  // Role Code
  // ===========================================================================

  public get code(): RoleCode {
    return this.role.code;
  }

  public hasCode(code: RoleCode): boolean {
    return this.role.hasCode(code);
  }

  // ===========================================================================
  // Role Name
  // ===========================================================================

  public get name(): RoleName {
    return this.role.name;
  }

  public rename(name: RoleName): void {
    this.role.rename(name);
  }

  // ===========================================================================
  // Description
  // ===========================================================================

  public get description(): string | undefined {
    return this.role.description;
  }

  public setDescription(description?: string): void {
    this.role.setDescription(description);
  }

  public clearDescription(): void {
    this.role.clearDescription();
  }

  // ===========================================================================
  // Display Order
  // ===========================================================================

  public get displayOrder(): number {
    return this.role.displayOrder;
  }

  public setDisplayOrder(displayOrder: number): void {
    this.role.setDisplayOrder(displayOrder);
  }

  // ===========================================================================
  // System Role
  // ===========================================================================

  public get isSystem(): boolean {
    return this.role.isSystem;
  }

  public isSystemRole(): boolean {
    return this.role.isSystemRole();
  }

  public isCustomRole(): boolean {
    return this.role.isCustomRole();
  }

  // ===========================================================================
  // Lifecycle State
  // ===========================================================================

  public get isActive(): boolean {
    return this.role.isActive;
  }

  public isInactive(): boolean {
    return this.role.isInactive();
  }

  // ===========================================================================
  // Creation
  // ===========================================================================

  /**
   * Records creation of the Role.
   *
   * The RoleCode and RoleName value objects are passed directly to the
   * domain event. Serialization to primitives occurs inside the event.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.addDomainEvent(
      new RoleCreatedEvent(
        this.id.value,
        this.publicId,
        this.code,
        this.name,
        this.description,
        this.displayOrder,
        this.isSystem,
        this.isActive,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Activation
  // ===========================================================================

  public activate(
    activatedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    if (this.role.isActive) {
      return;
    }

    this.role.activate();

    this.role.setUpdatedAt(activatedAt);

    this.addDomainEvent(
      new RoleActivatedEvent(
        this.id.value,
        this.publicId,
        this.code,
        activatedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Deactivation
  // ===========================================================================

  /**
   * Deactivates the Role.
   *
   * System Roles are protected by RoleEntity and cannot be deactivated through
   * the ordinary lifecycle.
   *
   * Deactivation makes the Role unavailable for new assignment.
   *
   * The operation is idempotent for an already-inactive Role.
   */
  public deactivate(
    deactivatedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    // -------------------------------------------------------------------------
    // Idempotency
    // -------------------------------------------------------------------------

    if (!this.role.isActive) {
      return;
    }

    // -------------------------------------------------------------------------
    // State Mutation
    // -------------------------------------------------------------------------

    this.role.deactivate();

    this.role.setUpdatedAt(deactivatedAt);

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new RoleDeactivatedEvent(
        this.id.value,
        this.publicId,
        this.code.value,
        deactivatedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Assignment Eligibility
  // ===========================================================================

  public canBeAssigned(): boolean {
    return this.role.canBeAssigned();
  }

  public cannotBeAssigned(): boolean {
    return this.role.cannotBeAssigned();
  }

  // ===========================================================================
  // Comparison
  // ===========================================================================

  public hasSameCodeAs(role: RoleEntity): boolean {
    return this.role.hasSameCodeAs(role);
  }

  public hasSamePublicIdAs(role: RoleEntity): boolean {
    return this.role.hasSamePublicIdAs(role);
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  public get createdAt(): Date {
    return this.role.createdAt;
  }

  public get updatedAt(): Date {
    return this.role.updatedAt;
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  public setUpdatedAt(updatedAt: Date): void {
    this.role.setUpdatedAt(updatedAt);
  }
}
