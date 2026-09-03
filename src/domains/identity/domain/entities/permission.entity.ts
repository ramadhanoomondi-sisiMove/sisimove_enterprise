// -----------------------------------------------------------------------------
// Identity — Permission Entity
// -----------------------------------------------------------------------------
//
// Represents a Permission within the Identity / Authorization domain.
//
// Aggregate context:
//
// Permission Aggregate
// └── PermissionEntity
//
// The Permission is the authoritative owner of:
//
// - permission identity;
// - stable permission code;
// - protected resource;
// - authorized action;
// - human-readable name;
// - optional description;
// - system-permission designation;
// - active/inactive lifecycle.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Maintain Permission identity.
// - Maintain stable machine-readable PermissionCode.
// - Maintain human-readable permission name.
// - Maintain protected PermissionResource.
// - Maintain PermissionAction.
// - Maintain optional description.
// - Maintain system-permission designation.
// - Maintain active/inactive lifecycle.
// - Enforce permission-level invariants.
// - Provide authorization-safe predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - Assign itself to a Role.
// - Remove itself from a Role.
// - Evaluate whether an Identity has this Permission.
// - Evaluate complete authorization policies.
// - Manage RolePermission persistence.
// - Persist itself.
// - Access Prisma.
// - Communicate with external systems.
// - Emit integration events.
//
// -----------------------------------------------------------------------------
//
// Authorization relationship:
//
// Permission
// └── RolePermission[] → permissions granted to Roles
//
// RolePermission is intentionally maintained as a separate relationship
// entity rather than being embedded as a mutable persistence collection inside
// PermissionEntity.
//
// -----------------------------------------------------------------------------
//
// Database uniqueness:
//
//     @@unique([resource, action])
//
// This is ultimately enforced by the repository/database boundary.
//
// The entity provides `matches()` for domain-level comparison but does not
// attempt to determine whether another Permission already exists.
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

import { PermissionException } from '../exceptions/permission.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { PermissionPublicId } from '../value-objects/permission-public-id.vo';

import type { PermissionCode } from '../value-objects/permission-code.vo';

import type { PermissionResource } from '../value-objects/permission-resource.vo';

import type { PermissionAction } from '../value-objects/permission-action.vo';

// =============================================================================
// Props
// =============================================================================

export interface PermissionProps {
  /**
   * Stable machine-readable identifier of the Permission.
   *
   * Examples:
   *
   * - JOURNEY_CREATE
   * - JOURNEY_READ
   * - BOOKING_CREATE
   * - ADMIN_MANAGE_USERS
   */
  code: PermissionCode;

  /**
   * Human-readable name of the Permission.
   */
  name: string;

  /**
   * Protected resource against which authorization is evaluated.
   */
  resource: PermissionResource;

  /**
   * Action that may be performed against the protected resource.
   */
  action: PermissionAction;

  /**
   * Optional human-readable description of the Permission.
   */
  description: string | undefined;

  /**
   * Indicates whether this Permission is system-defined.
   *
   * System permissions are protected from ordinary destructive lifecycle
   * operations.
   */
  isSystem: boolean;

  /**
   * Indicates whether this Permission is currently active.
   *
   * Inactive permissions should not be considered available for new
   * authorization assignments.
   */
  isActive: boolean;

  /**
   * Permission creation timestamp.
   */
  createdAt: Date;

