// -----------------------------------------------------------------------------
// Identity — Role Entity
// -----------------------------------------------------------------------------
//
// Represents a Role within the Identity / Authorization domain.
//
// Aggregate context:
//
// Role Aggregate
// └── RoleEntity
//
// The Role is the authoritative owner of:
//
// - role identity;
// - role code;
// - role name;
// - role description;
// - display ordering;
// - system-role designation;
// - active/inactive lifecycle.
//
// Authorization relationships such as RolePermission are coordinated by the
// authorization boundary and are intentionally not embedded in this entity.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Maintain Role identity.
// - Maintain stable machine-readable RoleCode.
// - Maintain human-readable RoleName.
// - Maintain optional description.
// - Maintain administrative display ordering.
// - Maintain system-role designation.
// - Maintain active/inactive lifecycle.
// - Protect system roles from unsafe lifecycle operations.
// - Enforce role-level invariants.
// - Provide authorization-safe predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - Assign itself to an Identity.
// - Revoke itself from an Identity.
// - Directly authorize an Identity.
// - Evaluate whether an Identity has a permission.
// - Persist itself.
// - Access Prisma.
// - Communicate with external systems.
// - Emit integration events.
// - Manage IdentityRole persistence.
// - Directly manage RolePermission persistence.
//
// -----------------------------------------------------------------------------
//
// Authorization relationships:
//
// Role
// ├── IdentityRole[]      → assignment to identities
// └── RolePermission[]    → permissions granted by the role
//
// These relationships are coordinated by their respective domain/application
// boundaries rather than being represented as mutable persistence collections
// inside this entity.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
//                       ACTIVE
//                         │
//                       disable
//                         ▼
//                      INACTIVE
//                         │
//                       enable
//                         ▼
//                       ACTIVE
//
// System roles are protected from ordinary destructive lifecycle operations.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { RoleException } from '../exceptions/role.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { RolePublicId } from '../value-objects/role-public-id.vo';

import type { RoleCode } from '../value-objects/role-code.vo';

import type { RoleName } from '../value-objects/role-name.vo';

// =============================================================================
// Props
// =============================================================================

export interface RoleProps {
  /**
   * Stable machine-readable role identifier.
   *
   * Examples:
   *
   * - MEMBER
   * - DRIVER
   * - ADMIN
   * - SUPPORT_AGENT
   */
  code: RoleCode;

  /**
   * Human-readable role name.
   */
  name: RoleName;

  /**
   * Optional human-readable description of the role.
   */
  description: string | undefined;

  /**
   * Administrative ordering used when presenting roles.
   *
   * Lower values appear before higher values.
   */
  displayOrder: number;

  /**
   * Indicates whether this role is a system-defined role.
   *
   * System roles are protected from ordinary destructive operations.
   */
  isSystem: boolean;

  /**
   * Indicates whether this role is currently available for assignment.
   */
  isActive: boolean;

  /**
   * Role creation timestamp.
   */
  createdAt: Date;

