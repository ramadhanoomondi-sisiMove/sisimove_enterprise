// -----------------------------------------------------------------------------
// Accounting — Account Aggregate
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// Accounting Account is an independent aggregate responsible for the
// lifecycle and classification of exactly one accounting account.
//
// -----------------------------------------------------------------------------
//
// Aggregate responsibilities:
//
// - own exactly one AccountingAccountEntity;
// - expose Accounting Account state through the aggregate boundary;
// - coordinate Accounting Account lifecycle transitions;
// - coordinate Accounting Account hierarchy references;
// - record Accounting Account lifecycle domain events;
// - preserve correlation/causation metadata for domain events;
// - enforce aggregate-level structural consistency;
// - prevent aggregate operations from bypassing AccountingAccountEntity.
//
// -----------------------------------------------------------------------------
//
// This aggregate does NOT:
//
// - access repositories;
// - access Prisma;
// - persist itself;
// - load another Accounting Account aggregate;
// - validate another Accounting Account aggregate;
// - calculate account balances;
// - create journal entries;
// - create journal lines;
// - post journals;
// - reverse journals;
// - validate journal balancing;
// - communicate with external systems;
// - perform authorization checks;
// - perform application orchestration.
//
// Cross-aggregate coordination belongs to the appropriate application
// workflow or domain policy.
//
// Persistence belongs to infrastructure.
//
// Authorization belongs to the application/presentation boundary.
//
// -----------------------------------------------------------------------------
//
// Aggregate identity:
//
// Internal identity:
// - AccountingAccountEntity.id
//
// Public identity:
// - AccountingAccountEntity.publicId
//
// -----------------------------------------------------------------------------
//
// Account hierarchy:
//
// - parentAccountId is an opaque internal UniqueEntityId;
// - the aggregate may assign or remove the parent reference;
// - the aggregate does not load the parent aggregate;
// - the aggregate does not validate the existence of the parent aggregate;
// - self-parenting is rejected by AccountingAccountEntity.
//
// -----------------------------------------------------------------------------
//
// Domain events:
//
// - AccountingAccountCreatedEvent
// - AccountingAccountActivatedEvent
// - AccountingAccountInactivatedEvent
// - AccountingAccountClosedEvent
//
// Creation and creation-event recording are intentionally separate.
//
// The caller is responsible for invoking recordCreated() as part of the
// application command workflow.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
//        ACTIVE
//       /      \
//      ▼        ▼
// INACTIVE    CLOSED
//      │
//      ▼
//   ACTIVE
//
// CLOSED is terminal.
//
// The exact lifecycle invariants are enforced by AccountingAccountEntity.
//
// The aggregate delegates lifecycle state changes to the entity and records
// the corresponding domain event only after the entity transition succeeds.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { AccountingAccountEntity } from '../entities/accounting-account.entity';

// -----------------------------------------------------------------------------
// Domain Events
// -----------------------------------------------------------------------------

import { AccountingAccountCreatedEvent } from '../events/accounting-account-created.event';

import { AccountingAccountActivatedEvent } from '../events/accounting-account-activated.event';

import { AccountingAccountInactivatedEvent } from '../events/accounting-account-inactivated.event';

import { AccountingAccountClosedEvent } from '../events/accounting-account-closed.event';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from '../exceptions/accounting.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AccountingAccountCode } from '../value-objects/accounting-account-code.vo';

import type { AccountingAccountName } from '../value-objects/accounting-account-name.vo';

import type { AccountingAccountType } from '../value-objects/accounting-account-type.vo';

import type { AccountingAccountStatus } from '../value-objects/accounting-account-status.vo';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Props
// =============================================================================

interface AccountingAccountAggregateProps {
  /**
   * Root entity owned by the Accounting Account aggregate.
   */
  account: AccountingAccountEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

/**
 * Accounting Account aggregate root.
 *
 * Owns exactly one AccountingAccountEntity representing one accounting
 * account.
 */
export class AccountingAccountAggregate extends AggregateRoot<AccountingAccountAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: AccountingAccountAggregateProps) {
    if (props === undefined) {
      throw new AccountingException(
        'Accounting Account aggregate properties are required.',
      );
    }

    if (props.account === undefined) {
      throw new AccountingException(
        'Accounting Account aggregate root is required.',
      );
    }

