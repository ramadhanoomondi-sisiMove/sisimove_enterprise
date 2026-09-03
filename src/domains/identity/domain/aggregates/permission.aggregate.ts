// -----------------------------------------------------------------------------
// Identity — Permission Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate root for a Permission within the Identity / Authorization domain.
//
// Aggregate:
//
// PermissionAggregate
// └── PermissionEntity
//
// Responsibilities:
//
// - Own the PermissionEntity.
// - Enforce Permission aggregate invariants.
// - Coordinate Permission lifecycle transitions.
// - Emit Permission domain events.
// - Expose authorization-safe Permission state.
//
// This aggregate does NOT:
//
// - Assign the Permission to a Role.
// - Remove the Permission from a Role.
// - Manage RolePermission persistence.
// - Evaluate whether an Identity has the Permission.
// - Evaluate complete authorization policies.
// - Persist itself.
// - Access Prisma.
// - Communicate with external systems.
//
// RolePermission is a separate authorization relationship boundary.
// Cross-aggregate coordination belongs to the appropriate
// application/domain service boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { PermissionEntity } from '../entities/permission.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { PermissionCreatedEvent } from '../events/permission-created.event';

import { PermissionActivatedEvent } from '../events/permission-activated.event';

import { PermissionDeactivatedEvent } from '../events/permission-deactivated.event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { PermissionPublicId } from '../value-objects/permission-public-id.vo';

import type { PermissionCode } from '../value-objects/permission-code.vo';

import type { PermissionResource } from '../value-objects/permission-resource.vo';

import type { PermissionAction } from '../value-objects/permission-action.vo';

// =============================================================================
// Props
// =============================================================================

