// -----------------------------------------------------------------------------
// Identity Role Entity
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// IdentityAggregate
// └── Identity
//     └── IdentityRole
//
// IdentityRole is an entity owned by the Identity aggregate. It represents the
// assignment of a Role to an Identity and owns the assignment/revocation
// lifecycle.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { IdentityRoleAlreadyAssignedException } from '../exceptions/identity-role-already-assigned.exception';

import { IdentityRoleRevokedException } from '../exceptions/identity-role-revoked.exception';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { IdentityRolePublicId } from '../value-objects/identity-role-public-id.vo';

import type { IdentityRoleIdentityPublicId } from '../value-objects/identity-role-identity-public-id.vo';

import type { IdentityRoleRolePublicId } from '../value-objects/identity-role-role-public-id.vo';

import type { IdentityPublicId } from '../value-objects/identity-public-id.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

export interface IdentityRoleProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identity of this IdentityRole entity.
   */
  publicId: IdentityRolePublicId;

  /**
   * Public identity of the Identity that owns this role assignment.
   */
  identityPublicId: IdentityRoleIdentityPublicId;

  /**
   * Public identity of the assigned Role.
   */
  rolePublicId: IdentityRoleRolePublicId;

  // ---------------------------------------------------------------------------
  // Assignment
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Identity that performed the assignment.
   *
   * Undefined when the assignment was created by the system or when the
   * assigning identity has subsequently been removed from the audit record.
   */
  assignedByPublicId?: IdentityPublicId | undefined;

  /**
   * Time at which the role was assigned.
   */
  assignedAt: Date;

  /**
   * Optional expiration time for the role assignment.
   */
  expiresAt?: Date | undefined;

  // ---------------------------------------------------------------------------
  // Revocation
  // ---------------------------------------------------------------------------

  /**
   * Time at which the role assignment was revoked.
   */
  revokedAt?: Date | undefined;

  /**
   * Public identity of the Identity that revoked the role assignment.
   */
  revokedByPublicId?: IdentityPublicId | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Represents a role assignment belonging to an Identity.
 *
 * IdentityRole is NOT an aggregate root.
 *
 * The Identity aggregate owns this entity and is responsible for enforcing
 * aggregate-level rules around role assignment and revocation.
 *
 * The entity itself maintains the lifecycle and invariants of an individual
 * role assignment.
 */
