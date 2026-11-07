// -----------------------------------------------------------------------------
// Accounting Calendar — Aggregate Root
// -----------------------------------------------------------------------------
//
// Aggregate:
//
// AccountingCalendarAggregate
// └── AccountingCalendarEntity
//
// Responsibilities:
//
// - own exactly one AccountingCalendarEntity;
// - expose Accounting Calendar identity and configuration;
// - expose Accounting Calendar lifecycle state;
// - coordinate lifecycle operations;
// - enforce aggregate-level structural consistency.
//
// The aggregate contains no persistence concerns.
// Calendar configuration remains immutable after creation.
// Period generation belongs to the application provisioning workflow.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { AccountingCalendarEntity } from '../entities/accounting-calendar.entity';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from '../exceptions/accounting.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AccountingCalendarPublicId } from '../value-objects/accounting-calendar-public-id.vo';
import type { AccountingCalendarCode } from '../value-objects/accounting-calendar-code.vo';
import type { AccountingCalendarName } from '../value-objects/accounting-calendar-name.vo';
import type { AccountingCalendarTimezone } from '../value-objects/accounting-calendar-timezone.vo';
import type { AccountingCalendarFiscalYearStartMonth } from '../value-objects/accounting-calendar-fiscal-year-start-month.vo';
import type { AccountingCalendarStatus } from '../value-objects/accounting-calendar-status.vo';
import type { AccountingPeriodFrequency } from '../value-objects/accounting-period-frequency.vo';

// =============================================================================
// Props
// =============================================================================

interface AccountingCalendarAggregateProps {
  calendar: AccountingCalendarEntity;
}

// =============================================================================
// Aggregate
// =============================================================================

/**
 * Accounting Calendar aggregate root.
 *
 * Owns exactly one AccountingCalendarEntity.
 *
 * The entity remains responsible for calendar-level invariants and lifecycle
 * rules. The aggregate exposes the entity through the aggregate boundary.
 */
export class AccountingCalendarAggregate extends AggregateRoot<AccountingCalendarAggregateProps> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: AccountingCalendarAggregateProps) {
    if (props === undefined) {
      throw new AccountingException(
        'Accounting Calendar aggregate properties are required.',
      );
    }

    AccountingCalendarAggregate.ensureEntity(props.calendar);

