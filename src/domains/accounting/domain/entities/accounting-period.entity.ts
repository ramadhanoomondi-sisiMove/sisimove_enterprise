// -----------------------------------------------------------------------------
// Accounting Period — Entity
// -----------------------------------------------------------------------------
//
// Represents the Accounting Period entity within the Accounting domain.
//
// Aggregate context:
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// The Accounting Period entity is the authoritative owner of:
//
// - Accounting Period identity;
// - Accounting Period public identity;
// - period name;
// - period start date;
// - period end date;
// - period lifecycle status;
// - period closing timestamp;
// - creation timestamp;
// - update timestamp.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain Accounting Period identity;
// - maintain Accounting Period public identity;
// - maintain period name;
// - maintain period boundaries;
// - maintain period lifecycle status;
// - manage period lifecycle;
// - record when the period was closed;
// - enforce period-level invariants;
// - provide lifecycle-safe predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - create journals;
// - post journals;
// - reverse journals;
// - calculate accounting balances;
// - access Prisma;
// - persist itself;
// - access repositories;
// - communicate with external systems;
// - perform authorization checks.
//
// Journal operations belong to AccountingJournalAggregate.
//
// Persistence belongs to infrastructure.
//
// Application workflow orchestration belongs to the application layer.
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
// An accounting period cannot be reopened once closed.
//
// -----------------------------------------------------------------------------
//
// Period boundaries:
//
// startsAt must be strictly before endsAt.
//
// The entity does not enforce that periods cannot overlap because overlap
// detection requires knowledge of other accounting periods and therefore
// belongs to the application/domain service or repository-backed workflow.
//
// -----------------------------------------------------------------------------
//
// Closing:
//
// When the period is closed:
//
// - status becomes CLOSED;
// - closedAt records the closing timestamp.
//
// closedAt must never be earlier than startsAt.
//
// Historical journals remain associated with the closed period.
//
// A closed period cannot be modified or reopened.
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { AccountingException } from '../exceptions/accounting.exception';
import { AccountingPeriodAlreadyClosedException } from '../exceptions/accounting-period-already-closed.exception';

import { AccountingPeriodPublicId } from '../value-objects/accounting-period-public-id.vo';
import type { AccountingPeriodName } from '../value-objects/accounting-period-name.vo';
import { AccountingPeriodStatus } from '../value-objects/accounting-period-status.vo';

export interface AccountingPeriodProps {
  name: AccountingPeriodName;
  startsAt: Date;
  endsAt: Date;
  status: AccountingPeriodStatus;
  closedAt: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export class AccountingPeriodEntity extends Entity<
  AccountingPeriodProps,
  AccountingPeriodPublicId
> {
  public constructor(
    props: AccountingPeriodProps,
    id?: UniqueEntityId,
    publicId?: AccountingPeriodPublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    name: AccountingPeriodName,
    startsAt: Date,
    endsAt: Date,
    createdAt: Date = new Date(),
  ): AccountingPeriodEntity {
    AccountingPeriodEntity.ensureName(name);

    AccountingPeriodEntity.ensureValidDate(startsAt, 'start date');

    AccountingPeriodEntity.ensureValidDate(endsAt, 'end date');

    AccountingPeriodEntity.ensureValidDate(createdAt, 'creation date');

    AccountingPeriodEntity.ensureValidPeriodRange(startsAt, endsAt);

    const timestamp = AccountingPeriodEntity.cloneDate(createdAt);

    const entity = new AccountingPeriodEntity(
      {
        name,
        startsAt: AccountingPeriodEntity.cloneDate(startsAt),
        endsAt: AccountingPeriodEntity.cloneDate(endsAt),
        status: AccountingPeriodStatus.open(),
        closedAt: undefined,
        createdAt: timestamp,
        updatedAt: AccountingPeriodEntity.cloneDate(timestamp),
      },
      new UniqueEntityId(),
      new AccountingPeriodPublicId(),
    );

    entity.validateInvariants();

    return entity;
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: AccountingPeriodProps,
    id: UniqueEntityId,
    publicId: AccountingPeriodPublicId,
  ): AccountingPeriodEntity {
    if (props === undefined) {
      throw new AccountingException(
        'Accounting period properties are required for rehydration.',
      );
    }

    if (id === undefined) {
      throw new AccountingException(
        'Accounting period internal identity is required for rehydration.',
      );
    }

    if (publicId === undefined) {
      throw new AccountingException(
        'Accounting period public identity is required for rehydration.',
      );
    }

    AccountingPeriodEntity.ensureName(props.name);

    AccountingPeriodEntity.ensureValidDate(props.startsAt, 'start date');

    AccountingPeriodEntity.ensureValidDate(props.endsAt, 'end date');

    AccountingPeriodEntity.ensureStatus(props.status);

    AccountingPeriodEntity.ensureValidDate(props.createdAt, 'creation date');

    AccountingPeriodEntity.ensureValidDate(props.updatedAt, 'updated date');

    AccountingPeriodEntity.ensureValidPeriodRange(props.startsAt, props.endsAt);

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting period updated date cannot be before creation date.',
      );
    }

