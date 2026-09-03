// -----------------------------------------------------------------------------
// Identity Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// IdentityEntity is the aggregate root.
//
// The Identity aggregate is the authoritative domain boundary for:
//
// - identity creation;
// - identity contact attributes;
// - identity lifecycle;
// - identity role assignment;
// - identity role revocation;
// - identity-role ownership consistency;
// - identity lifecycle invariants.
//
// Application command handlers must interact with this aggregate and must NOT
// construct or mutate IdentityEntity or IdentityRoleEntity directly.
//
// -----------------------------------------------------------------------------
//
// Separate aggregate / lifecycle boundaries:
//
// - VerificationAggregate;
// - VerificationRequestAggregate;
// - RoleAggregate;
// - PermissionAggregate;
// - RolePermissionAggregate;
// - AuthenticationAggregate;
// - SessionAggregate;
// - DeviceAggregate;
// - RecoveryAggregate;
// - OtpChallengeAggregate.
//
// These concerns are intentionally not owned by IdentityAggregate.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// IdentityRoleEntity references:
//
// - Identity through IdentityRoleIdentityPublicId;
// - Role through IdentityRoleRolePublicId.
//
// These are opaque public identifiers rather than persistence identifiers.
//
// -----------------------------------------------------------------------------
//
// Domain events:
//
// IdentityAggregate may emit:
//
// - IdentityCreatedEvent;
// - IdentityActivatedEvent;
// - IdentitySuspendedEvent;
// - IdentityClosedEvent;
// - IdentityEmailChangedEvent;
// - IdentityPhoneNumberChangedEvent;
// - IdentityRoleAssignedEvent;
// - IdentityRoleRevokedEvent.
//
// Events describe state changes. They do not perform external side effects.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import { IdentityEntity } from '../entities/identity.entity';

import type { IdentityRoleEntity } from '../entities/identity-role.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import {
  IdentityCreatedEvent,
  IdentityActivatedEvent,
  IdentitySuspendedEvent,
  IdentityClosedEvent,
  IdentityEmailChangedEvent,
  IdentityPhoneNumberChangedEvent,
  IdentityRoleAssignedEvent,
  IdentityRoleRevokedEvent,
} from '../events';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { IdentityInvariantException } from '../exceptions/identity-invariant.exception';

import { IdentityInvalidStatusTransitionException } from '../exceptions/identity-invalid-status-transition.exception';

import { IdentityRoleAlreadyAssignedException } from '../exceptions/identity-role-already-assigned.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { IdentityPublicId } from '../value-objects/identity-public-id.vo';

import type { IdentityEmail } from '../value-objects/identity-email.vo';

import type { IdentityPhoneNumber } from '../value-objects/identity-phone-number.vo';

import { IdentityStatus } from '../value-objects/identity-status.vo';

import type { IdentityRoleRolePublicId } from '../value-objects/identity-role-role-public-id.vo';

import type { IdentityPublicId as IdentityActorPublicId } from '../value-objects/identity-public-id.vo';

// -----------------------------------------------------------------------------
// Creation Props
// -----------------------------------------------------------------------------

/**
 * Business inputs required to create an Identity aggregate.
 *
 * Persistence concerns such as:
 *
 * - internal entity identifiers;
 * - timestamps;
 * - public identifier generation;
 * - initial lifecycle state;
 * - initial role collection;
 *
 * remain inside the aggregate boundary.
 */
export interface CreateIdentityAggregateProps {
  /**
   * Identity email address.
   */
  email: IdentityEmail;

  /**
   * Identity phone number.
   */
  phoneNumber: IdentityPhoneNumber;
}

// -----------------------------------------------------------------------------
// Aggregate Props
// -----------------------------------------------------------------------------

interface IdentityAggregateProps {
  identity: IdentityEntity;
}

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

/**
 * Identity aggregate root.
 *
 * Owns:
 *
 * - IdentityEntity;
 * - IdentityRoleEntity collection.
 *
 * The aggregate is responsible for coordinating all mutations that affect
 * identity state or the authorization relationships owned by the identity.
 *
 * Mutation timestamps are determined inside the aggregate.
 */