export class IdentityRoleEntity extends Entity<
  IdentityRoleProps,
  IdentityRolePublicId
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: IdentityRoleProps,
    id?: UniqueEntityId,
    publicId?: IdentityRolePublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: IdentityRolePublicId;

    identityPublicId: IdentityRoleIdentityPublicId;

    rolePublicId: IdentityRoleRolePublicId;

    assignedByPublicId?: IdentityPublicId | undefined;

    assignedAt?: Date | undefined;

    expiresAt?: Date | undefined;

    revokedAt?: Date | undefined;

    revokedByPublicId?: IdentityPublicId | undefined;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;
  }): IdentityRoleEntity {
    const now = new Date();

    const assignedAt = props.assignedAt ?? now;

    if (
      props.revokedAt !== undefined &&
      props.revokedAt.getTime() < assignedAt.getTime()
    ) {
      throw new IdentityRoleRevokedException(
        'An identity role cannot be revoked before it is assigned.',
      );
    }

    if (
      props.expiresAt !== undefined &&
      props.expiresAt.getTime() <= assignedAt.getTime()
    ) {
      throw new IdentityRoleAlreadyAssignedException(
        'An identity role expiration time must be later than its assignment time.',
      );
    }

    return new IdentityRoleEntity({
      publicId: props.publicId ?? new IdentityRolePublicId(),

      identityPublicId: props.identityPublicId,

      rolePublicId: props.rolePublicId,

      ...(props.assignedByPublicId !== undefined
        ? {
            assignedByPublicId: props.assignedByPublicId,
          }
        : {}),

      assignedAt: IdentityRoleEntity.cloneDate(assignedAt),

      ...(props.expiresAt !== undefined
        ? {
            expiresAt: IdentityRoleEntity.cloneDate(props.expiresAt),
          }
        : {}),

      ...(props.revokedAt !== undefined
        ? {
            revokedAt: IdentityRoleEntity.cloneDate(props.revokedAt),
          }
        : {}),

      ...(props.revokedByPublicId !== undefined
        ? {
            revokedByPublicId: props.revokedByPublicId,
          }
        : {}),

      createdAt: IdentityRoleEntity.cloneDate(props.createdAt ?? now),

      updatedAt: IdentityRoleEntity.cloneDate(props.updatedAt ?? now),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: IdentityRoleProps,
    id: UniqueEntityId,
    publicId: IdentityRolePublicId,
  ): IdentityRoleEntity {
    return new IdentityRoleEntity(
      {
        ...props,

        // Persistence public ID is authoritative during rehydration.
        publicId,

        assignedAt: IdentityRoleEntity.cloneDate(props.assignedAt),

        ...(props.expiresAt !== undefined
          ? {
              expiresAt: IdentityRoleEntity.cloneDate(props.expiresAt),
            }
          : {}),

        ...(props.revokedAt !== undefined
          ? {
              revokedAt: IdentityRoleEntity.cloneDate(props.revokedAt),
            }
          : {}),

        createdAt: IdentityRoleEntity.cloneDate(props.createdAt),

        updatedAt: IdentityRoleEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): IdentityRolePublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Owner Identity
  // ---------------------------------------------------------------------------

  public get identityPublicId(): IdentityRoleIdentityPublicId {
    return this.props.identityPublicId;
  }

  public setIdentityPublicId(
    identityPublicId: IdentityRoleIdentityPublicId,
  ): void {
    this.assertNotRevoked();

    this.props.identityPublicId = identityPublicId;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Role
  // ---------------------------------------------------------------------------

  public get rolePublicId(): IdentityRoleRolePublicId {
    return this.props.rolePublicId;
  }

  public setRolePublicId(rolePublicId: IdentityRoleRolePublicId): void {
    this.assertNotRevoked();

    this.props.rolePublicId = rolePublicId;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Assignment Audit
  // ---------------------------------------------------------------------------

  public get assignedByPublicId(): IdentityPublicId | undefined {
    return this.props.assignedByPublicId;
  }

  public setAssignedByPublicId(assignedByPublicId: IdentityPublicId): void {
    this.assertNotRevoked();

    this.props.assignedByPublicId = assignedByPublicId;

    this.touch();
  }

  public get assignedAt(): Date {
    return IdentityRoleEntity.cloneDate(this.props.assignedAt);
  }

  // ---------------------------------------------------------------------------
  // Expiration
  // ---------------------------------------------------------------------------

  public get expiresAt(): Date | undefined {
    return this.props.expiresAt
      ? IdentityRoleEntity.cloneDate(this.props.expiresAt)
      : undefined;
  }

  public setExpiresAt(expiresAt: Date | undefined): void {
    this.assertNotRevoked();

    if (
      expiresAt !== undefined &&
      expiresAt.getTime() <= this.props.assignedAt.getTime()
    ) {
      throw new IdentityRoleAlreadyAssignedException(
        'An identity role expiration time must be later than its assignment time.',
      );
    }

    this.props.expiresAt =
      expiresAt !== undefined
        ? IdentityRoleEntity.cloneDate(expiresAt)
        : undefined;

    this.touch();
  }

  public hasExpiration(): boolean {
    return this.props.expiresAt !== undefined;
  }

  public isExpired(at: Date = new Date()): boolean {
    return (
      this.props.expiresAt !== undefined &&
      this.props.expiresAt.getTime() <= at.getTime()
    );
  }

  // ---------------------------------------------------------------------------
  // Revocation
  // ---------------------------------------------------------------------------

  public get revokedAt(): Date | undefined {
    return this.props.revokedAt
      ? IdentityRoleEntity.cloneDate(this.props.revokedAt)
      : undefined;
  }

  public get revokedByPublicId(): IdentityPublicId | undefined {
    return this.props.revokedByPublicId;
  }

  public isRevoked(): boolean {
    return this.props.revokedAt !== undefined;
  }

  public revoke(
    revokedByPublicId?: IdentityPublicId,
    at: Date = new Date(),
  ): void {
    if (this.isRevoked()) {
      throw new IdentityRoleRevokedException(
        'The identity role has already been revoked.',
      );
    }

    if (at.getTime() < this.props.assignedAt.getTime()) {
      throw new IdentityRoleRevokedException(
        'An identity role cannot be revoked before it is assigned.',
      );
    }

    this.props.revokedAt = IdentityRoleEntity.cloneDate(at);

    if (revokedByPublicId !== undefined) {
      this.props.revokedByPublicId = revokedByPublicId;
    } else {
      delete this.props.revokedByPublicId;
    }

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Returns true when the role assignment can currently be used.
   *
   * A role is active when:
   * - it has not been revoked; and
   * - it has not expired.
   */
  public isActive(at: Date = new Date()): boolean {
    return !this.isRevoked() && !this.isExpired(at);
  }

  public isInactive(at: Date = new Date()): boolean {
    return !this.isActive(at);
  }

  public isTerminal(at: Date = new Date()): boolean {
    return this.isRevoked() || this.isExpired(at);
  }

  // ---------------------------------------------------------------------------
  // Invariants
  // ---------------------------------------------------------------------------

  /**
   * Prevents modification of a revoked assignment.
   *
   * Revocation is terminal. A new assignment should be created if the same
   * role needs to be granted again.
   */
  private assertNotRevoked(): void {
    if (this.isRevoked()) {
      throw new IdentityRoleRevokedException(
        'A revoked identity role cannot be modified.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return IdentityRoleEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return IdentityRoleEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = IdentityRoleEntity.cloneDate(updatedAt);
  }

  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = IdentityRoleEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: IdentityRoleEntity): boolean {
    if (!other) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}