    if (props.closedAt !== undefined) {
      AccountingPeriodEntity.ensureValidDate(props.closedAt, 'closed date');

      if (props.closedAt.getTime() < props.startsAt.getTime()) {
        throw new AccountingException(
          'Accounting period closed date cannot be before the period start date.',
        );
      }

      if (props.closedAt.getTime() < props.createdAt.getTime()) {
        throw new AccountingException(
          'Accounting period closed date cannot be before the period creation date.',
        );
      }
    }

    const entity = new AccountingPeriodEntity(
      {
        name: props.name,
        startsAt: AccountingPeriodEntity.cloneDate(props.startsAt),
        endsAt: AccountingPeriodEntity.cloneDate(props.endsAt),
        status: props.status,
        closedAt:
          props.closedAt === undefined
            ? undefined
            : AccountingPeriodEntity.cloneDate(props.closedAt),
        createdAt: AccountingPeriodEntity.cloneDate(props.createdAt),
        updatedAt: AccountingPeriodEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );

    entity.validateInvariants();

    return entity;
  }

  // ---------------------------------------------------------------------------
  // Name
  // ---------------------------------------------------------------------------

  public get name(): AccountingPeriodName {
    return this.props.name;
  }

  public changeName(name: AccountingPeriodName): void {
    AccountingPeriodEntity.ensureName(name);
    this.ensureMutable();

    if (this.props.name.equals(name)) {
      return;
    }

    this.props.name = name;
    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Period boundaries
  // ---------------------------------------------------------------------------

  public get startsAt(): Date {
    return AccountingPeriodEntity.cloneDate(this.props.startsAt);
  }

  public get endsAt(): Date {
    return AccountingPeriodEntity.cloneDate(this.props.endsAt);
  }

  public changeDates(startsAt: Date, endsAt: Date): void {
    AccountingPeriodEntity.ensureValidDate(startsAt, 'start date');

    AccountingPeriodEntity.ensureValidDate(endsAt, 'end date');

    AccountingPeriodEntity.ensureValidPeriodRange(startsAt, endsAt);

    this.ensureMutable();

    const startsAtChanged =
      this.props.startsAt.getTime() !== startsAt.getTime();

    const endsAtChanged = this.props.endsAt.getTime() !== endsAt.getTime();

    if (!startsAtChanged && !endsAtChanged) {
      return;
    }

    this.props.startsAt = AccountingPeriodEntity.cloneDate(startsAt);

    this.props.endsAt = AccountingPeriodEntity.cloneDate(endsAt);

    this.touch();
  }

  public contains(date: Date): boolean {
    AccountingPeriodEntity.ensureValidDate(date, 'date');

    const timestamp = date.getTime();

    return (
      timestamp >= this.props.startsAt.getTime() &&
      timestamp <= this.props.endsAt.getTime()
    );
  }

  public startsBefore(date: Date): boolean {
    AccountingPeriodEntity.ensureValidDate(date, 'date');

    return this.props.startsAt.getTime() < date.getTime();
  }

  public endsAfter(date: Date): boolean {
    AccountingPeriodEntity.ensureValidDate(date, 'date');

    return this.props.endsAt.getTime() > date.getTime();
  }

  // ---------------------------------------------------------------------------
  // Status
  // ---------------------------------------------------------------------------

  public get status(): AccountingPeriodStatus {
    return this.props.status;
  }

  public isOpen(): boolean {
    return this.props.status.isOpen();
  }

  public isClosed(): boolean {
    return this.props.status.isClosed();
  }

  public isUsable(): boolean {
    return this.isOpen();
  }

  public canBeModified(): boolean {
    return this.isOpen();
  }

  public canBeClosed(): boolean {
    return this.isOpen();
  }

  public canAcceptJournals(): boolean {
    return this.isOpen();
  }

  // ---------------------------------------------------------------------------
  // Closing
  // ---------------------------------------------------------------------------

  public get closedAt(): Date | undefined {
    if (this.props.closedAt === undefined) {
      return undefined;
    }

    return AccountingPeriodEntity.cloneDate(this.props.closedAt);
  }

  public close(closedAt: Date = new Date()): void {
    AccountingPeriodEntity.ensureValidDate(closedAt, 'closed date');

    if (this.isClosed()) {
      throw new AccountingPeriodAlreadyClosedException(
        'Accounting period is already closed.',
      );
    }

    if (!this.isOpen()) {
      throw new AccountingException(
        'Accounting period cannot be closed from its current status.',
      );
    }

    if (closedAt.getTime() < this.props.startsAt.getTime()) {
      throw new AccountingException(
        'Accounting period cannot be closed before its start date.',
      );
    }

    if (closedAt.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting period cannot be closed before its creation date.',
      );
    }

    this.props.status = AccountingPeriodStatus.closed();

    this.props.closedAt = AccountingPeriodEntity.cloneDate(closedAt);

    this.touch(closedAt);
  }