    super(props, props.account.id, props.account.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates a new Accounting Account aggregate around a newly created
   * AccountingAccountEntity.
   *
   * Entity creation and creation-event recording are intentionally separate.
   *
   * The caller is responsible for invoking recordCreated() as part of the
   * application command workflow.
   */
  public static create(
    account: AccountingAccountEntity,
  ): AccountingAccountAggregate {
    AccountingAccountAggregate.ensureEntity(account);

    const aggregate = new AccountingAccountAggregate({
      account,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates a persisted Accounting Account aggregate.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    account: AccountingAccountEntity,
  ): AccountingAccountAggregate {
    AccountingAccountAggregate.ensureEntity(account);

    const aggregate = new AccountingAccountAggregate({
      account,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the Accounting Account aggregate root entity.
   */
  public get account(): AccountingAccountEntity {
    return this.props.account;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal persistence identity of the aggregate.
   */
  public override get id(): typeof this.account.id {
    return this.account.id;
  }

  /**
   * Public identity of the Accounting Account aggregate.
   */
  public override get publicId(): typeof this.account.publicId {
    return this.account.publicId;
  }

  // ===========================================================================
  // Account Code
  // ===========================================================================

  /**
   * Current accounting account code.
   */
  public get code(): AccountingAccountCode {
    return this.account.code;
  }

  /**
   * Changes the accounting account code.
   *
   * Code uniqueness is enforced by the repository/database boundary.
   */
  public changeCode(code: AccountingAccountCode): void {
    this.account.changeCode(code);
  }

  // ===========================================================================
  // Account Name
  // ===========================================================================

  /**
   * Current accounting account name.
   */
  public get name(): AccountingAccountName {
    return this.account.name;
  }

  /**
   * Changes the accounting account name.
   */
  public changeName(name: AccountingAccountName): void {
    this.account.changeName(name);
  }

  // ===========================================================================
  // Account Type
  // ===========================================================================

  /**
   * Current accounting account classification.
   */
  public get type(): AccountingAccountType {
    return this.account.type;
  }

  /**
   * Changes the accounting account classification.
   */
  public changeType(type: AccountingAccountType): void {
    this.account.changeType(type);
  }

  // ===========================================================================
  // Account Hierarchy
  // ===========================================================================

  /**
   * Internal identity of the optional parent Accounting Account.
   *
   * The parent remains outside this aggregate's ownership boundary.
   */
  public get parentAccountId(): UniqueEntityId | undefined {
    return this.account.parentAccountId;
  }

  /**
   * Determines whether this account has a parent account.
   */
  public hasParentAccount(): boolean {
    return this.account.hasParentAccount();
  }

  /**
   * Determines whether this account is a root account.
   *
   * A root account has no parent account.
   */
  public isRootAccount(): boolean {
    return !this.account.hasParentAccount();
  }

  /**
   * Determines whether this account belongs directly to the supplied parent
   * account.
   */
  public belongsToParentAccount(parentAccountId: UniqueEntityId): boolean {
    return this.account.belongsToParentAccount(parentAccountId);
  }

  /**
   * Assigns a parent Accounting Account reference.
   *
   * The parent aggregate is not loaded or validated here.
   */
  public assignParentAccount(parentAccountId: UniqueEntityId): void {
    this.account.assignParentAccount(parentAccountId);
  }

  /**
   * Removes the current parent Accounting Account reference.
   */
  public removeParentAccount(): void {
    this.account.removeParentAccount();
  }

  // ===========================================================================
  // Account Status
  // ===========================================================================

  /**
   * Current Accounting Account lifecycle status.
   */
  public get status(): AccountingAccountStatus {
    return this.account.status;
  }

  /**
   * Determines whether the account is active.
   */
  public isActive(): boolean {
    return this.account.isActive();
  }

  /**
   * Determines whether the account is inactive.
   */
  public isInactive(): boolean {
    return this.account.isInactive();
  }

  /**
   * Determines whether the account is closed.
   */
  public isClosed(): boolean {
    return this.account.isClosed();
  }

  /**
   * Determines whether the account is operationally usable.
   *
   * Only ACTIVE accounts are usable for new accounting activity.
   */
  public isUsable(): boolean {
    return this.account.isUsable();
  }

  /**
   * Determines whether the account may receive new journal postings.
   */
  public canReceivePostings(): boolean {
    return this.account.canReceivePostings();
  }

  /**
   * Determines whether the account may be modified.
   */
  public canBeModified(): boolean {
    return this.account.canBeModified();
  }

  /**
   * Determines whether the account may be activated.
   */
  public canBeActivated(): boolean {
    return this.account.canBeActivated();
  }

  /**
   * Determines whether the account may be inactivated.
   */
  public canBeInactivated(): boolean {
    return this.account.canBeInactivated();
  }

  /**
   * Determines whether the account may be closed.
   */
  public canBeClosed(): boolean {
    return this.account.canBeClosed();
  }

  // ===========================================================================
  // Lifecycle — Activate
  // ===========================================================================

  /**
   * Activates the Accounting Account.
   *
   * Lifecycle:
   *
   * INACTIVE → ACTIVE
   *
   * The entity enforces the actual lifecycle invariant.
   *
   * A successful transition records AccountingAccountActivatedEvent.
   */
  public activate(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.account.activate();

    const activatedAt = this.account.updatedAt;

    this.addDomainEvent(
      new AccountingAccountActivatedEvent(
        this.id.value,
        this.publicId.value,
        this.code.value,
        this.type.value,
        this.status.value,
        activatedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Lifecycle — Inactivate
  // ===========================================================================

  /**
   * Inactivates the Accounting Account.
   *
   * Lifecycle:
   *
   * ACTIVE → INACTIVE
   *
   * A successful transition records AccountingAccountInactivatedEvent.
   */
  public inactivate(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.account.inactivate();

    const inactivatedAt = this.account.updatedAt;

    this.addDomainEvent(
      new AccountingAccountInactivatedEvent(
        this.id.value,
        this.publicId.value,
        this.code.value,
        this.type.value,
        this.status.value,
        inactivatedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Lifecycle — Close
  // ===========================================================================

  /**
   * Closes the Accounting Account.
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
  public close(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.account.close();

    const closedAt = this.account.updatedAt;

    this.addDomainEvent(
      new AccountingAccountClosedEvent(
        this.id.value,
        this.publicId.value,
        this.code.value,
        this.type.value,
        this.status.value,
        closedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Creation Event
  // ===========================================================================

  /**
   * Records creation of the Accounting Account aggregate.
   *
   * Account creation and event recording remain intentionally separate.
   *
   * The aggregate's internal identity is carried by
   * DomainEvent.metadata.aggregateId.
   *
   * Only stable Accounting Account data is exposed in the event payload.
   *
   * Parent-account hierarchy is intentionally excluded because the domain
   * entity stores the parent reference as an internal UniqueEntityId and does
   * not expose a parent public identity.
   */
  public recordCreated(correlationId: string, causationId?: string): void {
    this.ensureCorrelationId(correlationId);

    this.addDomainEvent(
      new AccountingAccountCreatedEvent(
        this.id.value,
        this.publicId.value,
        this.code.value,
        this.name.value,
        this.type.value,
        this.status.value,
        this.account.createdAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Accounting Account creation timestamp.
   *
   * The entity returns a defensive Date copy.
   */
  public get createdAt(): Date {
    return this.account.createdAt;
  }

  /**
   * Accounting Account last-update timestamp.
   *
   * The entity returns a defensive Date copy.
   */
  public get updatedAt(): Date {
    return this.account.updatedAt;
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Updates the aggregate persistence timestamp.
   *
   * This is not a business lifecycle transition and does not emit a domain
   * event.
   */
  public setUpdatedAt(updatedAt: Date): void {
    AccountingAccountAggregate.ensureValidDate(
      updatedAt,
      'Accounting Account update timestamp must be valid.',
    );

    this.account.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Validates structural consistency of the Accounting Account aggregate.
   *
   * Entity-level business invariants remain owned by
   * AccountingAccountEntity.
   *
   * Cross-account validation remains outside this aggregate.
   */
  private ensureAggregateConsistency(): void {
    AccountingAccountAggregate.ensureEntity(this.account);

    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    if (this.account.id === undefined) {
      throw new AccountingException(
        'Accounting Account aggregate internal identity is required.',
      );
    }

    if (this.account.publicId === undefined) {
      throw new AccountingException(
        'Accounting Account aggregate public identity is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Required Domain State
    // -------------------------------------------------------------------------

    if (this.account.code === undefined) {
      throw new AccountingException('Accounting Account code is required.');
    }

    if (this.account.name === undefined) {
      throw new AccountingException('Accounting Account name is required.');
    }

    if (this.account.type === undefined) {
      throw new AccountingException('Accounting Account type is required.');
    }

    if (this.account.status === undefined) {
      throw new AccountingException('Accounting Account status is required.');
    }

    // -------------------------------------------------------------------------
    // Audit State
    // -------------------------------------------------------------------------

    AccountingAccountAggregate.ensureValidDate(
      this.createdAt,
      'Accounting Account creation timestamp must be valid.',
    );

    AccountingAccountAggregate.ensureValidDate(
      this.updatedAt,
      'Accounting Account update timestamp must be valid.',
    );

    if (this.updatedAt.getTime() < this.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting Account updated timestamp cannot be before its creation timestamp.',
      );
    }

    // -------------------------------------------------------------------------
    // Hierarchy
    // -------------------------------------------------------------------------

    if (
      this.account.parentAccountId !== undefined &&
      this.account.parentAccountId.equals(this.account.id)
    ) {
      throw new AccountingException(
        'Accounting Account cannot reference itself as its parent.',
      );
    }
  }

  // ===========================================================================
  // Entity Guard
  // ===========================================================================

  /**
   * Ensures an AccountingAccountEntity exists before it can become the
   * aggregate root.
   */
  private static ensureEntity(
    account: AccountingAccountEntity | undefined,
  ): asserts account is AccountingAccountEntity {
    if (account === undefined) {
      throw new AccountingException('Accounting Account entity is required.');
    }
  }

  // ===========================================================================
  // Correlation Guard
  // ===========================================================================

  /**
   * Ensures a correlation identifier exists before recording a domain event.
   */
  private ensureCorrelationId(correlationId: string): void {
    if (
      typeof correlationId !== 'string' ||
      correlationId.trim().length === 0
    ) {
      throw new AccountingException(
        'Accounting Account operation correlation ID is required.',
      );
    }
  }

  // ===========================================================================
  // Date Guard
  // ===========================================================================

  /**
   * Validates a Date value.
   */
  private static ensureValidDate(value: Date, message: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AccountingException(message);
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingAccountAggregate;