    super(props, props.calendar.id, props.calendar.publicId);
  }

  // ===========================================================================
  // Factory — Create
  // ===========================================================================

  /**
   * Creates an Accounting Calendar aggregate around a newly created entity.
   *
   * Creation does not generate accounting periods.
   */
  public static create(
    calendar: AccountingCalendarEntity,
  ): AccountingCalendarAggregate {
    AccountingCalendarAggregate.ensureEntity(calendar);

    const aggregate = new AccountingCalendarAggregate({
      calendar,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Factory — Rehydrate
  // ===========================================================================

  /**
   * Rehydrates a persisted Accounting Calendar aggregate.
   *
   * Rehydration does not generate accounting periods.
   */
  public static rehydrate(
    calendar: AccountingCalendarEntity,
  ): AccountingCalendarAggregate {
    AccountingCalendarAggregate.ensureEntity(calendar);

    const aggregate = new AccountingCalendarAggregate({
      calendar,
    });

    aggregate.ensureAggregateConsistency();

    return aggregate;
  }

  // ===========================================================================
  // Aggregate State
  // ===========================================================================

  /**
   * Returns the Accounting Calendar entity owned by this aggregate.
   */
  public get calendar(): AccountingCalendarEntity {
    return this.props.calendar;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Internal persistence identity.
   */
  public override get id(): typeof this.calendar.id {
    return this.calendar.id;
  }

  /**
   * Public Accounting Calendar identity.
   */
  public override get publicId(): AccountingCalendarPublicId {
    return this.calendar.publicId;
  }

  // ===========================================================================
  // Calendar Code
  // ===========================================================================

  /**
   * Returns the calendar code.
   */
  public get code(): AccountingCalendarCode {
    return this.calendar.code;
  }

  // ===========================================================================
  // Calendar Name
  // ===========================================================================

  /**
   * Returns the calendar name.
   */
  public get name(): AccountingCalendarName {
    return this.calendar.name;
  }

  // ===========================================================================
  // Timezone
  // ===========================================================================

  /**
   * Returns the calendar timezone.
   */
  public get timezone(): AccountingCalendarTimezone {
    return this.calendar.timezone;
  }

  // ===========================================================================
  // Fiscal Year Configuration
  // ===========================================================================

  /**
   * Returns the fiscal year starting month.
   */
  public get fiscalYearStartMonth(): AccountingCalendarFiscalYearStartMonth {
    return this.calendar.fiscalYearStartMonth;
  }

  // ===========================================================================
  // Period Frequency
  // ===========================================================================

  /**
   * Returns the accounting period frequency.
   */
  public get frequency(): AccountingPeriodFrequency {
    return this.calendar.frequency;
  }

  // ===========================================================================
  // Calendar Status
  // ===========================================================================

  /**
   * Returns the current calendar status.
   */
  public get status(): AccountingCalendarStatus {
    return this.calendar.status;
  }

  /**
   * Determines whether the calendar is active.
   */
  public isActive(): boolean {
    return this.calendar.isActive();
  }

  /**
   * Determines whether the calendar is inactive.
   */
  public isInactive(): boolean {
    return this.calendar.isInactive();
  }

  /**
   * Determines whether the calendar can provision accounting periods.
   */
  public canProvisionPeriods(): boolean {
    return this.calendar.canProvisionPeriods();
  }

  // ===========================================================================
  // Lifecycle — Activate
  // ===========================================================================

  /**
   * Activates the Accounting Calendar.
   *
   * The entity enforces the lifecycle transition rules.
   */
  public activate(): void {
    this.calendar.activate();
  }

  // ===========================================================================
  // Lifecycle — Deactivate
  // ===========================================================================

  /**
   * Deactivates the Accounting Calendar.
   *
   * The entity enforces the lifecycle transition rules.
   */
  public deactivate(): void {
    this.calendar.deactivate();
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Returns the calendar creation timestamp.
   */
  public get createdAt(): Date {
    return this.calendar.createdAt;
  }

  /**
   * Returns the calendar last-update timestamp.
   */
  public get updatedAt(): Date {
    return this.calendar.updatedAt;
  }

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Synchronizes the persistence update timestamp.
   *
   * This is not a business lifecycle transition.
   */
  public setUpdatedAt(updatedAt: Date): void {
    AccountingCalendarAggregate.ensureValidDate(
      updatedAt,
      'Accounting Calendar update timestamp must be valid.',
    );

    this.calendar.setUpdatedAt(updatedAt);
  }

  // ===========================================================================
  // Aggregate Consistency
  // ===========================================================================

  /**
   * Verifies structural consistency of the aggregate.
   *
   * Detailed calendar invariants remain owned by AccountingCalendarEntity.
   */
  private ensureAggregateConsistency(): void {
    AccountingCalendarAggregate.ensureEntity(this.calendar);

    // -------------------------------------------------------------------------
    // Identity
    // -------------------------------------------------------------------------

    if (this.calendar.id === undefined) {
      throw new AccountingException(
        'Accounting Calendar internal identity is required.',
      );
    }

    if (this.calendar.publicId === undefined) {
      throw new AccountingException(
        'Accounting Calendar public identity is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Configuration
    // -------------------------------------------------------------------------

    if (this.calendar.code === undefined) {
      throw new AccountingException('Accounting Calendar code is required.');
    }

    if (this.calendar.name === undefined) {
      throw new AccountingException('Accounting Calendar name is required.');
    }

    if (this.calendar.timezone === undefined) {
      throw new AccountingException(
        'Accounting Calendar timezone is required.',
      );
    }

    if (this.calendar.fiscalYearStartMonth === undefined) {
      throw new AccountingException(
        'Accounting Calendar fiscal year start month is required.',
      );
    }

    if (this.calendar.frequency === undefined) {
      throw new AccountingException(
        'Accounting Calendar period frequency is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------

    if (this.calendar.status === undefined) {
      throw new AccountingException('Accounting Calendar status is required.');
    }

    // -------------------------------------------------------------------------
    // Audit State
    // -------------------------------------------------------------------------

    AccountingCalendarAggregate.ensureValidDate(
      this.createdAt,
      'Accounting Calendar creation timestamp must be valid.',
    );

    AccountingCalendarAggregate.ensureValidDate(
      this.updatedAt,
      'Accounting Calendar update timestamp must be valid.',
    );

    if (this.updatedAt.getTime() < this.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting Calendar updated timestamp cannot be before its creation timestamp.',
      );
    }
  }

  // ===========================================================================
  // Entity Guard
  // ===========================================================================

  /**
   * Ensures an entity exists before it becomes the aggregate root.
   */
  private static ensureEntity(
    calendar: AccountingCalendarEntity | undefined,
  ): asserts calendar is AccountingCalendarEntity {
    if (calendar === undefined) {
      throw new AccountingException('Accounting Calendar entity is required.');
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

export default AccountingCalendarAggregate;