export class IdentityAggregate extends AggregateRoot<IdentityAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: IdentityAggregateProps) {
    super(props, props.identity.id, props.identity.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a brand-new Identity aggregate.
   *
   * The aggregate creates:
   *
   * - IdentityPublicId;
   * - IdentityEntity;
   * - initial lifecycle state;
   * - initial role collection;
   * - IdentityCreatedEvent.
   *
   * New identities begin in the PENDING state.
   *
   * No roles are assigned during ordinary identity creation.
   */
  public static create(
    props: CreateIdentityAggregateProps,
    correlationId: string,
    causationId?: string,
  ): IdentityAggregate {
    // -------------------------------------------------------------------------
    // Validate creation inputs
    // -------------------------------------------------------------------------

    if (props === undefined || props === null) {
      throw new IdentityInvariantException(
        'Identity creation properties are required.',
      );
    }

    if (props.email === undefined || props.email === null) {
      throw new IdentityInvariantException('Identity email is required.');
    }

    if (props.phoneNumber === undefined || props.phoneNumber === null) {
      throw new IdentityInvariantException(
        'Identity phone number is required.',
      );
    }

    if (
      correlationId === undefined ||
      correlationId === null ||
      correlationId.trim().length === 0
    ) {
      throw new IdentityInvariantException(
        'Identity creation correlation ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Domain timestamp
    // -------------------------------------------------------------------------

    const createdAt = new Date();

    // -------------------------------------------------------------------------
    // Generate aggregate public identity
    // -------------------------------------------------------------------------

    const identityPublicId = new IdentityPublicId();

    // -------------------------------------------------------------------------
    // Initial lifecycle state
    // -------------------------------------------------------------------------

    const status = IdentityStatus.create('PENDING');

    // -------------------------------------------------------------------------
    // Create aggregate root entity
    // -------------------------------------------------------------------------

    const identity = IdentityEntity.create({
      publicId: identityPublicId,
      email: props.email,
      phoneNumber: props.phoneNumber,
      status,
      createdAt,
      updatedAt: createdAt,
      identityRoles: [],
    });

    // -------------------------------------------------------------------------
    // Construct aggregate
    // -------------------------------------------------------------------------

    const aggregate = new IdentityAggregate({
      identity,
    });

    // -------------------------------------------------------------------------
    // Validate aggregate consistency
    // -------------------------------------------------------------------------

    aggregate.ensureAggregateConsistency();

    // -------------------------------------------------------------------------
    // Record creation event
    // -------------------------------------------------------------------------

    aggregate.addDomainEvent(
      new IdentityCreatedEvent(
        aggregate.id.value,
        aggregate.publicId,
        aggregate.status,
        correlationId,
        causationId,
      ),
    );

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates an existing Identity aggregate from persistence.
   *
   * Rehydration never creates domain events.
   */
  public static rehydrate(identity: IdentityEntity): IdentityAggregate {
    if (identity === undefined || identity === null) {
      throw new IdentityInvariantException(
        'Identity aggregate root is required for rehydration.',
      );
    }

    const aggregate = new IdentityAggregate({
      identity,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  public get identity(): IdentityEntity {
    return this.props.identity;
  }

  public get identityRoles(): readonly IdentityRoleEntity[] {
    return this.identity.identityRoles;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  public override get id(): typeof this.identity.id {
    return this.identity.id;
  }

  public override get publicId(): typeof this.identity.publicId {
    return this.identity.publicId;
  }

  // ===========================================================================
  // Identity Properties
  // ===========================================================================

  public get email(): IdentityEmail {
    return this.identity.email;
  }

  public get phoneNumber(): IdentityPhoneNumber {
    return this.identity.phoneNumber;
  }

  public get status(): IdentityStatus {
    return this.identity.status;
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  public get createdAt(): Date {
    return this.identity.createdAt;
  }

  public get updatedAt(): Date {
    return this.identity.updatedAt;
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public isPending(): boolean {
    return this.identity.isPending();
  }

  public isActive(): boolean {
    return this.identity.isActive();
  }

  public isSuspended(): boolean {
    return this.identity.isSuspended();
  }

  public isClosed(): boolean {
    return this.identity.isClosed();
  }

  public isTerminal(): boolean {
    return this.identity.isClosed();
  }

  // ===========================================================================
  // Identity Lifecycle
  // ===========================================================================

  public activate(): void {
    if (this.isActive()) {
      throw new IdentityInvalidStatusTransitionException(
        'An active identity cannot be activated.',
      );
    }

    if (this.isClosed()) {
      throw new IdentityInvalidStatusTransitionException(
        'A closed identity cannot be activated.',
      );
    }

    const activatedAt = new Date();

    this.identity.activate(activatedAt);

    this.addDomainEvent(
      new IdentityActivatedEvent(this.id.value, this.publicId, activatedAt),
    );
  }

  public suspend(correlationId: string): void {
    this.ensureCorrelationId(correlationId);

    if (this.isClosed()) {
      throw new IdentityInvalidStatusTransitionException(
        'A closed identity cannot be suspended.',
      );
    }

    if (this.isSuspended()) {
      return;
    }

    const suspendedAt = new Date();

    this.identity.suspend(suspendedAt);

    this.addDomainEvent(
      new IdentitySuspendedEvent(
        this.id.value,
        this.publicId,
        suspendedAt,
        correlationId,
      ),
    );
  }

  public close(correlationId: string): void {
    this.ensureCorrelationId(correlationId);

    if (this.isClosed()) {
      return;
    }

    const closedAt = new Date();

    this.identity.close(closedAt);

    this.addDomainEvent(
      new IdentityClosedEvent(
        this.id.value,
        this.publicId,
        closedAt,
        correlationId,
      ),
    );
  }

  // ===========================================================================
  // Contact Attributes
  // ===========================================================================

  public changeEmail(email: IdentityEmail, correlationId: string): void {
    this.ensureCorrelationId(correlationId);

    if (email === undefined || email === null) {
      throw new IdentityInvariantException('Identity email is required.');
    }

    if (this.isClosed()) {
      throw new IdentityInvariantException(
        'A closed identity cannot change its email address.',
      );
    }

    if (this.email.equals(email)) {
      return;
    }

    const changedAt = new Date();

    this.identity.changeEmail(email);

    this.addDomainEvent(
      new IdentityEmailChangedEvent(
        this.id.value,
        this.publicId,
        email.toString(),
        changedAt,
        correlationId,
      ),
    );
  }

  public changePhoneNumber(
    phoneNumber: IdentityPhoneNumber,
    correlationId: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    if (phoneNumber === undefined || phoneNumber === null) {
      throw new IdentityInvariantException(
        'Identity phone number is required.',
      );
    }

    if (this.isClosed()) {
      throw new IdentityInvariantException(
        'A closed identity cannot change its phone number.',
      );
    }

    if (this.phoneNumber.equals(phoneNumber)) {
      return;
    }

    const changedAt = new Date();

    this.identity.changePhoneNumber(phoneNumber);

    this.addDomainEvent(
      new IdentityPhoneNumberChangedEvent(
        this.id.value,
        this.publicId,
        phoneNumber.toString(),
        changedAt,
        correlationId,
      ),
    );
  }

  // ===========================================================================
  // Role Queries
  // ===========================================================================

  public hasRole(
    rolePublicId: IdentityRoleRolePublicId,
    at: Date = new Date(),
  ): boolean {
    if (rolePublicId === undefined || rolePublicId === null) {
      throw new IdentityInvariantException('Role public ID is required.');
    }

    return this.identity.hasRole(rolePublicId, at);
  }

  public findRole(
    rolePublicId: IdentityRoleRolePublicId,
  ): IdentityRoleEntity | undefined {
    if (rolePublicId === undefined || rolePublicId === null) {
      throw new IdentityInvariantException('Role public ID is required.');
    }

    return this.identity.findRole(rolePublicId);
  }

  public findActiveRole(
    rolePublicId: IdentityRoleRolePublicId,
    at: Date = new Date(),
  ): IdentityRoleEntity | undefined {
    if (rolePublicId === undefined || rolePublicId === null) {
      throw new IdentityInvariantException('Role public ID is required.');
    }

    return this.identity.findActiveRole(rolePublicId, at);
  }

  public hasAnyActiveRole(at: Date = new Date()): boolean {
    return this.identity.hasAnyActiveRole(at);
  }

  // ===========================================================================
  // Role Assignment
  // ===========================================================================

  public assignRole(
    rolePublicId: IdentityRoleRolePublicId,
    correlationId: string,
    assignedByPublicId?: IdentityActorPublicId,
    expiresAt?: Date,
  ): IdentityRoleEntity {
    this.ensureCorrelationId(correlationId);

    if (rolePublicId === undefined || rolePublicId === null) {
      throw new IdentityInvariantException('Role public ID is required.');
    }

    if (this.isClosed()) {
      throw new IdentityInvariantException(
        'A closed identity cannot be assigned a role.',
      );
    }

    const assignedAt = new Date();

    const existingRole = this.findActiveRole(rolePublicId, assignedAt);

    if (existingRole !== undefined) {
      throw new IdentityRoleAlreadyAssignedException(
        `Role ${rolePublicId.value} is already assigned to identity ${this.publicId.value}.`,
      );
    }

    const identityRole = this.identity.addRole(
      rolePublicId,
      assignedByPublicId,
      expiresAt,
      assignedAt,
    );

    this.addDomainEvent(
      new IdentityRoleAssignedEvent(
        this.id.value,
        identityRole.publicId,
        this.publicId,
        identityRole.rolePublicId,
        identityRole.assignedAt,
        identityRole.assignedByPublicId,
        identityRole.expiresAt,
        correlationId,
      ),
    );

    return identityRole;
  }

  // ===========================================================================
  // Role Rehydration / Reconstruction
  // ===========================================================================

  public addRoleEntity(identityRole: IdentityRoleEntity): void {
    if (identityRole === undefined || identityRole === null) {
      throw new IdentityInvariantException('Identity role entity is required.');
    }

    if (this.isClosed()) {
      throw new IdentityInvariantException(
        'A closed identity cannot be assigned a role.',
      );
    }

    this.identity.addRoleEntity(identityRole);
  }

  // ===========================================================================
  // Role Revocation
  // ===========================================================================

  public revokeRole(
    rolePublicId: IdentityRoleRolePublicId,
    correlationId: string,
    revokedByPublicId?: IdentityActorPublicId,
    reason?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    if (rolePublicId === undefined || rolePublicId === null) {
      throw new IdentityInvariantException('Role public ID is required.');
    }

    const revokedAt = new Date();

    const identityRole = this.findActiveRole(rolePublicId, revokedAt);

    if (identityRole === undefined) {
      throw new IdentityInvariantException(
        `Role ${rolePublicId.value} is not currently assigned to identity ${this.publicId.value}.`,
      );
    }

    this.identity.revokeRole(rolePublicId, revokedByPublicId, revokedAt);

    this.addDomainEvent(
      new IdentityRoleRevokedEvent(
        this.id.value,
        identityRole.publicId,
        this.publicId,
        identityRole.rolePublicId,
        identityRole.revokedAt ?? revokedAt,
        identityRole.revokedByPublicId,
        reason,
        correlationId,
      ),
    );
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  private ensureAggregateConsistency(): void {
    if (this.identity === undefined || this.identity === null) {
      throw new IdentityInvariantException(
        'Identity aggregate root is required.',
      );
    }

    if (this.identity.publicId === undefined) {
      throw new IdentityInvariantException(
        'Identity aggregate public identity is required.',
      );
    }

    if (this.identity.identityRoles === undefined) {
      throw new IdentityInvariantException(
        'Identity role collection is required.',
      );
    }

    const identityPublicId = this.publicId;

    const activeRoleKeys = new Set<string>();

    for (const identityRole of this.identity.identityRoles) {
      if (identityRole === undefined || identityRole === null) {
        throw new IdentityInvariantException(
          'Identity role collection cannot contain an empty role entity.',
        );
      }

      if (!identityRole.identityPublicId.equals(identityPublicId)) {
        throw new IdentityInvariantException(
          `IdentityRole ${identityRole.publicId.value} does not belong to identity ${identityPublicId.value}.`,
        );
      }

      if (!identityRole.isRevoked()) {
        const roleKey = identityRole.rolePublicId.value;

        if (activeRoleKeys.has(roleKey)) {
          throw new IdentityRoleAlreadyAssignedException(
            `Identity ${identityPublicId.value} contains duplicate active role ${roleKey}.`,
          );
        }

        activeRoleKeys.add(roleKey);
      }
    }
  }

  // ===========================================================================
  // Guards
  // ===========================================================================

  private ensureCorrelationId(correlationId: string): void {
    if (
      correlationId === undefined ||
      correlationId === null ||
      correlationId.trim().length === 0
    ) {
      throw new IdentityInvariantException(
        'Identity domain operation correlation ID is required.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Exported Types
// -----------------------------------------------------------------------------

export type { IdentityAggregateProps };
