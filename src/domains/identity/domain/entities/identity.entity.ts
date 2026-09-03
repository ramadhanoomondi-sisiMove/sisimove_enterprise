// -----------------------------------------------------------------------------
// Identity Entity
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// IdentityAggregate
// └── Identity
//     └── IdentityRole
//
// Identity is the aggregate root of the Identity aggregate.
//
// Identity represents a user.
//
// The aggregate owns:
// - the identity lifecycle;
// - role assignments.
//
// Verification is intentionally NOT included here because Verification has
// its own lifecycle and persistence boundary.
//
// Cross-domain references use public identifiers rather than persistence IDs.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { IdentityInvariantException } from '../exceptions/identity-invariant.exception';

import { IdentityInvalidStatusTransitionException } from '../exceptions/identity-invalid-status-transition.exception';

import { IdentityRoleAlreadyAssignedException } from '../exceptions/identity-role-already-assigned.exception';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import {
  IdentityRoleEntity,
  type IdentityRoleProps,
} from './identity-role.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import { IdentityPublicId } from '../value-objects/identity-public-id.vo';

import type { IdentityEmail } from '../value-objects/identity-email.vo';

import type { IdentityPhoneNumber } from '../value-objects/identity-phone-number.vo';

import {
  IdentityStatus,
  type IdentityStatusValue,
} from '../value-objects/identity-status.vo';

import type { IdentityRoleIdentityPublicId } from '../value-objects/identity-role-identity-public-id.vo';

import type { IdentityRoleRolePublicId } from '../value-objects/identity-role-role-public-id.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

export interface IdentityProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: IdentityPublicId;

  email: IdentityEmail;

  phoneNumber: IdentityPhoneNumber;

  status: IdentityStatus;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;

  activatedAt?: Date | undefined;

  suspendedAt?: Date | undefined;

  closedAt?: Date | undefined;

  // ---------------------------------------------------------------------------
  // Authorization
  // ---------------------------------------------------------------------------

  identityRoles: IdentityRoleEntity[];
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

/**
 * Identity aggregate root.
 *
 * Represents a user identity.
 *
 * Owns:
 * - identity lifecycle;
 * - identity role assignments.
 *
 * Does not own:
 * - Verification;
 * - Authentication;
 * - Sessions;
 * - Devices;
 * - Recovery;
 * - OTP challenges.
 *
 * Those concerns have independent lifecycle and persistence boundaries.
 */