interface PermissionAggregateProps {
  permission: PermissionEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

export class PermissionAggregate extends AggregateRoot<PermissionAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: PermissionAggregateProps) {
    super(props);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a brand-new Permission aggregate.
   *
   * The PermissionEntity is expected to already contain the complete initial
   * state established by its entity factory.
   *
   * Creation does not automatically emit PermissionCreatedEvent.
   *
   * The application boundary explicitly calls recordCreated() after the
   * aggregate has been successfully created.
   */
  public static create(permission: PermissionEntity): PermissionAggregate {
    return new PermissionAggregate({
      permission,
    });
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a Permission aggregate from persistence.
   *
   * Rehydration intentionally does not emit domain events.
   */
  public static rehydrate(permission: PermissionEntity): PermissionAggregate {
    return new PermissionAggregate({
      permission,
    });
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the Permission entity owned by this aggregate.
   *
   * Application services should prefer aggregate behavior methods over directly
   * mutating the returned entity.
   */
  public get permission(): PermissionEntity {
    return this.props.permission;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal aggregate identity.
   *
   * Used by persistence and DomainEvent.metadata.aggregateId.
   */
  public override get id() {
    return this.permission.id;
  }

  /**
   * Public identity of the Permission.
   */
  public override get publicId(): PermissionPublicId {
    return this.permission.publicId;
  }

  // ===========================================================================
  // Permission Code
  // ===========================================================================

  /**
   * Stable machine-readable PermissionCode.
   */
  public get code(): PermissionCode {
    return this.permission.code;
  }

  /**
   * Determines whether this Permission uses the supplied code.
   */
  public hasCode(code: PermissionCode): boolean {
    return this.permission.hasCode(code);
  }

  // ===========================================================================
  // Permission Name
  // ===========================================================================

  /**
   * Human-readable Permission name.
   */
  public get name(): string {
    return this.permission.name;
  }

  /**
   * Renames the Permission.
   *
   * The stable PermissionCode remains unchanged.
   *
   * This operation does not emit a domain event because the current Permission
   * lifecycle event model does not define a PermissionRenamedEvent.
   */
  public rename(name: string): void {
    this.permission.rename(name);
  }

  // ===========================================================================
  // Resource
  // ===========================================================================

  /**
   * Protected resource represented by this Permission.
   */
  public get resource(): PermissionResource {
    return this.permission.resource;
  }

  /**
   * Determines whether this Permission protects the supplied resource.
   */
  public protectsResource(resource: PermissionResource): boolean {
    return this.permission.protectsResource(resource);
  }

  // ===========================================================================
  // Action
  // ===========================================================================

  /**
   * Authorized action represented by this Permission.
   */
  public get action(): PermissionAction {
    return this.permission.action;
  }

  /**
   * Determines whether this Permission represents the supplied action.
   */
  public representsAction(action: PermissionAction): boolean {
    return this.permission.representsAction(action);
  }

  // ===========================================================================
  // Capability
  // ===========================================================================

  /**
   * Determines whether this Permission represents the supplied resource/action
   * capability.
   *
   * This corresponds to the database uniqueness invariant:
   *
   *     @@unique([resource, action])
   *
   * The aggregate performs entity-level comparison only. It does not determine
   * whether another Permission already exists.
   */
  public matches(
    resource: PermissionResource,
    action: PermissionAction,
  ): boolean {
    return this.permission.matches(resource, action);
  }

  /**
   * Determines whether another Permission represents the same resource/action
   * capability.
   */
  public hasSameCapabilityAs(permission: PermissionEntity): boolean {
    return this.permission.hasSameCapabilityAs(permission);
  }

  // ===========================================================================
  // Description
  // ===========================================================================

  /**
   * Optional human-readable Permission description.
   */
  public get description(): string | undefined {
    return this.permission.description;
  }

  /**
   * Updates the Permission description.
   *
   * This is metadata mutation and does not emit a domain event because the
   * current Permission event model does not define a PermissionDescriptionUpdated
   * event.
   */
  public setDescription(description?: string): void {
    this.permission.setDescription(description);
  }

  /**
   * Removes the Permission description.
   */
  public clearDescription(): void {
    this.permission.clearDescription();
  }

  // ===========================================================================
  // System Permission
  // ===========================================================================

  /**
   * Indicates whether this is a system-defined Permission.
   */
  public get isSystem(): boolean {
    return this.permission.isSystem;
  }

  /**
   * Determines whether this is a system-defined Permission.
   */
  public isSystemPermission(): boolean {
    return this.permission.isSystemPermission();
  }

  /**
   * Determines whether this is a custom/application-defined Permission.
   */
  public isCustomPermission(): boolean {
    return this.permission.isCustomPermission();
  }

  // ===========================================================================
  // Lifecycle State
  // ===========================================================================

  /**
   * Indicates whether the Permission is currently active.
   */
  public get isActive(): boolean {
    return this.permission.isActive;
  }

  /**
   * Indicates whether the Permission is inactive.
   */
  public isInactive(): boolean {
    return this.permission.isInactive();
  }

  // ===========================================================================
  // Creation
  // ===========================================================================

  /**
   * Records creation of the Permission.
   *
   * The event represents the Permission state already established by the
   * entity factory.
   *
   * No persistence or external operation occurs here.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.addDomainEvent(
      new PermissionCreatedEvent(
        this.id.value,
        this.publicId,

        this.name,

        // ---------------------------------------------------------------------
        // Value Objects -> primitive event payloads
        // ---------------------------------------------------------------------

        this.code.value,
        this.resource.value,
        this.action.value,

        this.description,
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

  /**
   * Activates the Permission.
   *
   * Activation makes the Permission available for authorization assignment,
   * subject to the rules of the authorization/application boundary.
   *
   * The operation is idempotent. If the Permission is already active, no
   * state mutation or domain event occurs.
   */
  public activate(
    activatedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    // -------------------------------------------------------------------------
    // Idempotency
    // -------------------------------------------------------------------------

    if (this.permission.isActive) {
      return;
    }

    // -------------------------------------------------------------------------
    // State Mutation
    // -------------------------------------------------------------------------

    this.permission.activate();

    this.permission.setUpdatedAt(activatedAt);

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new PermissionActivatedEvent(
        this.id.value,
        this.publicId,

        // ---------------------------------------------------------------------
        // Value Objects -> primitive event payloads
        // ---------------------------------------------------------------------

        this.code.value,
        this.resource.value,
        this.action.value,

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
   * Deactivates the Permission.
   *
   * System Permissions are protected by PermissionEntity and cannot be
   * deactivated through the ordinary lifecycle.
   *
   * Deactivation makes the Permission unavailable for new authorization
   * assignment.
   *
   * The operation is idempotent for already-inactive custom Permissions.
   */
  public deactivate(
    deactivatedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    // -------------------------------------------------------------------------
    // Idempotency
    // -------------------------------------------------------------------------

    if (!this.permission.isActive) {
      return;
    }

    // -------------------------------------------------------------------------
    // State Mutation
    // -------------------------------------------------------------------------

    this.permission.deactivate();

    this.permission.setUpdatedAt(deactivatedAt);

    // -------------------------------------------------------------------------
    // Domain Event
    // -------------------------------------------------------------------------

    this.addDomainEvent(
      new PermissionDeactivatedEvent(
        this.id.value,
        this.publicId,

        // ---------------------------------------------------------------------
        // Value Objects -> primitive event payloads
        // ---------------------------------------------------------------------

        this.code.value,
        this.resource.value,
        this.action.value,

        deactivatedAt,

        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Assignment Eligibility
  // ===========================================================================

  /**
   * Determines whether the Permission is currently eligible to be assigned
   * to a Role.
   *
   * This is a Permission-level predicate only.
   *
   * It does not evaluate:
   *
   * - Identity status;
   * - Identity verification;
   * - Role eligibility;
   * - authorization policy;
   * - business-specific authorization rules.
   */
  public canBeAssigned(): boolean {
    return this.permission.canBeAssigned();
  }

  /**
   * Determines whether the Permission is currently unavailable for new
   * authorization assignment.
   */
  public cannotBeAssigned(): boolean {
    return this.permission.cannotBeAssigned();
  }

  // ===========================================================================
  // Comparison
  // ===========================================================================

  /**
   * Determines whether this Permission has the same stable code as another
   * Permission.
   */
  public hasSameCodeAs(permission: PermissionEntity): boolean {
    return this.permission.hasSameCodeAs(permission);
  }

  /**
   * Determines whether this Permission has the same public identity as another
   * Permission.
   */
  public hasSamePublicIdAs(permission: PermissionEntity): boolean {
    return this.permission.hasSamePublicIdAs(permission);
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Permission creation timestamp.
   *
   * The entity returns a defensive copy.
   */
  public get createdAt(): Date {
    return this.permission.createdAt;
  }

  /**
   * Permission last-update timestamp.
   *
   * The entity returns a defensive copy.
   */
  public get updatedAt(): Date {
    return this.permission.updatedAt;
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp during mapping workflows.
   *
   * This is not a business state transition and therefore does not emit a
   * domain event.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.permission.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Event State Protection
  // ===========================================================================

  /**
   * The aggregate intentionally does not expose arbitrary event registration.
   *
   * Domain events can only be generated through meaningful aggregate
   * operations such as:
   *
   * - recordCreated()
   * - activate()
   * - deactivate()
   *
   * Permission metadata mutations such as rename(), setDescription(), and
   * clearDescription() intentionally do not emit events because corresponding
   * domain events have not been defined in the current Permission event model.
   */
}
