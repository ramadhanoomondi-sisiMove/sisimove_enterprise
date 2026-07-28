// src/domains/authorization/domain/entities/role.entity.ts

import { Entity } from '../../../../foundation/kernel/domain/entity';
import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';
import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

interface RoleProps {
  publicId: PublicEntityId;

  name: string;
  code: string;

  description: string | undefined;
  displayOrder: number;

  isSystem: boolean;
  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export class RoleEntity extends Entity<RoleProps> {
  private constructor(props: RoleProps, id?: UniqueEntityId) {
    super(props, id);
  }

  // --------------------------------------------------------------------------
  // Factory
  // --------------------------------------------------------------------------

  static create(props: RoleProps): RoleEntity {
    return new RoleEntity(props);
  }

  static rehydrate(props: RoleProps, id: UniqueEntityId): RoleEntity {
    return new RoleEntity(props, id);
  }

  // --------------------------------------------------------------------------
  // Identity
  // --------------------------------------------------------------------------

  override get publicId(): PublicEntityId {
    return this.props.publicId;
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

  get description(): string | undefined {
    return this.props.description;
  }

  get displayOrder(): number {
    return this.props.displayOrder;
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
  // Mutators
  // --------------------------------------------------------------------------

  setName(name: string): void {
    this.props.name = name;
  }

  setDescription(description: string | undefined): void {
    this.props.description = description;
  }

  setDisplayOrder(displayOrder: number): void {
    this.props.displayOrder = displayOrder;
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
  // Queries
  // --------------------------------------------------------------------------

  isNamed(name: string): boolean {
    return this.props.name === name;
  }

  hasCode(code: string): boolean {
    return this.props.code === code;
  }

  // --------------------------------------------------------------------------
  // Equality
  // --------------------------------------------------------------------------

  override equals(other?: RoleEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}
