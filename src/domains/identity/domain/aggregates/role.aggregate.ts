// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { RoleEntity } from '../entities/role.entity';
import { RolePermissionEntity } from '../entities/role-permission.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { PermissionAssignedToRoleEvent } from '../events/permission-assigned-to-role.event';
import { PermissionRemovedFromRoleEvent } from '../events/permission-removed-from-role.event';

import { RoleActivatedEvent } from '../events/role-activated.event';
import { RoleCreatedEvent } from '../events/role-created.event';
import { RoleDeactivatedEvent } from '../events/role-deactivated.event';
import { RoleDescriptionChangedEvent } from '../events/role-description-changed.event';
import { RoleDisplayOrderChangedEvent } from '../events/role-display-order-changed.event';
import { RoleRenamedEvent } from '../events/role-renamed.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { PermissionAlreadyAssignedException } from '../exceptions/permission-already-assigned.exception';
import { PermissionNotAssignedException } from '../exceptions/permission-not-assigned.exception';

import { RoleAlreadyActiveException } from '../exceptions/role-already-active.exception';
import { RoleAlreadyInactiveException } from '../exceptions/role-already-inactive.exception';
import { RoleInactiveException } from '../exceptions/role-inactive.exception';
import { SystemRoleModificationNotAllowedException } from '../exceptions/system-role-modification-not-allowed.exception';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { PermissionId } from '../value-objects/permission-id.vo';
import type { RoleName } from '../value-objects/role-name.vo';

// -----------------------------------------------------------------------------
// Aggregate Props
// -----------------------------------------------------------------------------

interface RoleAggregateProps {
  role: RoleEntity;
  rolePermissions: RolePermissionEntity[];
}

export class RoleAggregate extends AggregateRoot<RoleAggregateProps> {
  private constructor(props: RoleAggregateProps) {
    super(props);
  }

  // --------------------------------------------------------------------------
  // Factory
  // --------------------------------------------------------------------------

  static create(
    role: RoleEntity,
    correlationId: string,
    causationId?: string,
  ): RoleAggregate {
    const aggregate = new RoleAggregate({
      role,
      rolePermissions: [],
    });

    aggregate.addDomainEvent(
      new RoleCreatedEvent(
        role.id.value,
        role.publicId.value,
        role.name,
        role.code,
        correlationId,
        causationId,
      ),
    );

    return aggregate;
  }

  static rehydrate(
    role: RoleEntity,
    rolePermissions: RolePermissionEntity[],
  ): RoleAggregate {
    return new RoleAggregate({
      role,
      rolePermissions,
    });
  }
  // --------------------------------------------------------------------------
  // Aggregate State
  // --------------------------------------------------------------------------

  get role(): RoleEntity {
    return this.props.role;
  }

  get rolePermissions(): readonly RolePermissionEntity[] {
    return this.props.rolePermissions;
  }

  // --------------------------------------------------------------------------
  // Identity
  // --------------------------------------------------------------------------

  override get id() {
    return this.role.id;
  }

  override get publicId() {
    return this.role.publicId;
  }

  // --------------------------------------------------------------------------
  // Role Properties
  // --------------------------------------------------------------------------

  get name(): string {
    return this.role.name;
  }

  get code(): string {
    return this.role.code;
  }

  get description(): string | undefined {
    return this.role.description;
  }

  get displayOrder(): number {
    return this.role.displayOrder;
  }

  get isActive(): boolean {
    return this.role.isActive;
  }

  get isSystem(): boolean {
    return this.role.isSystem;
  }

  get createdAt(): Date {
    return this.role.createdAt;
  }

  get updatedAt(): Date {
    return this.role.updatedAt;
  }

  // --------------------------------------------------------------------------
  // Queries
  // --------------------------------------------------------------------------

  /**
   * Returns true when the role is active.
   */
  active(): boolean {
    return this.role.isActive;
  }

  /**
   * Returns true when the role is a protected system role.
   */
  system(): boolean {
    return this.role.isSystem;
  }

  /**
   * Returns true if the role has at least one permission.
   */
  hasPermissions(): boolean {
    return this.props.rolePermissions.length > 0;
  }

  /**
   * Returns true if the role has no permissions.
   */
  hasNoPermissions(): boolean {
    return this.props.rolePermissions.length === 0;
  }

  /**
   * Returns the total number of assigned permissions.
   */
  permissionCount(): number {
    return this.props.rolePermissions.length;
  }

  /**
   * Returns all role-permission assignments.
   */
  permissions(): readonly RolePermissionEntity[] {
    return this.props.rolePermissions;
  }

  /**
   * Returns all assigned permission identifiers.
   */
  permissionIds(): readonly PermissionId[] {
    return this.props.rolePermissions.map(
      (rolePermission) => rolePermission.permissionId,
    );
  }

  /**
   * Returns true if the specified permission is assigned.
   */
  hasPermission(permissionId: PermissionId): boolean {
    return this.rolePermission(permissionId) !== undefined;
  }

  /**
   * Returns the role-permission assignment for the specified permission.
   */
  rolePermission(permissionId: PermissionId): RolePermissionEntity | undefined {
    return this.rolePermission(permissionId);
  }

  /**
   * Returns the most recently assigned permission.
   */
  latestRolePermission(): RolePermissionEntity | undefined {
    return this.props.rolePermissions.at(-1);
  }

  // --------------------------------------------------------------------------
  // Role Lifecycle
  // --------------------------------------------------------------------------