export class IdentityEntity extends Entity<IdentityProps, IdentityPublicId> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  private constructor(
    props: IdentityProps,
    id?: UniqueEntityId,
    publicId?: IdentityPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(props: {
    publicId?: IdentityPublicId;

    email: IdentityEmail;

    phoneNumber: IdentityPhoneNumber;

    status?: IdentityStatus;

    createdAt?: Date | undefined;

    updatedAt?: Date | undefined;

    activatedAt?: Date | undefined;

    suspendedAt?: Date | undefined;

    closedAt?: Date | undefined;

    identityRoles?: IdentityRoleEntity[];
  }): IdentityEntity {
    const now = new Date();

    const publicId = props.publicId ?? new IdentityPublicId();

    const status = props.status ?? IdentityStatus.create('PENDING');

    const identityRoles = props.identityRoles ? [...props.identityRoles] : [];

    IdentityEntity.validateLifecycleState({
      status,
      activatedAt: props.activatedAt,
      suspendedAt: props.suspendedAt,
      closedAt: props.closedAt,
    });

    IdentityEntity.validateRoleOwnership(publicId, identityRoles);

    return new IdentityEntity({
      publicId,

      email: props.email,

      phoneNumber: props.phoneNumber,

      status,

      createdAt: IdentityEntity.cloneDate(props.createdAt ?? now),

      updatedAt: IdentityEntity.cloneDate(props.updatedAt ?? now),

      ...(props.activatedAt !== undefined
        ? {
            activatedAt: IdentityEntity.cloneDate(props.activatedAt),
          }
        : {}),

      ...(props.suspendedAt !== undefined
        ? {
            suspendedAt: IdentityEntity.cloneDate(props.suspendedAt),
          }
        : {}),

      ...(props.closedAt !== undefined
        ? {
            closedAt: IdentityEntity.cloneDate(props.closedAt),
          }
        : {}),

      identityRoles,
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Rehydrates an Identity from persistence.
   *
   * Persistence identifiers are authoritative during rehydration.
   */
  public static rehydrate(
    props: IdentityProps,
    id: UniqueEntityId,
    publicId: IdentityPublicId,
  ): IdentityEntity {
    IdentityEntity.validateLifecycleState({
      status: props.status,
      activatedAt: props.activatedAt,
      suspendedAt: props.suspendedAt,
      closedAt: props.closedAt,
    });

    IdentityEntity.validateRoleOwnership(publicId, props.identityRoles);

    return new IdentityEntity(
      {
        ...props,

        publicId,

        createdAt: IdentityEntity.cloneDate(props.createdAt),

        updatedAt: IdentityEntity.cloneDate(props.updatedAt),

        ...(props.activatedAt !== undefined
          ? {
              activatedAt: IdentityEntity.cloneDate(props.activatedAt),
            }
          : {}),

        ...(props.suspendedAt !== undefined
          ? {
              suspendedAt: IdentityEntity.cloneDate(props.suspendedAt),
            }
          : {}),

        ...(props.closedAt !== undefined
          ? {
              closedAt: IdentityEntity.cloneDate(props.closedAt),
            }
          : {}),

        // Defensive copy prevents external mutation of the aggregate
        // collection.
        identityRoles: [...props.identityRoles],
      },
      id,
      publicId,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  public override get publicId(): IdentityPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Email
  // ---------------------------------------------------------------------------

  public get email(): IdentityEmail {
    return this.props.email;
  }

  public changeEmail(email: IdentityEmail): void {
    if (this.props.email.equals(email)) {
      return;
    }

    this.props.email = email;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Phone Number
  // ---------------------------------------------------------------------------

  public get phoneNumber(): IdentityPhoneNumber {
    return this.props.phoneNumber;
  }

  public changePhoneNumber(phoneNumber: IdentityPhoneNumber): void {
    if (this.props.phoneNumber.equals(phoneNumber)) {
      return;
    }

    this.props.phoneNumber = phoneNumber;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public get status(): IdentityStatus {
    return this.props.status;
  }

  /**
   * Changes the Identity lifecycle status.
   *
   * All lifecycle transitions are validated against the domain transition
   * rules before mutation.
   */
  public setStatus(status: IdentityStatus): void {
    if (this.props.status.equals(status)) {
      return;
    }

    const from = this.props.status.value;
    const to = status.value;

    if (!IdentityEntity.isValidStatusTransition(from, to)) {
      throw new IdentityInvalidStatusTransitionException(
        `Invalid identity status transition from ${from} to ${to}.`,
      );
    }

    this.applyStatus(status);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public activate(at: Date = new Date()): void {
    if (this.props.status.isActive()) {
      return;
    }

    if (!this.props.status.canActivate()) {
      throw new IdentityInvalidStatusTransitionException(
        `Identity cannot transition from ${this.props.status.value} to ACTIVE.`,
      );
    }

    this.applyStatus(IdentityStatus.create('ACTIVE'), at);
  }

  public suspend(at: Date = new Date()): void {
    if (this.props.status.isSuspended()) {
      return;
    }

    if (!this.props.status.canSuspend()) {
      throw new IdentityInvalidStatusTransitionException(
        `Identity cannot transition from ${this.props.status.value} to SUSPENDED.`,
      );
    }

    this.applyStatus(IdentityStatus.create('SUSPENDED'), at);
  }

  public close(at: Date = new Date()): void {
    if (this.props.status.isClosed()) {
      return;
    }

    if (!this.props.status.canClose()) {
      throw new IdentityInvalidStatusTransitionException(
        `Identity cannot transition from ${this.props.status.value} to CLOSED.`,
      );
    }

    this.applyStatus(IdentityStatus.create('CLOSED'), at);
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Time at which the Identity became ACTIVE.
   *
   * Returns a defensive copy so callers cannot mutate domain state.
   */
  public get activatedAt(): Date | undefined {
    return this.props.activatedAt !== undefined
      ? IdentityEntity.cloneDate(this.props.activatedAt)
      : undefined;
  }

  /**
   * Time at which the Identity became SUSPENDED.
   *
   * Returns a defensive copy so callers cannot mutate domain state.
   */
  public get suspendedAt(): Date | undefined {
    return this.props.suspendedAt !== undefined
      ? IdentityEntity.cloneDate(this.props.suspendedAt)
      : undefined;
  }

  /**
   * Time at which the Identity became CLOSED.
   *
   * Returns a defensive copy so callers cannot mutate domain state.
   */
  public get closedAt(): Date | undefined {
    return this.props.closedAt !== undefined
      ? IdentityEntity.cloneDate(this.props.closedAt)
      : undefined;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Predicates
  // ---------------------------------------------------------------------------

  public isPending(): boolean {
    return this.props.status.isPending();
  }

  public isActive(): boolean {
    return this.props.status.isActive();
  }

  public isSuspended(): boolean {
    return this.props.status.isSuspended();
  }

  public isClosed(): boolean {
    return this.props.status.isClosed();
  }

  // ---------------------------------------------------------------------------
  // Identity Roles
  // ---------------------------------------------------------------------------

  public get identityRoles(): readonly IdentityRoleEntity[] {
    return [...this.props.identityRoles];
  }

  /**
   * Assigns a role to this Identity.
   */
  public addRole(
    rolePublicId: IdentityRoleRolePublicId,
    assignedByPublicId?: IdentityPublicId,
    expiresAt?: Date,
    assignedAt: Date = new Date(),
  ): IdentityRoleEntity {
    if (this.isClosed()) {
      throw new IdentityInvariantException(
        'A closed identity cannot be assigned a role.',
      );
    }

    const existingRole = this.findActiveRole(rolePublicId, assignedAt);

    if (existingRole !== undefined) {
      throw new IdentityRoleAlreadyAssignedException(
        `Role ${rolePublicId.value} is already assigned to identity ${this.publicId.value}.`,
      );
    }

    IdentityEntity.validateRoleExpiration(expiresAt, assignedAt);

    const identityRole = IdentityRoleEntity.create({
      identityPublicId: IdentityEntity.toIdentityRoleIdentityPublicId(
        this.publicId,
      ),

      rolePublicId,

      ...(assignedByPublicId !== undefined
        ? {
            assignedByPublicId,
          }
        : {}),

      assignedAt,

      ...(expiresAt !== undefined
        ? {
            expiresAt,
          }
        : {}),
    });

    this.props.identityRoles.push(identityRole);

    this.touch(assignedAt);

    return identityRole;
  }

  /**
   * Adds an already-created IdentityRole to the aggregate.
   *
   * Primarily useful during rehydration or domain-level reconstruction.
   */
  public addRoleEntity(identityRole: IdentityRoleEntity): void {
    if (this.isClosed()) {
      throw new IdentityInvariantException(
        'A closed identity cannot be assigned a role.',
      );
    }

    const expectedIdentityPublicId =
      IdentityEntity.toIdentityRoleIdentityPublicId(this.publicId);

    if (!identityRole.identityPublicId.equals(expectedIdentityPublicId)) {
      throw new IdentityInvariantException(
        'The IdentityRole does not belong to this Identity aggregate.',
      );
    }

    const existingRole = this.findActiveRole(identityRole.rolePublicId);

    if (existingRole !== undefined) {
      throw new IdentityRoleAlreadyAssignedException(
        `Role ${identityRole.rolePublicId.value} is already assigned to identity ${this.publicId.value}.`,
      );
    }

    IdentityEntity.validateRoleExpiration(
      identityRole.expiresAt,
      identityRole.assignedAt,
    );

    this.props.identityRoles.push(identityRole);

    this.touch();
  }

  /**
   * Revokes the currently active assignment of a role.
   */
  public revokeRole(
    rolePublicId: IdentityRoleRolePublicId,
    revokedByPublicId?: IdentityPublicId,
    at: Date = new Date(),
  ): void {
    const identityRole = this.findActiveRole(rolePublicId, at);

    if (identityRole === undefined) {
      throw new IdentityInvariantException(
        `Role ${rolePublicId.value} is not currently assigned to identity ${this.publicId.value}.`,
      );
    }

    identityRole.revoke(revokedByPublicId, at);

    this.touch(at);
  }

  /**
   * Determines whether the Identity currently has a role.
   */
  public hasRole(
    rolePublicId: IdentityRoleRolePublicId,
    at: Date = new Date(),
  ): boolean {
    return this.props.identityRoles.some(
      (identityRole) =>
        identityRole.rolePublicId.equals(rolePublicId) &&
        identityRole.isActive(at),
    );
  }

  /**
   * Finds a role regardless of whether it is active, expired, or revoked.
   */
  public findRole(
    rolePublicId: IdentityRoleRolePublicId,
  ): IdentityRoleEntity | undefined {
    return this.props.identityRoles.find((identityRole) =>
      identityRole.rolePublicId.equals(rolePublicId),
    );
  }

  /**
   * Finds the currently active role assignment.
   */
  public findActiveRole(
    rolePublicId: IdentityRoleRolePublicId,
    at: Date = new Date(),
  ): IdentityRoleEntity | undefined {
    return this.props.identityRoles.find(
      (identityRole) =>
        identityRole.rolePublicId.equals(rolePublicId) &&
        identityRole.isActive(at),
    );
  }

  /**
   * Determines whether the Identity has at least one active role.
   */
  public hasAnyActiveRole(at: Date = new Date()): boolean {
    return this.props.identityRoles.some((identityRole) =>
      identityRole.isActive(at),
    );
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return IdentityEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return IdentityEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    this.props.updatedAt = IdentityEntity.cloneDate(updatedAt);
  }

  public override touch(at: Date = new Date()): void {
    this.props.updatedAt = IdentityEntity.cloneDate(at);
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  public override equals(other?: IdentityEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }

  // ---------------------------------------------------------------------------
  // Internal Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Applies an already validated lifecycle status.
   *
   * Historical lifecycle timestamps are retained. For example, suspending an
   * identity does not erase its previous activatedAt timestamp.
   */
  private applyStatus(status: IdentityStatus, at: Date = new Date()): void {
    this.props.status = status;

    switch (status.value) {
      case 'ACTIVE':
        this.props.activatedAt = IdentityEntity.cloneDate(at);
        break;

      case 'SUSPENDED':
        this.props.suspendedAt = IdentityEntity.cloneDate(at);
        break;

      case 'CLOSED':
        this.props.closedAt = IdentityEntity.cloneDate(at);
        break;

      case 'PENDING':
        break;
    }

    this.touch(at);
  }

  // ---------------------------------------------------------------------------
  // Status Transition Rules
  // ---------------------------------------------------------------------------

  private static isValidStatusTransition(
    from: IdentityStatusValue,
    to: IdentityStatusValue,
  ): boolean {
    switch (from) {
      case 'PENDING':
        return to === 'ACTIVE' || to === 'CLOSED';

      case 'ACTIVE':
        return to === 'SUSPENDED' || to === 'CLOSED';

      case 'SUSPENDED':
        return to === 'ACTIVE' || to === 'CLOSED';

      case 'CLOSED':
        return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Invariants
  // ---------------------------------------------------------------------------

  private static validateLifecycleState(props: {
    status: IdentityStatus;

    activatedAt?: Date | undefined;

    suspendedAt?: Date | undefined;

    closedAt?: Date | undefined;
  }): void {
    const { status, activatedAt, suspendedAt, closedAt } = props;

    // -------------------------------------------------------------------------
    // Required timestamps
    // -------------------------------------------------------------------------

    if (status.isActive() && activatedAt === undefined) {
      throw new IdentityInvariantException(
        'An ACTIVE identity must have an activatedAt timestamp.',
      );
    }

    if (status.isSuspended() && suspendedAt === undefined) {
      throw new IdentityInvariantException(
        'A SUSPENDED identity must have a suspendedAt timestamp.',
      );
    }

    if (status.isClosed() && closedAt === undefined) {
      throw new IdentityInvariantException(
        'A CLOSED identity must have a closedAt timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // Pending invariants
    // -------------------------------------------------------------------------

    if (status.isPending()) {
      if (activatedAt !== undefined) {
        throw new IdentityInvariantException(
          'A PENDING identity cannot have an activatedAt timestamp.',
        );
      }

      if (suspendedAt !== undefined) {
        throw new IdentityInvariantException(
          'A PENDING identity cannot have a suspendedAt timestamp.',
        );
      }

      if (closedAt !== undefined) {
        throw new IdentityInvariantException(
          'A PENDING identity cannot have a closedAt timestamp.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Active invariants
    // -------------------------------------------------------------------------

    if (status.isActive()) {
      if (suspendedAt !== undefined) {
        throw new IdentityInvariantException(
          'An ACTIVE identity cannot have a suspendedAt timestamp.',
        );
      }

      if (closedAt !== undefined) {
        throw new IdentityInvariantException(
          'An ACTIVE identity cannot have a closedAt timestamp.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Suspended invariants
    // -------------------------------------------------------------------------

    if (status.isSuspended()) {
      if (activatedAt === undefined) {
        throw new IdentityInvariantException(
          'A SUSPENDED identity must retain its activatedAt timestamp.',
        );
      }

      if (
        suspendedAt !== undefined &&
        suspendedAt.getTime() < activatedAt.getTime()
      ) {
        throw new IdentityInvariantException(
          'Identity suspension cannot occur before activation.',
        );
      }

      if (closedAt !== undefined) {
        throw new IdentityInvariantException(
          'A SUSPENDED identity cannot have a closedAt timestamp.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Closed invariants
    // -------------------------------------------------------------------------

    if (status.isClosed()) {
      if (
        activatedAt !== undefined &&
        closedAt !== undefined &&
        closedAt.getTime() < activatedAt.getTime()
      ) {
        throw new IdentityInvariantException(
          'Identity closure cannot occur before activation.',
        );
      }

      if (
        suspendedAt !== undefined &&
        closedAt !== undefined &&
        closedAt.getTime() < suspendedAt.getTime()
      ) {
        throw new IdentityInvariantException(
          'Identity closure cannot occur before suspension.',
        );
      }
    }

    // -------------------------------------------------------------------------
    // Global chronological invariants
    // -------------------------------------------------------------------------

    if (
      activatedAt !== undefined &&
      suspendedAt !== undefined &&
      suspendedAt.getTime() < activatedAt.getTime()
    ) {
      throw new IdentityInvariantException(
        'Identity suspension cannot occur before activation.',
      );
    }

    if (
      suspendedAt !== undefined &&
      closedAt !== undefined &&
      closedAt.getTime() < suspendedAt.getTime()
    ) {
      throw new IdentityInvariantException(
        'Identity closure cannot occur before suspension.',
      );
    }

    if (
      activatedAt !== undefined &&
      closedAt !== undefined &&
      closedAt.getTime() < activatedAt.getTime()
    ) {
      throw new IdentityInvariantException(
        'Identity closure cannot occur before activation.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Role Invariants
  // ---------------------------------------------------------------------------

  private static validateRoleOwnership(
    publicId: IdentityPublicId,
    identityRoles: readonly IdentityRoleEntity[],
  ): void {
    const expectedIdentityPublicId =
      IdentityEntity.toIdentityRoleIdentityPublicId(publicId);

    const activeRoleKeys = new Set<string>();

    for (const identityRole of identityRoles) {
      // -----------------------------------------------------------------------
      // Ownership
      // -----------------------------------------------------------------------

      if (!identityRole.identityPublicId.equals(expectedIdentityPublicId)) {
        throw new IdentityInvariantException(
          `IdentityRole ${identityRole.publicId.value} does not belong to identity ${publicId.value}.`,
        );
      }

      // -----------------------------------------------------------------------
      // Expiration
      // -----------------------------------------------------------------------

      IdentityEntity.validateRoleExpiration(
        identityRole.expiresAt,
        identityRole.assignedAt,
      );

      // -----------------------------------------------------------------------
      // Revoked assignments do not participate in active-role uniqueness.
      // -----------------------------------------------------------------------

      if (identityRole.isRevoked()) {
        continue;
      }

      const roleKey = identityRole.rolePublicId.value;

      if (activeRoleKeys.has(roleKey)) {
        throw new IdentityRoleAlreadyAssignedException(
          `Identity ${publicId.value} contains duplicate active role ${roleKey}.`,
        );
      }

      activeRoleKeys.add(roleKey);
    }
  }

  // ---------------------------------------------------------------------------
  // Role Expiration Invariants
  // ---------------------------------------------------------------------------

  private static validateRoleExpiration(
    expiresAt: Date | undefined,
    assignedAt: Date,
  ): void {
    if (
      expiresAt !== undefined &&
      expiresAt.getTime() <= assignedAt.getTime()
    ) {
      throw new IdentityInvariantException(
        'An IdentityRole expiration time must be after its assignment time.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Internal Value Object Adapter
  // ---------------------------------------------------------------------------

  /**
   * Converts the Identity aggregate public identifier into the semantic
   * IdentityRole identity-reference type.
   *
   * These are intentionally distinct value-object types even though they
   * represent the same public identity boundary.
   */
  private static toIdentityRoleIdentityPublicId(
    publicId: IdentityPublicId,
  ): IdentityRoleIdentityPublicId {
    return publicId;
  }

  // ---------------------------------------------------------------------------
  // Internal Helpers
  // ---------------------------------------------------------------------------

  private static cloneDate(date: Date): Date {
    return new Date(date.getTime());
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { IdentityRoleProps };
