// -----------------------------------------------------------------------------
// Accounting Journal — Entity
// -----------------------------------------------------------------------------
//
// Represents the Accounting Journal entity within the Accounting domain.
//
// Aggregate context:
//
// AccountingJournalAggregate
// └── AccountingJournalEntity
//     ├── AccountingJournalEntryEntity[]
//     │   └── AccountingJournalLineEntity[]
//     └── AccountingPostingReferenceEntity?
//
// The Accounting Journal entity is the authoritative owner of:
//
// - Accounting Journal identity;
// - Accounting Journal public identity;
// - journal lifecycle status;
// - journal currency;
// - optional accounting period relationship;
// - journal entries;
// - optional posting reference;
// - posted timestamp;
// - reversed timestamp;
// - creation timestamp;
// - update timestamp.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain Accounting Journal identity;
// - maintain Accounting Journal public identity;
// - maintain journal status;
// - maintain journal currency;
// - maintain optional accounting period reference;
// - maintain journal entries;
// - add journal entries;
// - remove journal entries;
// - replace journal entries;
// - provide entry-level queries;
// - maintain optional posting reference;
// - maintain posting timestamp;
// - maintain reversal timestamp;
// - manage journal lifecycle state;
// - enforce journal-level structural invariants;
// - provide journal lifecycle predicates.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - calculate debit totals;
// - calculate credit totals;
// - determine whether the journal is balanced;
// - validate account existence;
// - validate account status;
// - validate accounting period state;
// - validate journal-wide currency consistency;
// - validate global journal-line uniqueness;
// - publish domain events;
// - access Prisma;
// - access repositories;
// - persist itself;
// - perform authorization;
// - communicate with external systems.
//
// Journal-wide accounting invariants belong to AccountingJournalAggregate.
//
// Persistence belongs to infrastructure.
//
// Application workflow orchestration belongs to the application layer.
//
// -----------------------------------------------------------------------------
//
// Persistence note:
//
// Prisma contains:
//
// AccountingJournal.periodId
// AccountingJournalEntry.journalId
// AccountingJournalLine.entryId
//
// These are persistence relationships.
//
// The domain represents the aggregate structurally:
//
// Journal
//   -> Entries
//      -> Lines
//
// Infrastructure is responsible for translating that structure into the
// persistence foreign keys.
//
// -----------------------------------------------------------------------------
//
// Accounting period:
//
// periodId is the opaque internal identity of the Accounting Period.
//
// periodPublicId is retained by the domain because domain/application events
// and aggregate operations may need the public identity without coupling the
// entity to persistence.
//
// Both values must either be present or absent together.
//
// The entity does not load or validate the referenced Accounting Period.
//
// -----------------------------------------------------------------------------
//
// Posting:
//
// A journal begins in DRAFT state.
//
// DRAFT → POSTED → REVERSED
//
// POSTED is immutable from an accounting-entry perspective.
//
// REVERSED is terminal.
//
// Posting and reversal timestamps are maintained by this entity, while the
// aggregate validates whether the journal is actually ready to transition.
//
// -----------------------------------------------------------------------------
//
// Posting reference:
//
// A posting reference identifies the external/domain source that caused the
// accounting journal to be created or posted.
//
// The Accounting Kernel intentionally does not resolve the source.
//
// The reference is therefore represented by AccountingPostingReferenceEntity.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// AccountingJournalAggregate is responsible for:
//
// - journal-wide balance;
// - journal-wide currency consistency;
// - global line identity uniqueness;
// - posting readiness;
// - posting events;
// - reversal events;
// - aggregate-level invariants.
//
// This entity only maintains the journal's own state and structure.
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

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { AccountingJournalPublicId } from '../value-objects/accounting-journal-public-id.vo';

import { AccountingJournalStatus } from '../value-objects/accounting-journal-status.vo';

import type { AccountingCurrency } from '../value-objects/accounting-currency.vo';

import { AccountingPeriodPublicId } from '../value-objects/accounting-period-public-id.vo';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { AccountingJournalEntryEntity } from './accounting-journal-entry.entity';

import { AccountingPostingReferenceEntity } from './accounting-posting-reference.entity';