  /**
   * Renames the role.
   */
  rename(
    name: RoleName,
    renamedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureNotSystemRole();

    if (this.role.name === name.value) {
      return;
    }

    const previousName = this.role.name;

    this.role.setName(name.value);
    this.role.setUpdatedAt(renamedAt);

    this.addDomainEvent(
      new RoleRenamedEvent(
        this.id.value,
        this.publicId.value,
        previousName,
        name.value,
        renamedAt,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Updates the role description.
   */
  changeDescription(
    description: string | undefined,
    changedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureNotSystemRole();

    if (this.role.description === description) {
      return;
    }

    const previousDescription = this.role.description;

    this.role.setDescription(description);
    this.role.setUpdatedAt(changedAt);

    this.addDomainEvent(
      new RoleDescriptionChangedEvent(
        this.id.value,
        this.publicId.value,
        previousDescription,
        description,
        changedAt,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Changes the display order.
   */
  changeDisplayOrder(
    displayOrder: number,
    changedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureNotSystemRole();

    if (this.role.displayOrder === displayOrder) {
      return;
    }

    const previousDisplayOrder = this.role.displayOrder;

    this.role.setDisplayOrder(displayOrder);
    this.role.setUpdatedAt(changedAt);

    this.addDomainEvent(
      new RoleDisplayOrderChangedEvent(
        this.id.value,
        this.publicId.value,
        previousDisplayOrder,
        displayOrder,
        changedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // --------------------------------------------------------------------------
  // Role Lifecycle
  // --------------------------------------------------------------------------

  /**
   * Activates the role.
   */
  activate(
    activatedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    if (this.role.isActive) {
      throw new RoleAlreadyActiveException();
    }

    this.role.activate();
    this.role.setUpdatedAt(activatedAt);

    this.addDomainEvent(
      new RoleActivatedEvent(
        this.id.value,
        this.publicId.value,
        activatedAt,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Deactivates the role.
   */
  deactivate(
    deactivatedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureNotSystemRole();

    if (!this.role.isActive) {
      throw new RoleAlreadyInactiveException();
    }

    this.role.deactivate();
    this.role.setUpdatedAt(deactivatedAt);

    this.addDomainEvent(
      new RoleDeactivatedEvent(
        this.id.value,
        this.publicId.value,
        deactivatedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // --------------------------------------------------------------------------
  // Permission Management
  // --------------------------------------------------------------------------

  /**
   * Assigns a permission to the role.
   */
  assignPermission(
    permissionId: PermissionId,
    assignedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureActive();
    this.ensurePermissionNotAssigned(permissionId);

    const rolePermission = RolePermissionEntity.create({
      roleId: this.publicId,
      permissionId,
      createdAt: assignedAt,
    });

    this.addRolePermission(rolePermission);

    this.role.setUpdatedAt(assignedAt);

    this.addDomainEvent(
      new PermissionAssignedToRoleEvent(
        this.id.value,
        this.publicId.value,
        permissionId.value,
        assignedAt,
        correlationId,
        causationId,
      ),
    );
  }

  /**
   * Removes a permission from the role.
   */
  removePermission(
    permissionId: PermissionId,
    removedAt: Date,
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureActive();
    this.ensurePermissionAssigned(permissionId);

    this.removeRolePermission(permissionId);

    this.role.setUpdatedAt(removedAt);

    this.addDomainEvent(
      new PermissionRemovedFromRoleEvent(
        this.id.value,
        this.publicId.value,
        permissionId.value,
        removedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // --------------------------------------------------------------------------
  // Private Helpers
  // --------------------------------------------------------------------------

  /**
   * Adds a role-permission assignment to the aggregate.
   */
  private addRolePermission(rolePermission: RolePermissionEntity): void {
    this.props.rolePermissions.push(rolePermission);
  }

  /**
   * Removes a role-permission assignment from the aggregate.
   */
  private removeRolePermission(permissionId: PermissionId): void {
    const index = this.props.rolePermissions.findIndex((rolePermission) =>
      rolePermission.permissionId.equals(permissionId),
    );

    if (index >= 0) {
      this.props.rolePermissions.splice(index, 1);
    }
  }

  /**
   * Finds a role-permission assignment by permission identifier.
   */
  private findRolePermission(
    permissionId: PermissionId,
  ): RolePermissionEntity | undefined {
    return this.props.rolePermissions.find((rolePermission) =>
      rolePermission.permissionId.equals(permissionId),
    );
  }

  /**
   * Returns all permission identifiers assigned to the role.
   */
  private permissionIdentifiers(): readonly PermissionId[] {
    return this.props.rolePermissions.map(
      (rolePermission) => rolePermission.permissionId,
    );
  }

  // --------------------------------------------------------------------------
  // Guards
  // --------------------------------------------------------------------------

  /**
   * Ensures the role is active.
   */
  private ensureActive(): void {
    if (!this.role.isActive) {
      throw new RoleInactiveException();
    }
  }

  /**
   * Ensures the role is a protected system role.
   *
   * Reserved for operations that require a system role.
   */
  private ensureSystemRole(): void {
    if (!this.role.isSystem) {
      throw new SystemRoleModificationNotAllowedException();
    }
  }

  /**
   * Ensures the role is not a protected system role.
   */
  private ensureNotSystemRole(): void {
    if (this.role.isSystem) {
      throw new SystemRoleModificationNotAllowedException();
    }
  }

  /**
   * Ensures the specified permission is already assigned.
   */
  private ensurePermissionAssigned(permissionId: PermissionId): void {
    if (!this.hasPermission(permissionId)) {
      throw new PermissionNotAssignedException(permissionId.value);
    }
  }

  /**
   * Ensures the specified permission is not already assigned.
   */
  private ensurePermissionNotAssigned(permissionId: PermissionId): void {
    if (this.hasPermission(permissionId)) {
      throw new PermissionAlreadyAssignedException(permissionId.value);
    }
  }

  // --------------------------------------------------------------------------
  // Equality
  // --------------------------------------------------------------------------

  override equals(other?: RoleAggregate): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}