  /**
   * Permission last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class PermissionEntity extends Entity<
  PermissionProps,
  PermissionPublicId
> {
  // ===========================================================================
  // Constants
  // ===========================================================================

  private static readonly MAX_NAME_LENGTH = 150;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: PermissionProps,
    id?: UniqueEntityId,
    publicId?: PermissionPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Permission.
   *
   * Permissions are active by default.
   *
   * Whether a Permission is system-defined is explicitly supplied because
   * system ownership is a domain decision and must not be inferred solely
   * from its code.
   */
  public static create(
    code: PermissionCode,
    name: string,
    resource: PermissionResource,
    action: PermissionAction,
    description?: string,
    isSystem = true,
    isActive = true,
    createdAt: Date = new Date(),
  ): PermissionEntity {
    PermissionEntity.ensureValidDate(createdAt, 'creation date');

    const normalizedName = PermissionEntity.normalizeRequiredName(name);

    const timestamp = PermissionEntity.cloneDate(createdAt);

    return new PermissionEntity(
      {
        code,
        name: normalizedName,
        resource,
        action,

        description: PermissionEntity.normalizeOptionalText(description),

        isSystem,
        isActive,

        createdAt: timestamp,

        updatedAt: PermissionEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new PermissionPublicId(),
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Permission.
   *
   * Rehydration validates entity-level invariants but does not perform
   * cross-aggregate validation such as:
   *
   * - whether another Permission already uses the same resource/action;
   * - whether Roles currently reference this Permission;
   * - whether the Permission is permitted by an authorization policy.
   */
  public static rehydrate(
    props: PermissionProps,
    id: UniqueEntityId,
    publicId: PermissionPublicId,
  ): PermissionEntity {
    PermissionEntity.ensureValidDate(props.createdAt, 'creation date');

    PermissionEntity.ensureValidDate(props.updatedAt, 'updated date');

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new PermissionException(
        'Permission updated date cannot be before creation date',
      );
    }

    const normalizedName = PermissionEntity.normalizeRequiredName(props.name);

    return new PermissionEntity(
      {
        code: props.code,
        name: normalizedName,
        resource: props.resource,
        action: props.action,

        description: PermissionEntity.normalizeOptionalText(props.description),

        isSystem: props.isSystem,
        isActive: props.isActive,

        createdAt: PermissionEntity.cloneDate(props.createdAt),

        updatedAt: PermissionEntity.cloneDate(props.updatedAt),
      },

      id,
      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Permission.
   */
  public override get publicId(): PermissionPublicId {
    return super.publicId;
  }

  // ===========================================================================
  // Code
  // ===========================================================================

  /**
   * Stable machine-readable PermissionCode.
   */
  public get code(): PermissionCode {
    return this.props.code;
  }

  /**
   * Determines whether this Permission uses the supplied code.
   */
  public hasCode(code: PermissionCode): boolean {
    return this.props.code.equals(code);
  }

  // ===========================================================================
  // Name
  // ===========================================================================

  /**
   * Human-readable Permission name.
   */
  public get name(): string {
    return this.props.name;
  }

  /**
   * Renames the Permission.
   *
   * The stable PermissionCode remains unchanged.
   */
  public rename(name: string): void {
    const normalized = PermissionEntity.normalizeRequiredName(name);

    if (this.props.name === normalized) {
      return;
    }

    this.props.name = normalized;

    this.touch();
  }

  // ===========================================================================
  // Resource
  // ===========================================================================

  /**
   * Protected resource represented by this Permission.
   */
  public get resource(): PermissionResource {
    return this.props.resource;
  }

  /**
   * Determines whether this Permission protects the supplied resource.
   */
  public protectsResource(resource: PermissionResource): boolean {
    return this.props.resource.equals(resource);
  }

  // ===========================================================================
  // Action
  // ===========================================================================

  /**
   * Authorized action represented by this Permission.
   */
  public get action(): PermissionAction {
    return this.props.action;
  }

  /**
   * Determines whether this Permission represents the supplied action.
   */
  public representsAction(action: PermissionAction): boolean {
    return this.props.action.equals(action);
  }

  // ===========================================================================
  // Resource + Action
  // ===========================================================================

  /**
   * Determines whether this Permission represents the supplied resource and
   * action combination.
   *
   * This corresponds to the database uniqueness invariant:
   *
   *     @@unique([resource, action])
   *
   * The method performs entity-level comparison only.
   */
  public matches(
    resource: PermissionResource,
    action: PermissionAction,
  ): boolean {
    return (
      this.props.resource.equals(resource) && this.props.action.equals(action)
    );
  }

  /**
   * Determines whether another Permission represents the same resource/action
   * capability.
   */
  public hasSameCapabilityAs(permission: PermissionEntity): boolean {
    return this.matches(permission.resource, permission.action);
  }

  // ===========================================================================
  // Description
  // ===========================================================================

  /**
   * Optional human-readable description.
   */
  public get description(): string | undefined {
    return this.props.description;
  }

  /**
   * Updates the Permission description.
   */
  public setDescription(description?: string): void {
    const normalized = PermissionEntity.normalizeOptionalText(description);

    if (this.props.description === normalized) {
      return;
    }

    this.props.description = normalized;

    this.touch();
  }

  /**
   * Removes the Permission description.
   */
  public clearDescription(): void {
    this.setDescription(undefined);
  }

  // ===========================================================================
  // System Permission
  // ===========================================================================

  /**
   * Indicates whether this is a system-defined Permission.
   */
  public get isSystem(): boolean {
    return this.props.isSystem;
  }

  /**
   * Determines whether this Permission is system-defined.
   */
  public isSystemPermission(): boolean {
    return this.props.isSystem;
  }

  /**
   * Determines whether this Permission is application/custom-defined.
   */
  public isCustomPermission(): boolean {
    return !this.props.isSystem;
  }

  // ===========================================================================
  // Activation
  // ===========================================================================

  /**
   * Indicates whether the Permission is currently active.
   */
  public get isActive(): boolean {
    return this.props.isActive;
  }

  /**
   * Indicates whether the Permission is inactive.
   */
  public isInactive(): boolean {
    return !this.props.isActive;
  }

  /**
   * Activates the Permission.
   *
   * Activation makes the Permission available for authorization assignment,
   * subject to the rules of the authorization/application boundary.
   */
  public activate(): void {
    if (this.props.isActive) {
      return;
    }

    this.props.isActive = true;

    this.touch();
  }

  /**
   * Deactivates the Permission.
   *
   * System Permissions cannot be deactivated through the ordinary lifecycle.
   */
  public deactivate(): void {
    if (this.props.isSystem) {
      throw new PermissionException(
        'A system Permission cannot be deactivated',
      );
    }

    if (!this.props.isActive) {
      return;
    }

    this.props.isActive = false;

    this.touch();
  }

  // ===========================================================================
  // Authorization Eligibility
  // ===========================================================================

  /**
   * Determines whether this Permission is currently eligible to be assigned
   * to a Role.
   *
   * This is a Permission-level predicate only.
   */
  public canBeAssigned(): boolean {
    return this.props.isActive;
  }

  /**
   * Determines whether this Permission is currently unavailable for new
   * authorization assignment.
   */
  public cannotBeAssigned(): boolean {
    return !this.props.isActive;
  }

  // ===========================================================================
  // Comparison
  // ===========================================================================

  /**
   * Determines whether this Permission has the same stable code as another
   * Permission.
   */
  public hasSameCodeAs(permission: PermissionEntity): boolean {
    return this.props.code.equals(permission.code);
  }

  /**
   * Determines whether this Permission has the same public identity as another
   * Permission.
   */
  public hasSamePublicIdAs(permission: PermissionEntity): boolean {
    return this.publicId.equals(permission.publicId);
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Permission creation timestamp.
   *
   * A defensive copy prevents external mutation.
   */
  public get createdAt(): Date {
    return PermissionEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Permission last-update timestamp.
   *
   * A defensive copy prevents external mutation.
   */
  public get updatedAt(): Date {
    return PermissionEntity.cloneDate(this.props.updatedAt);
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp during mapping/rehydration workflows.
   *
   * This method does not represent a business state transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    PermissionEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = PermissionEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new PermissionException(
        'Permission updated date cannot be before creation date',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Normalizes and validates a required Permission name.
   *
   * Empty or whitespace-only names are rejected.
   */
  private static normalizeRequiredName(value: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new PermissionException('Permission name is required');
    }

    if (normalized.length > PermissionEntity.MAX_NAME_LENGTH) {
      throw new PermissionException(
        `Permission name must not exceed ${PermissionEntity.MAX_NAME_LENGTH} characters`,
      );
    }

    return normalized;
  }

  /**
   * Normalizes optional presentation text.
   *
   * Empty strings are represented as undefined.
   */
  private static normalizeOptionalText(
    value: string | undefined,
  ): string | undefined {
    if (value === undefined) {
      return undefined;
    }

    const normalized = value.trim();

    return normalized.length > 0 ? normalized : undefined;
  }

  /**
   * Validates a Date value.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new PermissionException(
        `Permission ${fieldName} must be a valid date`,
      );
    }
  }

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    PermissionEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