// =============================================================================
// Props
// =============================================================================

export interface AccountingJournalProps {
  /**
   * Current Accounting Journal lifecycle status.
   */
  status: AccountingJournalStatus;

  /**
   * Currency used by the Accounting Journal.
   *
   * Journal-wide currency consistency is validated by the aggregate.
   */
  currency: AccountingCurrency;

  /**
   * Optional internal identity of the Accounting Period.
   */
  periodId: UniqueEntityId | undefined;

  /**
   * Optional public identity of the Accounting Period.
   */
  periodPublicId: AccountingPeriodPublicId | undefined;

  /**
   * Journal entries owned by this Accounting Journal.
   */
  entries: AccountingJournalEntryEntity[];

  /**
   * Optional source posting reference.
   */
  postingReference: AccountingPostingReferenceEntity | undefined;

  /**
   * Timestamp at which the journal was posted.
   */
  postedAt: Date | undefined;

  /**
   * Timestamp at which the journal was reversed.
   */
  reversedAt: Date | undefined;

  /**
   * Accounting Journal creation timestamp.
   */
  createdAt: Date;

  /**
   * Accounting Journal last-update timestamp.
   */
  updatedAt: Date;
}

// =============================================================================
// Entity
// =============================================================================

export class AccountingJournalEntity extends Entity<
  AccountingJournalProps,
  AccountingJournalPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Constructs an Accounting Journal entity.
   *
   * Construction is intentionally public to remain consistent with the
   * Accounting domain entity pattern.
   *
   * Factory creation and rehydration both perform invariant validation before
   * returning the entity.
   */
  public constructor(
    props: AccountingJournalProps,
    id?: UniqueEntityId,
    publicId?: AccountingJournalPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  /**
   * Creates a new Accounting Journal.
   *
   * Newly created journals begin in DRAFT state.
   *
   * A journal may optionally be associated with an Accounting Period.
   */
  public static create(
    currency: AccountingCurrency,
    periodId: UniqueEntityId | undefined = undefined,
    periodPublicId: AccountingPeriodPublicId | undefined = undefined,
    createdAt: Date = new Date(),
  ): AccountingJournalEntity {
    AccountingJournalEntity.ensureCurrency(currency);

    AccountingJournalEntity.ensurePeriodId(periodId);

    AccountingJournalEntity.ensurePeriodPublicId(periodPublicId);

    AccountingJournalEntity.ensurePeriodReferenceConsistency(
      periodId,
      periodPublicId,
    );

    AccountingJournalEntity.ensureValidDate(createdAt, 'creation date');

    const timestamp = AccountingJournalEntity.cloneDate(createdAt);

    const entity = new AccountingJournalEntity(
      {
        status: AccountingJournalStatus.draft(),

        currency,

        periodId,

        periodPublicId,

        entries: [],

        postingReference: undefined,

        postedAt: undefined,

        reversedAt: undefined,

        createdAt: timestamp,

        updatedAt: AccountingJournalEntity.cloneDate(timestamp),
      },

      new UniqueEntityId(),

      new AccountingJournalPublicId(),
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  /**
   * Rehydrates a persisted Accounting Journal entity.
   *
   * Rehydration never emits domain events.
   */
  public static rehydrate(
    props: AccountingJournalProps,
    id: UniqueEntityId,
    publicId: AccountingJournalPublicId,
  ): AccountingJournalEntity {
    if (props === undefined) {
      throw new AccountingException(
        'Accounting journal properties are required for rehydration.',
      );
    }

    if (!(id instanceof UniqueEntityId)) {
      throw new AccountingException(
        'Accounting journal internal identity is required for rehydration.',
      );
    }

    if (!(publicId instanceof AccountingJournalPublicId)) {
      throw new AccountingException(
        'Accounting journal public identity is required for rehydration.',
      );
    }

    AccountingJournalEntity.ensureStatus(props.status);

    AccountingJournalEntity.ensureCurrency(props.currency);

    AccountingJournalEntity.ensurePeriodId(props.periodId);

    AccountingJournalEntity.ensurePeriodPublicId(props.periodPublicId);

    AccountingJournalEntity.ensurePeriodReferenceConsistency(
      props.periodId,
      props.periodPublicId,
    );

    AccountingJournalEntity.ensureEntries(props.entries);

    AccountingJournalEntity.ensurePostingReference(props.postingReference);

    AccountingJournalEntity.ensureOptionalDate(props.postedAt, 'posted date');

    AccountingJournalEntity.ensureOptionalDate(
      props.reversedAt,
      'reversed date',
    );

    AccountingJournalEntity.ensureValidDate(props.createdAt, 'creation date');

    AccountingJournalEntity.ensureValidDate(props.updatedAt, 'updated date');

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting journal updated date cannot be before creation date.',
      );
    }

    if (
      props.postedAt !== undefined &&
      props.postedAt.getTime() < props.createdAt.getTime()
    ) {
      throw new AccountingException(
        'Accounting journal posted date cannot be before creation date.',
      );
    }

    if (
      props.reversedAt !== undefined &&
      props.reversedAt.getTime() < props.createdAt.getTime()
    ) {
      throw new AccountingException(
        'Accounting journal reversed date cannot be before creation date.',
      );
    }

    if (
      props.postedAt !== undefined &&
      props.reversedAt !== undefined &&
      props.reversedAt.getTime() < props.postedAt.getTime()
    ) {
      throw new AccountingException(
        'Accounting journal reversed date cannot be before posted date.',
      );
    }

    const entity = new AccountingJournalEntity(
      {
        status: props.status,

        currency: props.currency,

        periodId: props.periodId,

        periodPublicId: props.periodPublicId,

        entries: [...props.entries],

        postingReference: props.postingReference,

        postedAt:
          props.postedAt === undefined
            ? undefined
            : AccountingJournalEntity.cloneDate(props.postedAt),

        reversedAt:
          props.reversedAt === undefined
            ? undefined
            : AccountingJournalEntity.cloneDate(props.reversedAt),

        createdAt: AccountingJournalEntity.cloneDate(props.createdAt),

        updatedAt: AccountingJournalEntity.cloneDate(props.updatedAt),
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
   * Public identity of the Accounting Journal.
   */
  public override get publicId(): AccountingJournalPublicId {
    return super.publicId;
  }

  /**
   * Internal identity of the Accounting Journal.
   */
  public override get id(): UniqueEntityId {
    return super.id;
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  /**
   * Current Accounting Journal lifecycle status.
   */
  public get status(): AccountingJournalStatus {
    return this.props.status;
  }

  /**
   * Determines whether the journal is in DRAFT state.
   */
  public isDraft(): boolean {
    return this.props.status.isDraft();
  }

  /**
   * Determines whether the journal is POSTED.
   */
  public isPosted(): boolean {
    return this.props.status.isPosted();
  }

  /**
   * Determines whether the journal is REVERSED.
   */
  public isReversed(): boolean {
    return this.props.status.isReversed();
  }

  /**
   * Determines whether the journal is currently mutable.
   *
   * The aggregate remains responsible for enforcing aggregate-level mutation
   * boundaries.
   */
  public isMutable(): boolean {
    return this.isDraft();
  }

  /**
   * Determines whether the journal can transition to POSTED.
   *
   * This only represents the lifecycle capability.
   *
   * Full posting readiness belongs to AccountingJournalAggregate.
   */
  public canBePosted(): boolean {
    return this.isDraft();
  }

  /**
   * Determines whether the journal can transition to REVERSED.
   */
  public canBeReversed(): boolean {
    return this.isPosted();
  }

  // ===========================================================================
  // Currency
  // ===========================================================================

  /**
   * Current journal currency.
   */
  public get currency(): AccountingCurrency {
    return this.props.currency;
  }

  /**
   * Determines whether the journal uses the supplied currency.
   */
  public isCurrency(currency: AccountingCurrency): boolean {
    AccountingJournalEntity.ensureCurrency(currency);

    return this.props.currency.equals(currency);
  }

  /**
   * Changes the journal currency.
   *
   * Aggregate-level currency and line consistency must be enforced by
   * AccountingJournalAggregate.
   */
  public changeCurrency(currency: AccountingCurrency): void {
    AccountingJournalEntity.ensureCurrency(currency);

    if (this.props.currency.equals(currency)) {
      return;
    }

    this.props.currency = currency;

    this.touch();
  }

  // ===========================================================================
  // Accounting Period
  // ===========================================================================

  /**
   * Internal identity of the optional Accounting Period.
   */
  public get periodId(): UniqueEntityId | undefined {
    return this.props.periodId;
  }

  /**
   * Public identity of the optional Accounting Period.
   */
  public get periodPublicId(): AccountingPeriodPublicId | undefined {
    return this.props.periodPublicId;
  }

  /**
   * Determines whether this journal belongs to an Accounting Period.
   */
  public hasPeriod(): boolean {
    return this.props.periodId !== undefined;
  }

  /**
   * Determines whether this journal belongs to the supplied Accounting Period.
   */
  public belongsToPeriod(
    periodId: UniqueEntityId,
    periodPublicId: AccountingPeriodPublicId,
  ): boolean {
    AccountingJournalEntity.ensurePeriodId(periodId);

    AccountingJournalEntity.ensurePeriodPublicId(periodPublicId);

    return (
      this.props.periodId?.equals(periodId) === true &&
      this.props.periodPublicId?.equals(periodPublicId) === true
    );
  }

  /**
   * Assigns the Accounting Period reference.
   *
   * The referenced Accounting Period is not loaded or validated here.
   */
  public assignPeriod(
    periodId: UniqueEntityId,
    periodPublicId: AccountingPeriodPublicId,
  ): void {
    AccountingJournalEntity.ensurePeriodId(periodId);

    AccountingJournalEntity.ensurePeriodPublicId(periodPublicId);

    if (
      this.props.periodId?.equals(periodId) === true &&
      this.props.periodPublicId?.equals(periodPublicId) === true
    ) {
      return;
    }

    this.props.periodId = periodId;

    this.props.periodPublicId = periodPublicId;

    this.touch();
  }

  /**
   * Removes the Accounting Period reference.
   */
  public removePeriod(): void {
    if (
      this.props.periodId === undefined &&
      this.props.periodPublicId === undefined
    ) {
      return;
    }

    this.props.periodId = undefined;

    this.props.periodPublicId = undefined;

    this.touch();
  }

  // ===========================================================================
  // Entries
  // ===========================================================================

  /**
   * Returns a readonly snapshot of the journal's entry collection.
   *
   * The array itself cannot be mutated by callers.
   *
   * The contained entry entities remain owned by the aggregate.
   */
  public get entries(): readonly AccountingJournalEntryEntity[] {
    return [...this.props.entries];
  }

  /**
   * Number of journal entries.
   */
  public get entryCount(): number {
    return this.props.entries.length;
  }

  /**
   * Determines whether the journal contains entries.
   */
  public hasEntries(): boolean {
    return this.props.entries.length > 0;
  }

  /**
   * Determines whether the journal contains the supplied entry.
   */
  public hasEntry(entryId: UniqueEntityId): boolean {
    AccountingJournalEntity.ensureEntryId(entryId);

    return this.props.entries.some((entry) => entry.id.equals(entryId));
  }

  /**
   * Finds an entry by internal identity.
   */
  public getEntry(
    entryId: UniqueEntityId,
  ): AccountingJournalEntryEntity | undefined {
    AccountingJournalEntity.ensureEntryId(entryId);

    return this.props.entries.find((entry) => entry.id.equals(entryId));
  }

  /**
   * Adds an Accounting Journal Entry.
   */
  public addEntry(entry: AccountingJournalEntryEntity): void {
    AccountingJournalEntity.ensureEntry(entry);

    if (this.hasEntry(entry.id)) {
      throw new AccountingException(
        'Accounting journal entry already belongs to this accounting journal.',
      );
    }

    this.props.entries.push(entry);

    this.touch();
  }

  /**
   * Removes an Accounting Journal Entry.
   */
  public removeEntry(entryId: UniqueEntityId): AccountingJournalEntryEntity {
    AccountingJournalEntity.ensureEntryId(entryId);

    const index = this.props.entries.findIndex((entry) =>
      entry.id.equals(entryId),
    );

    if (index === -1) {
      throw new AccountingException(
        'Accounting journal entry does not belong to this accounting journal.',
      );
    }

    const removed = this.props.entries[index];

    if (removed === undefined) {
      throw new AccountingException(
        'Accounting journal entry could not be removed.',
      );
    }

    this.props.entries.splice(index, 1);

    this.touch();

    return removed;
  }

  /**
   * Removes all Accounting Journal Entries.
   */
  public clearEntries(): void {
    if (this.props.entries.length === 0) {
      return;
    }

    this.props.entries.length = 0;

    this.touch();
  }

  /**
   * Replaces the journal's complete entry collection.
   *
   * Duplicate entry identities are prohibited.
   */
  public replaceEntries(entries: AccountingJournalEntryEntity[]): void {
    AccountingJournalEntity.ensureEntries(entries);

    if (AccountingJournalEntity.haveSameEntries(this.props.entries, entries)) {
      return;
    }

    this.props.entries = [...entries];

    this.touch();
  }

  // ===========================================================================
  // Posting Reference
  // ===========================================================================

  /**
   * Optional source posting reference.
   */
  public get postingReference(): AccountingPostingReferenceEntity | undefined {
    return this.props.postingReference;
  }

  /**
   * Determines whether a posting reference exists.
   */
  public hasPostingReference(): boolean {
    return this.props.postingReference !== undefined;
  }

  /**
   * Assigns the posting reference.
   *
   * The referenced source is intentionally not resolved by the Accounting
   * Kernel.
   */
  public setPostingReference(
    postingReference: AccountingPostingReferenceEntity,
  ): void {
    AccountingJournalEntity.ensurePostingReference(postingReference);

    if (this.props.postingReference?.equals(postingReference) === true) {
      return;
    }

    this.props.postingReference = postingReference;

    this.touch();
  }

  /**
   * Removes the posting reference.
   */
  public clearPostingReference(): void {
    if (this.props.postingReference === undefined) {
      return;
    }

    this.props.postingReference = undefined;

    this.touch();
  }

  // ===========================================================================
  // Posting
  // ===========================================================================

  /**
   * Timestamp at which the journal was posted.
   *
   * Returns a defensive copy.
   */
  public get postedAt(): Date | undefined {
    return this.props.postedAt === undefined
      ? undefined
      : AccountingJournalEntity.cloneDate(this.props.postedAt);
  }

  /**
   * Transitions the journal from DRAFT to POSTED.
   *
   * The aggregate must validate posting readiness before invoking this
   * lifecycle transition.
   */
  public post(postedAt: Date = new Date()): void {
    if (!this.canBePosted()) {
      throw new AccountingException(
        `Accounting journal cannot be posted from status "${this.status.value}".`,
      );
    }

    AccountingJournalEntity.ensureValidDate(postedAt, 'posted date');

    if (postedAt.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting journal posted date cannot be before creation date.',
      );
    }

    this.props.status = AccountingJournalStatus.posted();

    this.props.postedAt = AccountingJournalEntity.cloneDate(postedAt);

    this.touch(postedAt);
  }

  // ===========================================================================
  // Reversal
  // ===========================================================================

  /**
   * Timestamp at which the journal was reversed.
   *
   * Returns a defensive copy.
   */
  public get reversedAt(): Date | undefined {
    return this.props.reversedAt === undefined
      ? undefined
      : AccountingJournalEntity.cloneDate(this.props.reversedAt);
  }

  /**
   * Transitions the journal from POSTED to REVERSED.
   *
   * The aggregate is responsible for determining whether reversal is allowed
   * in the accounting workflow.
   */
  public reverse(reversedAt: Date = new Date()): void {
    if (!this.canBeReversed()) {
      throw new AccountingException(
        `Accounting journal cannot be reversed from status "${this.status.value}".`,
      );
    }

    AccountingJournalEntity.ensureValidDate(reversedAt, 'reversed date');

    if (this.props.postedAt === undefined) {
      throw new AccountingException(
        'A journal cannot be reversed without a posted date.',
      );
    }

    if (reversedAt.getTime() < this.props.postedAt.getTime()) {
      throw new AccountingException(
        'Accounting journal reversed date cannot be before posted date.',
      );
    }

    this.props.status = AccountingJournalStatus.reversed();

    this.props.reversedAt = AccountingJournalEntity.cloneDate(reversedAt);

    this.touch(reversedAt);
  }

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Accounting Journal creation timestamp.
   *
   * Returns a defensive copy.
   */
  public get createdAt(): Date {
    return AccountingJournalEntity.cloneDate(this.props.createdAt);
  }

  /**
   * Accounting Journal last-update timestamp.
   *
   * Returns a defensive copy.
   */
  public get updatedAt(): Date {
    return AccountingJournalEntity.cloneDate(this.props.updatedAt);
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
    AccountingJournalEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = AccountingJournalEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting journal updated date cannot be before creation date.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Invariants
  // ===========================================================================

  /**
   * Validates all Accounting Journal entity-level invariants.
   *
   * Journal-wide accounting rules intentionally remain outside this method.
   */
  private validateInvariants(): void {
    AccountingJournalEntity.ensureStatus(this.props.status);

    AccountingJournalEntity.ensureCurrency(this.props.currency);

    AccountingJournalEntity.ensurePeriodId(this.props.periodId);

    AccountingJournalEntity.ensurePeriodPublicId(this.props.periodPublicId);

    AccountingJournalEntity.ensurePeriodReferenceConsistency(
      this.props.periodId,
      this.props.periodPublicId,
    );

    AccountingJournalEntity.ensureEntries(this.props.entries);

    AccountingJournalEntity.ensurePostingReference(this.props.postingReference);

    AccountingJournalEntity.ensureOptionalDate(
      this.props.postedAt,
      'posted date',
    );

    AccountingJournalEntity.ensureOptionalDate(
      this.props.reversedAt,
      'reversed date',
    );

    AccountingJournalEntity.ensureValidDate(
      this.props.createdAt,
      'creation date',
    );

    AccountingJournalEntity.ensureValidDate(
      this.props.updatedAt,
      'updated date',
    );

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting journal updated date cannot be before creation date.',
      );
    }

    if (
      this.props.postedAt !== undefined &&
      this.props.postedAt.getTime() < this.props.createdAt.getTime()
    ) {
      throw new AccountingException(
        'Accounting journal posted date cannot be before creation date.',
      );
    }

    if (
      this.props.reversedAt !== undefined &&
      this.props.reversedAt.getTime() < this.props.createdAt.getTime()
    ) {
      throw new AccountingException(
        'Accounting journal reversed date cannot be before creation date.',
      );
    }

    if (
      this.props.postedAt !== undefined &&
      this.props.reversedAt !== undefined &&
      this.props.reversedAt.getTime() < this.props.postedAt.getTime()
    ) {
      throw new AccountingException(
        'Accounting journal reversed date cannot be before posted date.',
      );
    }

    if (this.isPosted() && this.props.postedAt === undefined) {
      throw new AccountingException(
        'A posted accounting journal must have a posted date.',
      );
    }

    if (this.isReversed() && this.props.reversedAt === undefined) {
      throw new AccountingException(
        'A reversed accounting journal must have a reversed date.',
      );
    }

    if (this.isReversed() && this.props.postedAt === undefined) {
      throw new AccountingException(
        'A reversed accounting journal must have a posted date.',
      );
    }

    if (
      this.isDraft() &&
      (this.props.postedAt !== undefined || this.props.reversedAt !== undefined)
    ) {
      throw new AccountingException(
        'A draft accounting journal cannot have posting or reversal dates.',
      );
    }

    if (this.isPosted() && this.props.reversedAt !== undefined) {
      throw new AccountingException(
        'A posted accounting journal cannot have a reversal date.',
      );
    }
  }

  // ===========================================================================
  // Status Guards
  // ===========================================================================

  private static ensureStatus(status: AccountingJournalStatus): void {
    if (status === undefined) {
      throw new AccountingException('Accounting journal status is required.');
    }
  }

  // ===========================================================================
  // Currency Guards
  // ===========================================================================

  private static ensureCurrency(currency: AccountingCurrency): void {
    if (currency === undefined) {
      throw new AccountingException('Accounting journal currency is required.');
    }
  }

  // ===========================================================================
  // Period Guards
  // ===========================================================================

  private static ensurePeriodId(periodId: UniqueEntityId | undefined): void {
    if (periodId === undefined) {
      return;
    }

    if (!(periodId instanceof UniqueEntityId)) {
      throw new AccountingException(
        'Accounting journal period identity must be a valid internal entity identity.',
      );
    }
  }

  private static ensurePeriodPublicId(
    periodPublicId: AccountingPeriodPublicId | undefined,
  ): void {
    if (periodPublicId === undefined) {
      return;
    }

    if (!(periodPublicId instanceof AccountingPeriodPublicId)) {
      throw new AccountingException(
        'Accounting journal period public identity must be a valid AccountingPeriodPublicId.',
      );
    }
  }

  private static ensurePeriodReferenceConsistency(
    periodId: UniqueEntityId | undefined,
    periodPublicId: AccountingPeriodPublicId | undefined,
  ): void {
    const hasPeriodId = periodId !== undefined;

    const hasPeriodPublicId = periodPublicId !== undefined;

    if (hasPeriodId !== hasPeriodPublicId) {
      throw new AccountingException(
        'Accounting journal period internal identity and public identity must either both be present or both be absent.',
      );
    }
  }

  // ===========================================================================
  // Entry Guards
  // ===========================================================================

  private static ensureEntry(entry: AccountingJournalEntryEntity): void {
    if (!(entry instanceof AccountingJournalEntryEntity)) {
      throw new AccountingException(
        'Accounting journal entry must be a valid AccountingJournalEntryEntity.',
      );
    }
  }

  private static ensureEntries(entries: AccountingJournalEntryEntity[]): void {
    if (!Array.isArray(entries)) {
      throw new AccountingException(
        'Accounting journal entries must be an array.',
      );
    }

    const ids = new Set<string>();

    for (const entry of entries) {
      AccountingJournalEntity.ensureEntry(entry);

      const id = entry.id.value;

      if (ids.has(id)) {
        throw new AccountingException(
          'Accounting journal cannot contain duplicate journal entries.',
        );
      }

      ids.add(id);
    }
  }

  private static ensureEntryId(entryId: UniqueEntityId): void {
    if (!(entryId instanceof UniqueEntityId)) {
      throw new AccountingException(
        'Accounting journal entry identity must be a valid internal entity identity.',
      );
    }
  }

  // ===========================================================================
  // Posting Reference Guards
  // ===========================================================================

  private static ensurePostingReference(
    postingReference: AccountingPostingReferenceEntity | undefined,
  ): void {
    if (postingReference === undefined) {
      return;
    }

    if (!(postingReference instanceof AccountingPostingReferenceEntity)) {
      throw new AccountingException(
        'Accounting journal posting reference must be a valid AccountingPostingReferenceEntity.',
      );
    }
  }

  // ===========================================================================
  // Date Guards
  // ===========================================================================

  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AccountingException(
        `Accounting journal ${fieldName} must be a valid date.`,
      );
    }
  }

  private static ensureOptionalDate(
    value: Date | undefined,
    fieldName: string,
  ): void {
    if (value === undefined) {
      return;
    }

    AccountingJournalEntity.ensureValidDate(value, fieldName);
  }

  // ===========================================================================
  // Entry Comparison
  // ===========================================================================

  private static haveSameEntries(
    current: readonly AccountingJournalEntryEntity[],
    replacement: readonly AccountingJournalEntryEntity[],
  ): boolean {
    if (current.length !== replacement.length) {
      return false;
    }

    for (let index = 0; index < current.length; index++) {
      const currentEntry = current[index];

      const replacementEntry = replacement[index];

      if (currentEntry === undefined || replacementEntry === undefined) {
        return false;
      }

      if (!currentEntry.id.equals(replacementEntry.id)) {
        return false;
      }
    }

    return true;
  }

  // ===========================================================================
  // Date Clone
  // ===========================================================================

  /**
   * Creates a defensive Date copy.
   */
  private static cloneDate(value: Date): Date {
    AccountingJournalEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