  // ---------------------------------------------------------------------------
  // Timestamps
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return AccountingPeriodEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return AccountingPeriodEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    AccountingPeriodEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = AccountingPeriodEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting period updated date cannot be before creation date.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ---------------------------------------------------------------------------
  // Invariants
  // ---------------------------------------------------------------------------

  private validateInvariants(): void {
    AccountingPeriodEntity.ensureName(this.props.name);

    AccountingPeriodEntity.ensureValidDate(this.props.startsAt, 'start date');

    AccountingPeriodEntity.ensureValidDate(this.props.endsAt, 'end date');

    AccountingPeriodEntity.ensureStatus(this.props.status);

    AccountingPeriodEntity.ensureValidDate(
      this.props.createdAt,
      'creation date',
    );

    AccountingPeriodEntity.ensureValidDate(
      this.props.updatedAt,
      'updated date',
    );

    AccountingPeriodEntity.ensureValidPeriodRange(
      this.props.startsAt,
      this.props.endsAt,
    );

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting period updated date cannot be before creation date.',
      );
    }

    if (this.isOpen() && this.props.closedAt !== undefined) {
      throw new AccountingException(
        'An open accounting period cannot have a closed date.',
      );
    }

    if (this.isClosed() && this.props.closedAt === undefined) {
      throw new AccountingException(
        'A closed accounting period must have a closed date.',
      );
    }

    if (this.props.closedAt !== undefined) {
      AccountingPeriodEntity.ensureValidDate(
        this.props.closedAt,
        'closed date',
      );

      if (this.props.closedAt.getTime() < this.props.startsAt.getTime()) {
        throw new AccountingException(
          'Accounting period closed date cannot be before the period start date.',
        );
      }

      if (this.props.closedAt.getTime() < this.props.createdAt.getTime()) {
        throw new AccountingException(
          'Accounting period closed date cannot be before the period creation date.',
        );
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Guards
  // ---------------------------------------------------------------------------

  private ensureMutable(): void {
    if (this.isClosed()) {
      throw new AccountingPeriodAlreadyClosedException(
        'A closed accounting period cannot be modified.',
      );
    }
  }

  private static ensureName(name: AccountingPeriodName): void {
    if (name === undefined) {
      throw new AccountingException('Accounting period name is required.');
    }
  }

  private static ensureStatus(status: AccountingPeriodStatus): void {
    if (status === undefined) {
      throw new AccountingException('Accounting period status is required.');
    }
  }

  private static ensureValidPeriodRange(startsAt: Date, endsAt: Date): void {
    if (startsAt.getTime() >= endsAt.getTime()) {
      throw new AccountingException(
        'Accounting period start date must be before its end date.',
      );
    }
  }

  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AccountingException(
        `Accounting period ${fieldName} must be a valid date.`,
      );
    }
  }

  private static cloneDate(value: Date): Date {
    AccountingPeriodEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
