// -----------------------------------------------------------------------------
// Accounting Account — Entity
// -----------------------------------------------------------------------------
//
// Represents the Accounting Account entity within the Accounting domain.
//
// Aggregate context:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// The Accounting Account entity is the authoritative owner of:
//
// - Accounting Account identity;
// - Accounting Account public identity;
// - account code;
// - account name;
// - account type;
// - account lifecycle status;
// - optional parent-account relationship;
// - creation timestamp;
// - update timestamp.
//
// Cross-account hierarchy references remain internal to the Accounting
// aggregate model and are represented by the opaque internal UniqueEntityId.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain Accounting Account identity;
// - maintain Accounting Account public identity;
// - maintain account code;
// - maintain account name;
// - maintain account type;
// - maintain account lifecycle status;
// - maintain optional parent-account reference;
// - manage account lifecycle;
// - manage account classification;
// - manage account metadata;
// - enforce account-level invariants;
// - provide lifecycle-safe predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - create journal entries;
// - create journal lines;
// - post journals;
// - reverse journals;
// - calculate account balances;
// - access Prisma;
// - persist itself;
// - access repositories;
// - communicate with external systems;
// - perform authorization checks;
// - validate accounting periods;
// - validate journal balancing.
//
// Journal posting belongs to AccountingJournalAggregate.
//
// Persistence belongs to infrastructure.
//
// Application workflow orchestration belongs to the application layer.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
//       ACTIVE
//       /   \
//      /     \
//     ▼       ▼
// INACTIVE  CLOSED
//     │
//     └────────► ACTIVE
//
// CLOSED is terminal.
//
// An INACTIVE account may be reactivated.
//
// A CLOSED account cannot be reactivated or otherwise modified.
//
// -----------------------------------------------------------------------------
//
// Account hierarchy:
//
// parentAccountId is optional because the persistence model permits an account
// without a parent.
//
// The entity stores only the opaque internal identity of the parent account.
// It does not load or mutate the parent AccountingAccount entity.
//
// A parent account cannot be the account itself.
//
// -----------------------------------------------------------------------------
//
// Journal history:
//
// Closing an account does not invalidate existing journal lines referencing
// that account. Historical accounting records remain immutable through the
// journal aggregate.
//
// A closed account therefore remains a valid historical accounting reference,
// while no longer being available for new operational use.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from '../exceptions/accounting.exception';

import { AccountingAccountClosedException } from '../exceptions/accounting-account-closed.exception';

import { AccountingAccountInvalidStatusException } from '../exceptions/accounting-account-invalid-status.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { AccountingAccountPublicId } from '../value-objects/accounting-account-public-id.vo';

import type { AccountingAccountCode } from '../value-objects/accounting-account-code.vo';

import type { AccountingAccountName } from '../value-objects/accounting-account-name.vo';

import type { AccountingAccountType } from '../value-objects/accounting-account-type.vo';

import { AccountingAccountStatus } from '../value-objects/accounting-account-status.vo';

// =============================================================================
// Props
// =============================================================================

export interface AccountingAccountProps {
  /**
   * Unique accounting code of the account.
   */
  code: AccountingAccountCode;

  /**
   * Human-readable accounting account name.
   */
  name: AccountingAccountName;

  /**
   * Classification of the accounting account.
   */
  type: AccountingAccountType;

  /**
   * Accounting account lifecycle status.
   */
  status: AccountingAccountStatus;

  /**
   * Optional parent Accounting Account internal identity.
   *
   * This represents the account hierarchy relation.
   *
   * The referenced account remains outside this entity's ownership boundary.
   */
  parentAccountId: UniqueEntityId | undefined;

  /**
   * Accounting Account creation timestamp.
   */
  createdAt: Date;

