// -----------------------------------------------------------------------------
// Accounting Period — Aggregate Root
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// Responsibilities:
//
// - own the AccountingPeriodEntity;
// - expose Accounting Period identity;
// - expose Accounting Period state;
// - expose period boundaries;
// - delegate period behavior to the entity;
// - coordinate period lifecycle transitions;
// - record domain events for lifecycle transitions;
// - expose aggregate-level domain state.
//
// The aggregate contains no persistence concerns.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
//       OPEN
//        │
//        ▼
//      CLOSED
//
// CLOSED is terminal.
//
// A period is created in OPEN status.
// There is no reopen operation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Accounting — Entity
// -----------------------------------------------------------------------------

import type { AccountingPeriodEntity } from '../entities/accounting-period.entity';

// -----------------------------------------------------------------------------
// Accounting — Events
// -----------------------------------------------------------------------------

import { AccountingPeriodClosedEvent } from '../events/accounting-period-closed.event';

// -----------------------------------------------------------------------------
// Accounting — Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from '../exceptions/accounting.exception';

// -----------------------------------------------------------------------------
// Accounting — Value Objects
// -----------------------------------------------------------------------------

import type { AccountingPeriodName } from '../value-objects/accounting-period-name.vo';
import type { AccountingPeriodPublicId } from '../value-objects/accounting-period-public-id.vo';
import type { AccountingPeriodStatus } from '../value-objects/accounting-period-status.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

interface AccountingPeriodAggregateProps {
  period: AccountingPeriodEntity;
}

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

/**
 * Aggregate root for an Accounting Period.
 *
 * AccountingPeriodEntity is the sole entity owned by this aggregate.
 *
 * The entity remains responsible for enforcing period-level invariants and
 * lifecycle rules. The aggregate coordinates domain behavior and records
 * domain events.
 */
