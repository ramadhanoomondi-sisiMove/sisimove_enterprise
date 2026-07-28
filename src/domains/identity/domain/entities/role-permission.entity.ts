// src/domains/authorization/domain/entities/role-permission.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { PermissionId } from '../value-objects/permission-id.vo';
import type { RoleId } from '../value-objects/role-id.vo';

interface RolePermissionProps {
  roleId: RoleId;
  permissionId: PermissionId;
  createdAt: Date;
}

export class RolePermissionEntity extends Entity<RolePermissionProps> {
  private constructor(props: RolePermissionProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // --------------------------------------------------------------------------
  // Factory
  // --------------------------------------------------------------------------

  public static create(props: RolePermissionProps): RolePermissionEntity {
    return new RolePermissionEntity(props);
  }

  public static rehydrate(
    props: RolePermissionProps,
    id: UniqueEntityId,
  ): RolePermissionEntity {
    return new RolePermissionEntity(props, id);
  }

  // --------------------------------------------------------------------------
  // Properties
  // --------------------------------------------------------------------------

  get roleId(): RoleId {
    return this.props.roleId;
  }

  get permissionId(): PermissionId {
    return this.props.permissionId;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  // --------------------------------------------------------------------------
  // Queries
  // --------------------------------------------------------------------------

  referencesRole(roleId: RoleId): boolean {
    return this.roleId.equals(roleId);
  }

  referencesPermission(permissionId: PermissionId): boolean {
    return this.permissionId.equals(permissionId);
  }

  // --------------------------------------------------------------------------
  // Equality
  // --------------------------------------------------------------------------

  override equals(other?: RolePermissionEntity): boolean {
    if (other === undefined) {
      return false;
    }

    if (this.id.equals(other.id)) {
      return true;
    }

    return (
      this.roleId.equals(other.roleId) &&
      this.permissionId.equals(other.permissionId)
    );
  }
}
