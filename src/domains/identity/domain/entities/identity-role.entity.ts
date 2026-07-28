// src/domains/authorization/domain/entities/identity-role.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { IdentityId } from '../value-objects/identity-id.vo';
import type { RoleId } from '../value-objects/role-id.vo';

interface IdentityRoleProps {
  identityId: IdentityId;
  roleId: RoleId;

  assignedBy: IdentityId | undefined;
  assignedAt: Date;

  expiresAt: Date | undefined;

  revokedAt: Date | undefined;
  revokedBy: IdentityId | undefined;

  createdAt: Date;
  updatedAt: Date;
}

export class IdentityRoleEntity extends Entity<IdentityRoleProps> {
  private constructor(props: IdentityRoleProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // --------------------------------------------------------------------------
  // Factory
  // --------------------------------------------------------------------------

  static create(props: IdentityRoleProps): IdentityRoleEntity {
    return new IdentityRoleEntity(props);
  }

  static rehydrate(
    props: IdentityRoleProps,
    id: UniqueEntityId,
  ): IdentityRoleEntity {
    return new IdentityRoleEntity(props, id);
  }

  // --------------------------------------------------------------------------
  // Properties
  // --------------------------------------------------------------------------

  get identityId(): IdentityId {
    return this.props.identityId;
  }

  get roleId(): RoleId {
    return this.props.roleId;
  }

  get assignedBy(): IdentityId | undefined {
    return this.props.assignedBy;
  }

  get assignedAt(): Date {
    return this.props.assignedAt;
  }

  get expiresAt(): Date | undefined {
    return this.props.expiresAt;
  }

  get revokedAt(): Date | undefined {
    return this.props.revokedAt;
  }

  get revokedBy(): IdentityId | undefined {
    return this.props.revokedBy;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  // --------------------------------------------------------------------------
  // Queries
  // --------------------------------------------------------------------------

  isRevoked(): boolean {
    return this.revokedAt !== undefined;
  }

  isExpired(referenceDate: Date = new Date()): boolean {
    return (
      this.expiresAt !== undefined &&
      this.expiresAt.getTime() <= referenceDate.getTime()
    );
  }

  isActive(referenceDate: Date = new Date()): boolean {
    return !this.isRevoked() && !this.isExpired(referenceDate);
  }

  referencesIdentity(identityId: IdentityId): boolean {
    return this.identityId.equals(identityId);
  }

  referencesRole(roleId: RoleId): boolean {
    return this.roleId.equals(roleId);
  }

  // --------------------------------------------------------------------------
  // Mutators
  // --------------------------------------------------------------------------

  setRevocation(revokedBy: IdentityId, revokedAt: Date): void {
    this.props.revokedBy = revokedBy;
    this.props.revokedAt = revokedAt;
  }

  clearRevocation(): void {
    this.props.revokedBy = undefined;
    this.props.revokedAt = undefined;
  }

  setExpiration(expiresAt: Date | undefined): void {
    this.props.expiresAt = expiresAt;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // --------------------------------------------------------------------------
  // Equality
  // --------------------------------------------------------------------------

  override equals(other?: IdentityRoleEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}