  /**
   * Role last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class RoleEntity extends Entity<RoleProps, RolePublicId> {
  // ===========================================================================
  // Constants
  // ===========================================================================

  private static readonly MIN_DISPLAY_ORDER = 0;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: RoleProps,
    id?: UniqueEntityId,
    publicId?: RolePublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Role.
   *
   * New roles are active by default unless explicitly created as inactive.
   *
   * System-role designation is supplied explicitly because whether a role is
   * system-managed is a domain decision and must not be inferred from the
   * role code.
   */
  public static create(
    code: RoleCode,
    name: RoleName,
    description?: string,
    displayOrder = 0,
    isSystem = false,
    isActive = true,
    createdAt: Date = new Date(),
  ): RoleEntity {
    RoleEntity.ensureValidDate(createdAt, 'creation date');

    RoleEntity.ensureValidDisplayOrder(displayOrder);

    const timestamp = RoleEntity.cloneDate(createdAt);

    return new RoleEntity(
      {
        code,
        name,

        description: RoleEntity.normalizeOptionalText(description),

        displayOrder,

        isSystem,
        isActive,

        createdAt: timestamp,

        updatedAt: RoleEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new RolePublicId(),
    );
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Role.
   *
   * Rehydration validates entity-level invariants but does not perform
   * cross-aggregate validation such as:
   *
   * - whether identities currently use this role;
   * - whether permissions assigned to this role still exist;
   * - whether the role is permitted in a particular authorization policy.
   */
  public static rehydrate(
    props: RoleProps,
    id: UniqueEntityId,
    publicId: RolePublicId,
  ): RoleEntity {
    RoleEntity.ensureValidDate(props.createdAt, 'creation date');

    RoleEntity.ensureValidDate(props.updatedAt, 'updated date');

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new RoleException(
        'Role updated date cannot be before creation date',
      );
    }

    RoleEntity.ensureValidDisplayOrder(props.displayOrder);

    return new RoleEntity(
      {
        code: props.code,
        name: props.name,

        description: RoleEntity.normalizeOptionalText(props.description),

        displayOrder: props.displayOrder,

        isSystem: props.isSystem,
        isActive: props.isActive,

        createdAt: RoleEntity.cloneDate(props.createdAt),
        updatedAt: RoleEntity.cloneDate(props.updatedAt),
      },

      id,
      publicId,
    );
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Role.
   */
  public override get publicId(): RolePublicId {
    return super.publicId;
  }

  // ===========================================================================
  // Code
  // ===========================================================================

  /**
   * Stable machine-readable RoleCode.
   */
  public get code(): RoleCode {
    return this.props.code;
  }

  /**
   * Determines whether this Role uses the supplied code.
   */
  public hasCode(code: RoleCode): boolean {
    return this.props.code.equals(code);
  }

  // ===========================================================================
  // Name
  // ===========================================================================

  /**
   * Human-readable RoleName.
   */
  public get name(): RoleName {
    return this.props.name;
  }

  /**
   * Changes the human-readable role name.
   *
   * The stable RoleCode remains unchanged.
   */
  public rename(name: RoleName): void {
    if (this.props.name.equals(name)) {
      return;
    }

    this.props.name = name;

    this.touch();
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
   * Updates the role description.
   */
  public setDescription(description?: string): void {
    const normalized = RoleEntity.normalizeOptionalText(description);

    if (this.props.description === normalized) {
      return;
    }

    this.props.description = normalized;

    this.touch();
  }

  /**
   * Removes the role description.
   */
  public clearDescription(): void {
    this.setDescription(undefined);
  }

  // ===========================================================================
  // Display Order
  // ===========================================================================

  /**
   * Administrative display ordering.
   */
  public get displayOrder(): number {
    return this.props.displayOrder;
  }

  /**
   * Changes the administrative display ordering.
   */
  public setDisplayOrder(displayOrder: number): void {
    RoleEntity.ensureValidDisplayOrder(displayOrder);

    if (this.props.displayOrder === displayOrder) {
      return;
    }

    this.props.displayOrder = displayOrder;

    this.touch();
  }

  // ===========================================================================
  // System Role
  // ===========================================================================

  /**
   * Indicates whether this is a system-defined role.
   */
  public get isSystem(): boolean {
    return this.props.isSystem;
  }

  /**
   * Determines whether this role is system-defined.
   */
  public isSystemRole(): boolean {
    return this.props.isSystem;
  }

  /**
   * Determines whether this role is a custom/application-defined role.
   */
  public isCustomRole(): boolean {
    return !this.props.isSystem;
  }

  // ===========================================================================
  // Activation
  // ===========================================================================

  /**
   * Indicates whether the Role is currently active.
   */
  public get isActive(): boolean {
    return this.props.isActive;
  }

  /**
   * Indicates whether the Role is inactive.
   */
  public isInactive(): boolean {
    return !this.props.isActive;
  }

  /**
   * Activates the Role.
   *
   * Activation makes the role eligible for assignment subject to the
   * authorization/application rules governing the requesting operation.
   */
  public activate(): void {
    if (this.props.isActive) {
      return;
    }

    this.props.isActive = true;

    this.touch();
  }

  /**
   * Deactivates the Role.
   *
   * System roles cannot be deactivated through the ordinary role lifecycle.
   */
  public deactivate(): void {
    if (this.props.isSystem) {
      throw new RoleException('A system Role cannot be deactivated');
    }

    if (!this.props.isActive) {
      return;
    }

    this.props.isActive = false;

    this.touch();
  }

  // ===========================================================================
  // Assignment Eligibility
  // ===========================================================================

  /**
   * Determines whether the Role is currently eligible for assignment.
   *
   * This is a role-level predicate only.
   *
   * It does not evaluate:
   *
   * - Identity status;
   * - Identity verification;
   * - authorization policy;
   * - role expiry;
   * - business-specific eligibility.
   */
  public canBeAssigned(): boolean {
    return this.props.isActive;
  }

  /**
   * Determines whether the Role is currently unavailable for new assignment.
   */
  public cannotBeAssigned(): boolean {
    return !this.props.isActive;
  }

  // ===========================================================================
  // Comparison
  // ===========================================================================

  /**
   * Determines whether this Role has the same stable code as another Role.
   */
  public hasSameCodeAs(role: RoleEntity): boolean {
    return this.props.code.equals(role.code);
  }

  /**
   * Determines whether this Role has the same public identity as another Role.
   */
  public hasSamePublicIdAs(role: RoleEntity): boolean {
    return this.publicId.equals(role.publicId);
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Role creation timestamp.
   *
   * A defensive copy prevents external mutation.
   */
  public get createdAt(): Date {
    return RoleEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Role last-update timestamp.
   *
   * A defensive copy prevents external mutation.
   */
  public get updatedAt(): Date {
    return RoleEntity.cloneDate(this.props.updatedAt);
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
    RoleEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = RoleEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new RoleException(
        'Role updated date cannot be before creation date',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Validates the display order.
   */
  private static ensureValidDisplayOrder(displayOrder: number): void {
    if (!Number.isInteger(displayOrder)) {
      throw new RoleException('Role display order must be an integer');
    }

    if (displayOrder < RoleEntity.MIN_DISPLAY_ORDER) {
      throw new RoleException(
        `Role display order cannot be less than ${RoleEntity.MIN_DISPLAY_ORDER}`,
      );
    }
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
   * Validates a Date.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || Number.isNaN(value.getTime())) {
      throw new RoleException(`Role ${fieldName} must be a valid date`);
    }
  }

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    RoleEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