  /**
   * Accounting Account last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class AccountingAccountEntity extends Entity<
  AccountingAccountProps,
  AccountingAccountPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    props: AccountingAccountProps,
    id?: UniqueEntityId,
    publicId?: AccountingAccountPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Accounting Account entity.
   *
   * Newly created accounts begin in ACTIVE state.
   */
  public static create(
    code: AccountingAccountCode,
    name: AccountingAccountName,
    type: AccountingAccountType,
    parentAccountId: UniqueEntityId | undefined = undefined,
    createdAt: Date = new Date(),
  ): AccountingAccountEntity {
    AccountingAccountEntity.ensureCode(code);

    AccountingAccountEntity.ensureName(name);

    AccountingAccountEntity.ensureType(type);

    AccountingAccountEntity.ensureParentAccountId(parentAccountId);

    AccountingAccountEntity.ensureValidDate(createdAt, 'creation date');

    const timestamp = AccountingAccountEntity.cloneDate(createdAt);

    const entity = new AccountingAccountEntity(
      {
        code,

        name,

        type,

        status: AccountingAccountStatus.active(),

        parentAccountId,

        createdAt: timestamp,

        updatedAt: AccountingAccountEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new AccountingAccountPublicId(),
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Accounting Account entity.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    props: AccountingAccountProps,
    id: UniqueEntityId,
    publicId: AccountingAccountPublicId,
  ): AccountingAccountEntity {
    if (props === undefined) {
      throw new AccountingException(
        'Accounting account properties are required for rehydration.',
      );
    }

    if (id === undefined) {
      throw new AccountingException(
        'Accounting account internal identity is required for rehydration.',
      );
    }

    if (publicId === undefined) {
      throw new AccountingException(
        'Accounting account public identity is required for rehydration.',
      );
    }

    AccountingAccountEntity.ensureCode(props.code);

    AccountingAccountEntity.ensureName(props.name);

    AccountingAccountEntity.ensureType(props.type);

    AccountingAccountEntity.ensureStatus(props.status);

    AccountingAccountEntity.ensureParentAccountId(props.parentAccountId);

    AccountingAccountEntity.ensureValidDate(props.createdAt, 'creation date');

    AccountingAccountEntity.ensureValidDate(props.updatedAt, 'updated date');

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting account updated date cannot be before creation date.',
      );
    }

    if (
      props.parentAccountId !== undefined &&
      props.parentAccountId.equals(id)
    ) {
      throw new AccountingException(
        'Accounting account cannot be its own parent.',
      );
    }

    const entity = new AccountingAccountEntity(
      {
        code: props.code,

        name: props.name,

        type: props.type,

        status: props.status,

        parentAccountId: props.parentAccountId,

        createdAt: AccountingAccountEntity.cloneDate(props.createdAt),

        updatedAt: AccountingAccountEntity.cloneDate(props.updatedAt),
      },

      id,

      publicId,
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Accounting Account.
   */
  public override get publicId(): AccountingAccountPublicId {
    return super.publicId;
  }

  /**
   * Internal identity of the Accounting Account.
   */
  public override get id(): UniqueEntityId {
    return super.id;
  }

  // ===========================================================================
  // Account Code
  // ===========================================================================

  /**
   * Current accounting account code.
   */
  public get code(): AccountingAccountCode {
    return this.props.code;
  }

  /**
   * Changes the accounting account code.
   *
   * Uniqueness is enforced by the repository/database boundary.
   * The entity only validates the value itself.
   */
  public changeCode(code: AccountingAccountCode): void {
    AccountingAccountEntity.ensureCode(code);

    this.ensureMutable();

    if (this.props.code.equals(code)) {
      return;
    }

    this.props.code = code;

    this.touch();
  }

  // ===========================================================================
  // Account Name
  // ===========================================================================

  /**
   * Current accounting account name.
   */
  public get name(): AccountingAccountName {
    return this.props.name;
  }

  /**
   * Changes the accounting account name.
   */
  public changeName(name: AccountingAccountName): void {
    AccountingAccountEntity.ensureName(name);

    this.ensureMutable();

    if (this.props.name.equals(name)) {
      return;
    }

    this.props.name = name;

    this.touch();
  }

  // ===========================================================================
  // Account Type
  // ===========================================================================

  /**
   * Current accounting account type.
   */
  public get type(): AccountingAccountType {
    return this.props.type;
  }

  /**
   * Changes the accounting account classification.
   */
  public changeType(type: AccountingAccountType): void {
    AccountingAccountEntity.ensureType(type);

    this.ensureMutable();

    if (this.props.type.equals(type)) {
      return;
    }

    this.props.type = type;

    this.touch();
  }

  // ===========================================================================
  // Account Hierarchy
  // ===========================================================================

  /**
   * Internal identity of the optional parent Accounting Account.
   */
  public get parentAccountId(): UniqueEntityId | undefined {
    return this.props.parentAccountId;
  }

  /**
   * Determines whether this account has a parent account.
   */
  public hasParentAccount(): boolean {
    return this.props.parentAccountId !== undefined;
  }

  /**
   * Determines whether this account is a child of the supplied account.
   */
  public belongsToParentAccount(parentAccountId: UniqueEntityId): boolean {
    if (parentAccountId === undefined) {
      return false;
    }

    if (this.props.parentAccountId === undefined) {
      return false;
    }

    return this.props.parentAccountId.equals(parentAccountId);
  }

  /**
   * Assigns a parent Accounting Account.
   *
   * The referenced account is not loaded or validated here.
   * Cross-entity hierarchy validation belongs to the appropriate application
   * workflow/domain policy.
   */
  public assignParentAccount(parentAccountId: UniqueEntityId): void {
    AccountingAccountEntity.ensureParentAccountId(parentAccountId);

    this.ensureMutable();

    if (parentAccountId.equals(this.id)) {
      throw new AccountingException(
        'Accounting account cannot be its own parent.',
      );
    }

    if (
      this.props.parentAccountId !== undefined &&
      this.props.parentAccountId.equals(parentAccountId)
    ) {
      return;
    }

    this.props.parentAccountId = parentAccountId;

    this.touch();
  }

  /**
   * Removes the current parent account.
   */
  public removeParentAccount(): void {
    this.ensureMutable();

    if (this.props.parentAccountId === undefined) {
      return;
    }

    this.props.parentAccountId = undefined;

    this.touch();
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Accounting Account lifecycle status.
   */
  public get status(): AccountingAccountStatus {
    return this.props.status;
  }

  /**
   * Determines whether the account is active.
   */
  public isActive(): boolean {
    return this.props.status.isActive();
  }

  /**
   * Determines whether the account is inactive.
   */
  public isInactive(): boolean {
    return this.props.status.isInactive();
  }

  /**
   * Determines whether the account is closed.
   */
  public isClosed(): boolean {
    return this.props.status.isClosed();
  }

  /**
   * Determines whether the account can be used for new accounting activity.
   *
   * Only ACTIVE accounts are operationally usable.
   */
  public isUsable(): boolean {
    return this.props.status.isActive();
  }

  // ===========================================================================
  // Lifecycle — Activate
  // ===========================================================================

  /**
   * Activates an inactive Accounting Account.
   *
   * Lifecycle:
   *
   * INACTIVE → ACTIVE
   */
  public activate(): void {
    if (this.isClosed()) {
      throw new AccountingAccountClosedException(
        'A closed accounting account cannot be activated.',
      );
    }

    if (this.isActive()) {
      return;
    }

    if (!this.isInactive()) {
      throw new AccountingAccountInvalidStatusException(
        'Only an inactive accounting account can be activated.',
      );
    }

    this.props.status = AccountingAccountStatus.active();

    this.touch();
  }

  // ===========================================================================
  // Lifecycle — Inactivate
  // ===========================================================================

  /**
   * Inactivates an active Accounting Account.
   *
   * Lifecycle:
   *
   * ACTIVE → INACTIVE
   */
  public inactivate(): void {
    if (this.isClosed()) {
      throw new AccountingAccountClosedException(
        'A closed accounting account cannot be inactivated.',
      );
    }

    if (this.isInactive()) {
      return;
    }

    if (!this.isActive()) {
      throw new AccountingAccountInvalidStatusException(
        'Only an active accounting account can be inactivated.',
      );
    }

    this.props.status = AccountingAccountStatus.inactive();

    this.touch();
  }

  // ===========================================================================
  // Lifecycle — Close
  // ===========================================================================

  /**
   * Permanently closes the Accounting Account.
   *
   * Lifecycle:
   *
   * ACTIVE   → CLOSED
   * INACTIVE → CLOSED
   *
   * CLOSED is terminal.
   *
   * Closing the account does not modify historical journal lines.
   */
  public close(): void {
    if (this.isClosed()) {
      throw new AccountingAccountClosedException(
        'Accounting account is already closed.',
      );
    }

    if (!this.isActive() && !this.isInactive()) {
      throw new AccountingAccountInvalidStatusException(
        'Accounting account cannot be closed from its current status.',
      );
    }

    this.props.status = AccountingAccountStatus.closed();

    this.touch();
  }

  // ===========================================================================
  // Lifecycle Predicates
  // ===========================================================================

  /**
   * Determines whether the account may be modified.
   *
   * CLOSED accounts are terminal and cannot be modified.
   */
  public canBeModified(): boolean {
    return !this.isClosed();
  }

  /**
   * Determines whether the account may receive new journal postings.
   */
  public canReceivePostings(): boolean {
    return this.isActive();
  }

  /**
   * Determines whether the account may be activated.
   */
  public canBeActivated(): boolean {
    return this.isInactive();
  }

  /**
   * Determines whether the account may be inactivated.
   */
  public canBeInactivated(): boolean {
    return this.isActive();
  }

  /**
   * Determines whether the account may be closed.
   */
  public canBeClosed(): boolean {
    return this.isActive() || this.isInactive();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Accounting Account creation timestamp.
   *
   * Returns a defensive copy.
   */
  public get createdAt(): Date {
    return AccountingAccountEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Accounting Account last-update timestamp.
   *
   * Returns a defensive copy.
   */
  public get updatedAt(): Date {
    return AccountingAccountEntity.cloneDate(this.props.updatedAt);
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the persistence timestamp.
   *
   * This is not a business lifecycle transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    AccountingAccountEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = AccountingAccountEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting account updated date cannot be before creation date.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Invariants
  // ===========================================================================

  /**
   * Validates all Accounting Account entity-level invariants.
   */
  private validateInvariants(): void {
    AccountingAccountEntity.ensureCode(this.props.code);

    AccountingAccountEntity.ensureName(this.props.name);

    AccountingAccountEntity.ensureType(this.props.type);

    AccountingAccountEntity.ensureStatus(this.props.status);

    AccountingAccountEntity.ensureParentAccountId(this.props.parentAccountId);

    AccountingAccountEntity.ensureValidDate(
      this.props.createdAt,
      'creation date',
    );

    AccountingAccountEntity.ensureValidDate(
      this.props.updatedAt,
      'updated date',
    );

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting account updated date cannot be before creation date.',
      );
    }

    if (
      this.props.parentAccountId !== undefined &&
      this.props.parentAccountId.equals(this.id)
    ) {
      throw new AccountingException(
        'Accounting account cannot be its own parent.',
      );
    }
  }

  // ===========================================================================
  // Mutable State Guard
  // ===========================================================================

  /**
   * Ensures the Accounting Account can still be modified.
   *
   * CLOSED accounts are terminal.
   */
  private ensureMutable(): void {
    if (this.isClosed()) {
      throw new AccountingAccountClosedException(
        'A closed accounting account cannot be modified.',
      );
    }
  }

  // ===========================================================================
  // Value Object Guards
  // ===========================================================================

  private static ensureCode(code: AccountingAccountCode): void {
    if (code === undefined) {
      throw new AccountingException('Accounting account code is required.');
    }
  }

  private static ensureName(name: AccountingAccountName): void {
    if (name === undefined) {
      throw new AccountingException('Accounting account name is required.');
    }
  }

  private static ensureType(type: AccountingAccountType): void {
    if (type === undefined) {
      throw new AccountingException('Accounting account type is required.');
    }
  }

  private static ensureStatus(status: AccountingAccountStatus): void {
    if (status === undefined) {
      throw new AccountingException('Accounting account status is required.');
    }
  }

  // ===========================================================================
  // Parent Account Guards
  // ===========================================================================

  private static ensureParentAccountId(
    parentAccountId: UniqueEntityId | undefined,
  ): void {
    if (parentAccountId === undefined) {
      return;
    }

    if (!(parentAccountId instanceof UniqueEntityId)) {
      throw new AccountingException(
        'Accounting account parent identity must be a valid internal entity identity.',
      );
    }
  }

  // ===========================================================================
  // Date Guards
  // ===========================================================================

  /**
   * Validates a Date.
   */
  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AccountingException(
        `Accounting account ${fieldName} must be a valid date.`,
      );
    }
  }

  // ===========================================================================
  // Date Clone
  // ===========================================================================

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    AccountingAccountEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
