// src/domains/authorization/domain/entities/permission.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import type { PermissionId } from '../value-objects/permission-id.vo';

interface PermissionProps {
  publicId: PermissionId;

  name: string;
  code: string;

  resource: string;
  action: string;

  description: string | undefined;

  isSystem: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export class PermissionEntity extends Entity<PermissionProps> {
  private constructor(
    props: PermissionProps,
    id?: UniqueEntityId,
    publicId?: PermissionId,
  ) {
    super(props, id, publicId ?? props.publicId);
  }

  // --------------------------------------------------------------------------
  // Factory
  // --------------------------------------------------------------------------

  static create(props: PermissionProps): PermissionEntity {
    return new PermissionEntity(props);
  }

  static rehydrate(
    props: PermissionProps,
    id: UniqueEntityId,
  ): PermissionEntity {
    return new PermissionEntity(props, id);
  }

  // --------------------------------------------------------------------------
  // Identity
  // --------------------------------------------------------------------------

  override get publicId(): PublicEntityId {
    return this._publicId;
  }

  get permissionId(): PermissionId {
    return this._publicId;
  }

  // --------------------------------------------------------------------------
  // Properties
  // --------------------------------------------------------------------------

  get name(): string {
    return this.props.name;
  }

  get code(): string {
    return this.props.code;
  }

  get resource(): string {
    return this.props.resource;
  }

  get action(): string {
    return this.props.action;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get isSystem(): boolean {
    return this.props.isSystem;
  }

  get isActive(): boolean {
    return this.props.isActive;
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

  referencesResource(resource: string): boolean {
    return this.resource === resource;
  }

  referencesAction(action: string): boolean {
    return this.action === action;
  }

  matches(resource: string, action: string): boolean {
    return this.resource === resource && this.action === action;
  }

  // --------------------------------------------------------------------------
  // Mutators
  // --------------------------------------------------------------------------

  setName(name: string): void {
    this.props.name = name;
  }

  setCode(code: string): void {
    this.props.code = code;
  }

  setDescription(description: string | undefined): void {
    this.props.description = description;
  }

  activate(): void {
    this.props.isActive = true;
  }

  deactivate(): void {
    this.props.isActive = false;
  }

  setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = updatedAt;
  }

  // --------------------------------------------------------------------------
  // Equality
  // --------------------------------------------------------------------------

  override equals(other?: PermissionEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}