export class AccountingPeriodAggregate extends AggregateRoot<
  AccountingPeriodAggregateProps,
  AccountingPeriodPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: AccountingPeriodAggregateProps) {
    if (props === undefined) {
      throw new AccountingException(
        'Accounting period aggregate properties are required.',
      );
    }

    if (props.period === undefined) {
      throw new AccountingException('Accounting period entity is required.');
    }

    super(props, props.period.id, props.period.publicId);

    this.ensureAggregateConsistency();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates an Accounting Period aggregate from a newly created entity.
   *
   * Creation does not automatically record a domain event.
   *
   * The Accounting Period entity is created in OPEN status.
   */
  public static create(
    period: AccountingPeriodEntity,
  ): AccountingPeriodAggregate {
    return new AccountingPeriodAggregate({
      period,
    });
  }

  /**
   * Rehydrates an Accounting Period aggregate from persistence.
   *
   * Rehydration does not emit domain events.
   */
  public static rehydrate(
    period: AccountingPeriodEntity,
  ): AccountingPeriodAggregate {
    return new AccountingPeriodAggregate({
      period,
    });
  }

  // ===========================================================================
  // Root Entity
  // ===========================================================================

  /**
   * Returns the Accounting Period entity owned by this aggregate.
   */
  public get period(): AccountingPeriodEntity {
    return this.props.period;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Returns the internal Accounting Period identity.
   */
  public override get id(): typeof this.period.id {
    return this.period.id;
  }

  /**
   * Returns the public Accounting Period identity.
   */
  public override get publicId(): typeof this.period.publicId {
    return this.period.publicId;
  }

  // ===========================================================================
  // Name
  // ===========================================================================

  /**
   * Returns the Accounting Period name.
   */
  public get name(): AccountingPeriodName {
    return this.period.name;
  }

  /**
   * Changes the Accounting Period name.
   *
   * Mutation rules remain inside AccountingPeriodEntity.
   */
  public changeName(name: AccountingPeriodName): void {
    this.period.changeName(name);
  }

  // ===========================================================================
  // Period Boundaries
  // ===========================================================================

  /**
   * Returns the Accounting Period start date.
   */
  public get startsAt(): Date {
    return this.period.startsAt;
  }

  /**
   * Returns the Accounting Period end date.
   */
  public get endsAt(): Date {
    return this.period.endsAt;
  }

  /**
   * Changes the Accounting Period boundaries.
   *
   * The entity enforces:
   *
   * startsAt < endsAt
   *
   * and prevents modification after closure.
   */
  public changeDates(startsAt: Date, endsAt: Date): void {
    this.period.changeDates(startsAt, endsAt);
  }

  /**
   * Returns true when the supplied date falls within the period boundaries.
   *
   * The entity validates the supplied date.
   */
  public contains(date: Date): boolean {
    return this.period.contains(date);
  }

  /**
   * Returns true when the period starts before the supplied date.
   */
  public startsBefore(date: Date): boolean {
    return this.period.startsBefore(date);
  }

  /**
   * Returns true when the period ends after the supplied date.
   */
  public endsAfter(date: Date): boolean {
    return this.period.endsAfter(date);
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Returns the current Accounting Period status.
   */
  public get status(): AccountingPeriodStatus {
    return this.period.status;
  }

  /**
   * Returns true when the period is open.
   */
  public isOpen(): boolean {
    return this.period.isOpen();
  }

  /**
   * Returns true when the period is closed.
   */
  public isClosed(): boolean {
    return this.period.isClosed();
  }

  /**
   * Returns true when the period is currently usable.
   */
  public isUsable(): boolean {
    return this.period.isUsable();
  }

  // ===========================================================================
  // Lifecycle Capability
  // ===========================================================================

  /**
   * Returns true when the period can still be modified.
   */
  public canBeModified(): boolean {
    return this.period.canBeModified();
  }

  /**
   * Returns true when the period can be closed.
   */
  public canBeClosed(): boolean {
    return this.period.canBeClosed();
  }

  /**
   * Returns true when the period can accept accounting journals.
   */
  public canAcceptJournals(): boolean {
    return this.period.canAcceptJournals();
  }

  // ===========================================================================
  // Closing
  // ===========================================================================

  /**
   * Closes the Accounting Period and records the corresponding domain event.
   *
   * CLOSED is terminal and cannot be reopened.
   *
   * The entity remains responsible for validating:
   *
   * - the supplied closing timestamp;
   * - current lifecycle status;
   * - closing timestamp against period start;
   * - closing timestamp against creation timestamp.
   */
  public close(
    closedAt: Date = new Date(),
    correlationId: string,
    causationId?: string,
  ): void {
    this.ensureCorrelationId(correlationId);

    this.period.close(closedAt);

    const actualClosedAt = this.period.closedAt;

    if (actualClosedAt === undefined) {
      throw new AccountingException(
        'A closed Accounting Period must have a closing timestamp.',
      );
    }

    this.addDomainEvent(
      new AccountingPeriodClosedEvent(
        this.id.value,
        this.publicId.value,
        this.name.value,
        this.startsAt,
        this.endsAt,
        this.status.value,
        actualClosedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Returns the Accounting Period creation timestamp.
   */
  public get createdAt(): Date {
    return this.period.createdAt;
  }

  /**
   * Returns the Accounting Period last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.period.updatedAt;
  }

  /**
   * Returns the Accounting Period closing timestamp.
   */
  public get closedAt(): Date | undefined {
    return this.period.closedAt;
  }

  /**
   * Synchronizes the persisted update timestamp.
   *
   * This is primarily used during persistence/rehydration workflows.
   */
  public setUpdatedAt(updatedAt: Date): void {
    this.ensureValidDate(updatedAt, 'updatedAt');

    this.period.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Verifies the structural integrity of the aggregate.
   *
   * Detailed business invariants remain owned by AccountingPeriodEntity.
   */
  private ensureAggregateConsistency(): void {
    if (this.props.period === undefined) {
      throw new AccountingException(
        'Accounting period aggregate must contain an AccountingPeriodEntity.',
      );
    }

    if (this.period.id === undefined) {
      throw new AccountingException(
        'Accounting period aggregate must have an internal identity.',
      );
    }

    if (this.period.publicId === undefined) {
      throw new AccountingException(
        'Accounting period aggregate must have a public identity.',
      );
    }

    if (this.period.name === undefined) {
      throw new AccountingException(
        'Accounting period aggregate must have a name.',
      );
    }

    if (this.period.status === undefined) {
      throw new AccountingException(
        'Accounting period aggregate must have a status.',
      );
    }

    this.ensureValidDate(this.period.startsAt, 'startsAt');

    this.ensureValidDate(this.period.endsAt, 'endsAt');

    this.ensureValidDate(this.period.createdAt, 'createdAt');

    this.ensureValidDate(this.period.updatedAt, 'updatedAt');

    if (this.period.endsAt.getTime() <= this.period.startsAt.getTime()) {
      throw new AccountingException(
        'Accounting period end date must be after its start date.',
      );
    }

    if (this.period.updatedAt.getTime() < this.period.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting period updated date cannot be before its creation date.',
      );
    }

    const closedAt = this.period.closedAt;

    if (closedAt !== undefined) {
      this.ensureValidDate(closedAt, 'closedAt');
    }
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Ensures a correlation identifier is present before recording a domain
   * event.
   */
  private ensureCorrelationId(correlationId: string): void {
    if (
      typeof correlationId !== 'string' ||
      correlationId.trim().length === 0
    ) {
      throw new AccountingException(
        'Accounting period domain events require a correlation ID.',
      );
    }
  }

  /**
   * Ensures a supplied date is valid.
   */
  private ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AccountingException(
        `Accounting period ${fieldName} must be a valid date.`,
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingPeriodAggregate;
