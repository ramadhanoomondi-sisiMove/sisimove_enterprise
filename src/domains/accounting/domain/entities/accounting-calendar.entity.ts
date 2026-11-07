// -----------------------------------------------------------------------------
// Accounting Calendar
// -----------------------------------------------------------------------------
//
// Accounting Calendar Entity.
//
// Aggregate boundary:
//
// AccountingCalendarAggregate
// └── AccountingCalendarEntity
//
// The entity owns calendar identity, configuration and lifecycle.
//
// Period generation belongs to the application provisioning workflow.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { AccountingException } from '../exceptions/accounting.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  AccountingCalendarCode,
  AccountingCalendarName,
  AccountingCalendarTimezone,
  AccountingCalendarFiscalYearStartMonth,
  AccountingPeriodFrequency,
} from '../value-objects';

import { AccountingCalendarPublicId } from '../value-objects';

import { AccountingCalendarStatus } from '../value-objects';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface AccountingCalendarProps {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  publicId: AccountingCalendarPublicId;

  // ---------------------------------------------------------------------------
  // Configuration
  // ---------------------------------------------------------------------------

  code: AccountingCalendarCode;

  name: AccountingCalendarName;

  timezone: AccountingCalendarTimezone;

  fiscalYearStartMonth: AccountingCalendarFiscalYearStartMonth;

  frequency: AccountingPeriodFrequency;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  status: AccountingCalendarStatus;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class AccountingCalendarEntity extends Entity<AccountingCalendarProps> {
  private constructor(props: AccountingCalendarProps, id?: UniqueEntityId) {
    super(props, id);

    this.validateInvariants();
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  /**
   * Creates a new Accounting Calendar.
   *
   * New calendars are created in ACTIVE status.
   */
  public static create(
    props: Omit<
      AccountingCalendarProps,
      'publicId' | 'status' | 'createdAt' | 'updatedAt'
    > & {
      createdAt?: Date;
    },
  ): AccountingCalendarEntity {
    if (props === undefined) {
      throw new AccountingException(
        'Accounting calendar properties are required.',
      );
    }

    const createdAt = props.createdAt ?? new Date();

    AccountingCalendarEntity.ensureValidDate(createdAt, 'creation date');

    return new AccountingCalendarEntity({
      publicId: new AccountingCalendarPublicId(),

      code: props.code,
      name: props.name,
      timezone: props.timezone,
      fiscalYearStartMonth: props.fiscalYearStartMonth,
      frequency: props.frequency,

      status: AccountingCalendarStatus.active(),

      createdAt: AccountingCalendarEntity.cloneDate(createdAt),
      updatedAt: AccountingCalendarEntity.cloneDate(createdAt),
    });
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  /**
   * Rehydrates an Accounting Calendar from persistence.
   *
   * Rehydration preserves the existing identity, configuration,
   * lifecycle status and audit timestamps.
   */
  public static rehydrate(
    props: AccountingCalendarProps,
    id: UniqueEntityId,
  ): AccountingCalendarEntity {
    if (props === undefined) {
      throw new AccountingException(
        'Accounting calendar properties are required for rehydration.',
      );
    }

    if (id === undefined) {
      throw new AccountingException(
        'Accounting calendar internal identity is required for rehydration.',
      );
    }

    return new AccountingCalendarEntity(
      {
        ...props,
        createdAt: AccountingCalendarEntity.cloneDate(props.createdAt),
        updatedAt: AccountingCalendarEntity.cloneDate(props.updatedAt),
      },
      id,
    );
  }

  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  override get publicId(): AccountingCalendarPublicId {
    return this.props.publicId;
  }

  // ---------------------------------------------------------------------------
  // Calendar Configuration
  // ---------------------------------------------------------------------------

  public get code(): AccountingCalendarCode {
    return this.props.code;
  }

  public get name(): AccountingCalendarName {
    return this.props.name;
  }

  public get timezone(): AccountingCalendarTimezone {
    return this.props.timezone;
  }

  public get fiscalYearStartMonth(): AccountingCalendarFiscalYearStartMonth {
    return this.props.fiscalYearStartMonth;
  }

  public get frequency(): AccountingPeriodFrequency {
    return this.props.frequency;
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  public get status(): AccountingCalendarStatus {
    return this.props.status;
  }

  public activate(): void {
    if (this.isActive()) {
      return;
    }

    this.props.status = AccountingCalendarStatus.active();

    this.touch();
  }

  public deactivate(): void {
    if (this.isInactive()) {
      return;
    }

    this.props.status = AccountingCalendarStatus.inactive();

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Lifecycle Queries
  // ---------------------------------------------------------------------------

  public isActive(): boolean {
    return this.props.status.isActive();
  }

  public isInactive(): boolean {
    return this.props.status.isInactive();
  }

  public canProvisionPeriods(): boolean {
    return this.isActive();
  }

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return AccountingCalendarEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return AccountingCalendarEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    AccountingCalendarEntity.ensureValidDate(updatedAt, 'updated date');

    if (updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting calendar updated date cannot be before creation date.',
      );
    }

    this.props.updatedAt = AccountingCalendarEntity.cloneDate(updatedAt);
  }

  // ---------------------------------------------------------------------------
  // Invariants
  // ---------------------------------------------------------------------------

  private validateInvariants(): void {
    AccountingCalendarEntity.ensurePublicId(this.props.publicId);

    AccountingCalendarEntity.ensureCode(this.props.code);

    AccountingCalendarEntity.ensureName(this.props.name);

    AccountingCalendarEntity.ensureTimezone(this.props.timezone);

    AccountingCalendarEntity.ensureFiscalYearStartMonth(
      this.props.fiscalYearStartMonth,
    );

    AccountingCalendarEntity.ensureFrequency(this.props.frequency);

    AccountingCalendarEntity.ensureStatus(this.props.status);

    AccountingCalendarEntity.ensureValidDate(
      this.props.createdAt,
      'creation date',
    );

    AccountingCalendarEntity.ensureValidDate(
      this.props.updatedAt,
      'updated date',
    );

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting calendar updated date cannot be before creation date.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Guards
  // ---------------------------------------------------------------------------

  private static ensurePublicId(publicId: AccountingCalendarPublicId): void {
    if (publicId === undefined) {
      throw new AccountingException(
        'Accounting calendar public identity is required.',
      );
    }
  }

  private static ensureCode(code: AccountingCalendarCode): void {
    if (code === undefined) {
      throw new AccountingException('Accounting calendar code is required.');
    }
  }

  private static ensureName(name: AccountingCalendarName): void {
    if (name === undefined) {
      throw new AccountingException('Accounting calendar name is required.');
    }
  }

  private static ensureTimezone(timezone: AccountingCalendarTimezone): void {
    if (timezone === undefined) {
      throw new AccountingException(
        'Accounting calendar timezone is required.',
      );
    }
  }

  private static ensureFiscalYearStartMonth(
    month: AccountingCalendarFiscalYearStartMonth,
  ): void {
    if (month === undefined) {
      throw new AccountingException(
        'Accounting calendar fiscal year start month is required.',
      );
    }
  }

  private static ensureFrequency(frequency: AccountingPeriodFrequency): void {
    if (frequency === undefined) {
      throw new AccountingException(
        'Accounting calendar period frequency is required.',
      );
    }
  }

  private static ensureStatus(status: AccountingCalendarStatus): void {
    if (status === undefined) {
      throw new AccountingException('Accounting calendar status is required.');
    }
  }

  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AccountingException(
        `Accounting calendar ${fieldName} must be a valid date.`,
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------

  private static cloneDate(value: Date): Date {
    AccountingCalendarEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }

  // ---------------------------------------------------------------------------
  // Equality
  // ---------------------------------------------------------------------------

  override equals(other?: AccountingCalendarEntity): boolean {
    if (other === undefined) {
      return false;
    }

    return this.id.equals(other.id);
  }
}
