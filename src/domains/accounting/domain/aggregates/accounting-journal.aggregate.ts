// -----------------------------------------------------------------------------
// Accounting Journal — Aggregate
// -----------------------------------------------------------------------------
//
// Represents the Accounting Journal aggregate.
//
// Aggregate boundary:
//
// AccountingJournalAggregate
// ├── AccountingJournalEntity
// ├── AccountingJournalEntryEntity[]
// │   └── AccountingJournalLineEntity[]
// └── AccountingPostingReferenceEntity?
//
// The AccountingJournalAggregate is the consistency boundary for:
//
// - journal entries;
// - journal lines;
// - posting reference;
// - debit/credit balancing;
// - currency consistency;
// - journal posting;
// - journal reversal.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain the AccountingJournalEntity root;
// - maintain journal entries;
// - maintain journal lines through entries;
// - maintain the optional posting reference;
// - enforce journal-level accounting invariants;
// - enforce journal currency consistency;
// - determine whether the journal is balanced;
// - prevent modification after posting;
// - prevent modification after reversal;
// - post only valid balanced journals;
// - reverse only posted journals;
// - record accounting domain events.
//
// -----------------------------------------------------------------------------
//
// This aggregate does NOT:
//
// - load AccountingAccountAggregate;
// - load AccountingPeriodAggregate;
// - access repositories;
// - access Prisma;
// - perform authorization;
// - determine whether an accounting account exists;
// - determine whether an accounting period exists;
// - determine whether an accounting period is open.
//
// Cross-aggregate validation belongs to the application/domain workflow.
//
// -----------------------------------------------------------------------------
//
// Accounting consistency:
//
// A journal is balanced when:
//
//     total debits === total credits
//
// AccountingJournalLineEntity stores amount as a non-negative monetary
// magnitude. Debit/credit direction is represented separately by
// AccountingJournalLineType.
//
// Therefore:
//
//     DEBIT  -> contributes to total debit
//     CREDIT -> contributes to total credit
//
// -----------------------------------------------------------------------------
//
// Posting:
//
// A journal can only be posted when:
//
// - it is DRAFT;
// - it contains at least one entry;
// - every entry contains at least one line;
// - all lines use the journal currency;
// - total debits equal total credits.
//
// Once POSTED:
//
// - entries cannot be changed;
// - lines cannot be changed;
// - posting reference cannot be changed;
// - period assignment cannot be changed;
// - the journal cannot be posted again.
//
// -----------------------------------------------------------------------------
//
// Reversal:
//
// Only a POSTED journal can be reversed.
//
// A REVERSED journal is terminal.
//
// Reversal does not remove or mutate the journal's existing entries or lines.
// The original journal remains historically preserved.
//
// -----------------------------------------------------------------------------
//
// Persistence:
//
// Infrastructure persists the complete aggregate:
//
// Journal
//   -> Entries
//      -> Lines
//   -> Posting Reference
//
// Prisma foreign keys such as journalId, entryId, accountId and periodId are
// persistence concerns and are not represented as mutable aggregate
// relationships.
//
// -----------------------------------------------------------------------------
//
// Strict typing:
//
// Runtime collection validation uses `unknown` together with assertion
// functions. This prevents Array.isArray() from narrowing an unknown
// collection to `any[]`, which would trigger @typescript-eslint/no-unsafe-*
//
// errors.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { AggregateRoot } from '../../../../foundation/kernel/domain/aggregate-root';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import { AccountingException } from '../exceptions/accounting.exception';

// -----------------------------------------------------------------------------
// Events
// -----------------------------------------------------------------------------

import { AccountingJournalCreatedEvent } from '../events/accounting-journal-created.event';
import { AccountingJournalPostedEvent } from '../events/accounting-journal-posted.event';
import { AccountingJournalReversedEvent } from '../events/accounting-journal-reversed.event';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { AccountingJournalEntity } from '../entities/accounting-journal.entity';
import { AccountingJournalEntryEntity } from '../entities/accounting-journal-entry.entity';
import { AccountingJournalLineEntity } from '../entities/accounting-journal-line.entity';
import { AccountingPostingReferenceEntity } from '../entities/accounting-posting-reference.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AccountingJournalPublicId } from '../value-objects/accounting-journal-public-id.vo';
import { AccountingPeriodPublicId } from '../value-objects/accounting-period-public-id.vo';
import { AccountingCurrency } from '../value-objects/accounting-currency.vo';
import type { AccountingJournalStatus } from '../value-objects/accounting-journal-status.vo';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

export interface AccountingJournalAggregateProps {
  journal: AccountingJournalEntity;
}

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

export class AccountingJournalAggregate extends AggregateRoot<
  AccountingJournalAggregateProps,
  AccountingJournalPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  private constructor(props: AccountingJournalAggregateProps) {
    super(props, props.journal.id, props.journal.publicId);

    this.validateAggregateInvariants();
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(
    journal: AccountingJournalEntity,
  ): AccountingJournalAggregate {
    AccountingJournalAggregate.ensureJournal(journal);

    return new AccountingJournalAggregate({
      journal,
    });
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    journal: AccountingJournalEntity,
  ): AccountingJournalAggregate {
    AccountingJournalAggregate.ensureJournal(journal);

    return new AccountingJournalAggregate({
      journal,
    });
  }

  // ===========================================================================
  // Journal
  // ===========================================================================

  public get journal(): AccountingJournalEntity {
    return this.props.journal;
  }

  // ===========================================================================
  // Identity
  // ===========================================================================

  public override get id(): UniqueEntityId {
    return this.journal.id;
  }

  public override get publicId(): AccountingJournalPublicId {
    return this.journal.publicId;
  }

  // ===========================================================================
  // Currency
  // ===========================================================================

  public get currency(): AccountingCurrency {
    return this.journal.currency;
  }

  public isCurrency(currency: AccountingCurrency): boolean {
    AccountingJournalAggregate.ensureCurrency(currency);

    return this.currency.equals(currency);
  }

  // ===========================================================================
  // Period
  // ===========================================================================

  /**
   * Internal identity of the Accounting Period referenced by this journal.
   *
   * The journal aggregate stores the reference but does not load or validate
   * the Accounting Period aggregate.
   */
  public get periodId(): UniqueEntityId | undefined {
    return this.journal.periodId;
  }

  /**
   * Public identity of the Accounting Period referenced by this journal.
   *
   * This is maintained explicitly by the journal domain entity.
   */
  public get periodPublicId(): AccountingPeriodPublicId | undefined {
    return this.journal.periodPublicId;
  }

  public hasPeriod(): boolean {
    return this.journal.periodId !== undefined;
  }

  public belongsToPeriod(periodId: UniqueEntityId): boolean {
    AccountingJournalAggregate.ensureInternalId(periodId);

    return (
      this.journal.periodId !== undefined &&
      this.journal.periodId.equals(periodId)
    );
  }

  /**
   * Assign both internal and public identities of an Accounting Period.
   *
   * The aggregate intentionally requires both identities so the domain
   * cannot contain a partial period reference.
   */
  public assignPeriod(
    periodId: UniqueEntityId,
    periodPublicId: AccountingPeriodPublicId,
  ): void {
    this.ensureDraft();

    AccountingJournalAggregate.ensureInternalId(periodId);
    AccountingJournalAggregate.ensurePeriodPublicId(periodPublicId);

    this.journal.assignPeriod(periodId, periodPublicId);
  }

  public removePeriod(): void {
    this.ensureDraft();

    this.journal.removePeriod();
  }

  // ===========================================================================
  // Status
  // ===========================================================================

  public get status(): AccountingJournalStatus {
    return this.journal.status;
  }

  public isDraft(): boolean {
    return this.journal.isDraft();
  }

  public isPosted(): boolean {
    return this.journal.isPosted();
  }

  public isReversed(): boolean {
    return this.journal.isReversed();
  }

  public isMutable(): boolean {
    return this.journal.isDraft();
  }

  /**
   * Status-level capability only.
   *
   * This does not guarantee that all aggregate-level accounting requirements
   * have been satisfied. Use canPost() for complete posting readiness.
   */
  public canBePosted(): boolean {
    return this.journal.canBePosted();
  }

  public canBeReversed(): boolean {
    return this.journal.canBeReversed();
  }

  // ===========================================================================
  // Entries
  // ===========================================================================

  public get entries(): readonly AccountingJournalEntryEntity[] {
    return this.journal.entries;
  }

  public get entryCount(): number {
    return this.journal.entryCount;
  }

  public hasEntries(): boolean {
    return this.journal.hasEntries();
  }

  public hasEntry(entryId: UniqueEntityId): boolean {
    AccountingJournalAggregate.ensureInternalId(entryId);

    return this.journal.hasEntry(entryId);
  }

  public getEntry(
    entryId: UniqueEntityId,
  ): AccountingJournalEntryEntity | undefined {
    AccountingJournalAggregate.ensureInternalId(entryId);

    return this.journal.getEntry(entryId);
  }

  public addEntry(entry: AccountingJournalEntryEntity): void {
    this.ensureDraft();

    AccountingJournalAggregate.ensureEntry(entry);

    AccountingJournalAggregate.ensureEntryIdIsUnique(entry, this.entries);

    AccountingJournalAggregate.ensureEntryCurrency(entry, this.currency);

    AccountingJournalAggregate.ensureEntryLineIdsAreUnique(entry, this.entries);

    this.journal.addEntry(entry);
  }

  public removeEntry(entryId: UniqueEntityId): AccountingJournalEntryEntity {
    this.ensureDraft();

    AccountingJournalAggregate.ensureInternalId(entryId);

    return this.journal.removeEntry(entryId);
  }

  public clearEntries(): void {
    this.ensureDraft();

    this.journal.clearEntries();
  }

  public replaceEntries(entries: AccountingJournalEntryEntity[]): void {
    this.ensureDraft();

    AccountingJournalAggregate.ensureEntries(entries);

    for (const entry of entries) {
      AccountingJournalAggregate.ensureEntryCurrency(entry, this.currency);
    }

    AccountingJournalAggregate.ensureGlobalLineIdsAreUnique(entries);

    this.journal.replaceEntries(entries);
  }

  // ===========================================================================
  // Journal Lines
  // ===========================================================================

  public addLine(
    entryId: UniqueEntityId,
    line: AccountingJournalLineEntity,
  ): void {
    this.ensureDraft();

    AccountingJournalAggregate.ensureInternalId(entryId);
    AccountingJournalAggregate.ensureLine(line);

    const entry = this.journal.getEntry(entryId);

    if (entry === undefined) {
      throw new AccountingException(
        'Accounting journal entry does not belong to this journal.',
      );
    }

    AccountingJournalAggregate.ensureLineCurrency(line, this.currency);

    AccountingJournalAggregate.ensureGlobalLineIdIsUnique(line, this.entries);

    entry.addLine(line);
  }

  public removeLine(
    entryId: UniqueEntityId,
    lineId: UniqueEntityId,
  ): AccountingJournalLineEntity {
    this.ensureDraft();

    AccountingJournalAggregate.ensureInternalId(entryId);
    AccountingJournalAggregate.ensureInternalId(lineId);

    const entry = this.journal.getEntry(entryId);

    if (entry === undefined) {
      throw new AccountingException(
        'Accounting journal entry does not belong to this journal.',
      );
    }

    return entry.removeLine(lineId);
  }

  public getLine(
    entryId: UniqueEntityId,
    lineId: UniqueEntityId,
  ): AccountingJournalLineEntity | undefined {
    AccountingJournalAggregate.ensureInternalId(entryId);
    AccountingJournalAggregate.ensureInternalId(lineId);

    const entry = this.journal.getEntry(entryId);

    if (entry === undefined) {
      return undefined;
    }

    return entry.getLine(lineId);
  }

  // ===========================================================================
  // Posting Reference
  // ===========================================================================

  public get postingReference(): AccountingPostingReferenceEntity | undefined {
    return this.journal.postingReference;
  }

  public get postingReferencePublicId(): string | undefined {
    return this.journal.postingReference?.publicId.value;
  }

  public hasPostingReference(): boolean {
    return this.journal.postingReference !== undefined;
  }

  public setPostingReference(
    postingReference: AccountingPostingReferenceEntity,
  ): void {
    this.ensureDraft();

    AccountingJournalAggregate.ensurePostingReference(postingReference);

    this.journal.setPostingReference(postingReference);
  }

  public clearPostingReference(): void {
    this.ensureDraft();

    this.journal.clearPostingReference();
  }

  // ===========================================================================
  // Debit / Credit Totals
  // ===========================================================================

  public get totalDebit(): number {
    let total = 0;

    for (const entry of this.entries) {
      for (const line of entry.lines) {
        if (line.isDebit) {
          total += line.amount.value;
        }
      }
    }

    return total;
  }

  public get totalCredit(): number {
    let total = 0;

    for (const entry of this.entries) {
      for (const line of entry.lines) {
        if (line.isCredit) {
          total += line.amount.value;
        }
      }
    }

    return total;
  }

  public get balanceDifference(): number {
    return this.totalDebit - this.totalCredit;
  }

  public isBalanced(): boolean {
    return this.totalDebit === this.totalCredit;
  }

  public isUnbalanced(): boolean {
    return !this.isBalanced();
  }

  // ===========================================================================
  // Line Statistics
  // ===========================================================================

  public get lineCount(): number {
    let count = 0;

    for (const entry of this.entries) {
      count += entry.lineCount;
    }

    return count;
  }

  public hasLines(): boolean {
    return this.lineCount > 0;
  }

  // ===========================================================================
  // Posting Validation
  // ===========================================================================

  /**
   * Determines whether the journal is currently ready to post.
   *
   * Aggregate-local validation only.
   *
   * This does not verify:
   *
   * - whether referenced accounts exist;
   * - whether the referenced period exists;
   * - whether the period is open;
   * - whether the caller is authorized.
   */
  public canPost(): boolean {
    if (!this.journal.isDraft()) {
      return false;
    }

    if (!this.hasEntries()) {
      return false;
    }

    if (!this.hasLines()) {
      return false;
    }

    if (!this.hasConsistentCurrencies()) {
      return false;
    }

    for (const entry of this.entries) {
      if (!entry.hasLines()) {
        return false;
      }
    }

    return this.isBalanced();
  }

  /**
   * Performs complete aggregate-local validation before posting.
   */
  public validateForPosting(): void {
    this.ensureDraft();

    if (!this.hasEntries()) {
      throw new AccountingException(
        'Accounting journal cannot be posted without at least one journal entry.',
      );
    }

    this.ensureEntriesHaveLines();

    if (!this.hasLines()) {
      throw new AccountingException(
        'Accounting journal cannot be posted without journal lines.',
      );
    }

    this.ensureCurrenciesAreConsistent();

    AccountingJournalAggregate.ensureGlobalLineIdsAreUnique(this.entries);

    this.ensureBalanced();
  }

  // ===========================================================================
  // Created Event
  // ===========================================================================

  public recordCreated(correlationId: string, causationId?: string): void {
    AccountingJournalAggregate.ensureCorrelationId(correlationId);

    AccountingJournalAggregate.ensureOptionalCausationId(causationId);

    this.addDomainEvent(
      new AccountingJournalCreatedEvent(
        this.id.value,
        this.publicId.value,
        this.status.value,
        this.currency.value,
        this.periodPublicId?.value,
        this.journal.createdAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Posting
  // ===========================================================================

  public post(
    correlationId: string,
    causationId?: string,
    postedAt: Date = new Date(),
  ): void {
    AccountingJournalAggregate.ensureCorrelationId(correlationId);

    AccountingJournalAggregate.ensureOptionalCausationId(causationId);

    AccountingJournalAggregate.ensureValidDate(postedAt, 'posting date');

    this.validateForPosting();

    this.journal.post(postedAt);

    const actualPostedAt = this.journal.postedAt;

    if (actualPostedAt === undefined) {
      throw new AccountingException(
        'Accounting journal was posted but no posting timestamp was recorded.',
      );
    }

    this.addDomainEvent(
      new AccountingJournalPostedEvent(
        this.id.value,
        this.publicId.value,
        this.status.value,
        this.currency.value,
        this.periodPublicId?.value,
        this.postingReferencePublicId,
        actualPostedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Reversal
  // ===========================================================================

  public reverse(
    correlationId: string,
    causationId?: string,
    reversedAt: Date = new Date(),
  ): void {
    AccountingJournalAggregate.ensureCorrelationId(correlationId);

    AccountingJournalAggregate.ensureOptionalCausationId(causationId);

    AccountingJournalAggregate.ensureValidDate(reversedAt, 'reversal date');

    if (!this.journal.isPosted()) {
      if (this.journal.isDraft()) {
        throw new AccountingException(
          'Only a posted accounting journal can be reversed.',
        );
      }

      throw new AccountingException(
        'Accounting journal cannot be reversed in its current status.',
      );
    }

    this.journal.reverse(reversedAt);

    const actualReversedAt = this.journal.reversedAt;

    if (actualReversedAt === undefined) {
      throw new AccountingException(
        'Accounting journal was reversed but no reversal timestamp was recorded.',
      );
    }

    this.addDomainEvent(
      new AccountingJournalReversedEvent(
        this.id.value,
        this.publicId.value,
        this.status.value,
        this.currency.value,
        this.periodPublicId?.value,
        this.postingReferencePublicId,
        actualReversedAt,
        correlationId,
        causationId,
      ),
    );
  }

  // ===========================================================================
  // Aggregate Invariants
  // ===========================================================================

  private validateAggregateInvariants(): void {
    AccountingJournalAggregate.ensureJournal(this.journal);

    const entries = this.entries;

    AccountingJournalAggregate.ensureEntries(entries);

    AccountingJournalAggregate.ensureGlobalLineIdsAreUnique(entries);

    for (const entry of entries) {
      AccountingJournalAggregate.ensureEntryCurrency(entry, this.currency);
    }

    AccountingJournalAggregate.ensurePeriodReferenceConsistency(this.journal);

    if (this.journal.isPosted() || this.journal.isReversed()) {
      this.ensureEntriesHaveLines();

      this.ensureCurrenciesAreConsistent();

      this.ensureBalanced();
    }
  }

  // ===========================================================================
  // Entry Invariants
  // ===========================================================================

  private ensureEntriesHaveLines(): void {
    for (const entry of this.entries) {
      if (!entry.hasLines()) {
        throw new AccountingException(
          'Accounting journal requires every journal entry to contain at least one journal line.',
        );
      }
    }
  }

  // ===========================================================================
  // Currency Invariants
  // ===========================================================================

  private ensureCurrenciesAreConsistent(): void {
    if (!this.hasConsistentCurrencies()) {
      throw new AccountingException(
        'All accounting journal lines must use the journal currency.',
      );
    }
  }

  private hasConsistentCurrencies(): boolean {
    for (const entry of this.entries) {
      for (const line of entry.lines) {
        if (!line.currency.equals(this.currency)) {
          return false;
        }
      }
    }

    return true;
  }

  // ===========================================================================
  // Balance Invariants
  // ===========================================================================

  private ensureBalanced(): void {
    if (!this.isBalanced()) {
      throw new AccountingException(
        `Accounting journal is not balanced. Total debits: ${this.totalDebit}. Total credits: ${this.totalCredit}.`,
      );
    }
  }

  // ===========================================================================
  // Modification Guard
  // ===========================================================================

  private ensureDraft(): void {
    if (!this.journal.isDraft()) {
      throw new AccountingException(
        'Accounting journal can only be modified while it is in DRAFT status.',
      );
    }
  }

  // ===========================================================================
  // Entity Guards
  // ===========================================================================

  private static ensureJournal(
    journal: unknown,
  ): asserts journal is AccountingJournalEntity {
    if (!(journal instanceof AccountingJournalEntity)) {
      throw new AccountingException(
        'Accounting journal aggregate requires a valid AccountingJournalEntity.',
      );
    }
  }

  private static ensureEntry(
    entry: unknown,
  ): asserts entry is AccountingJournalEntryEntity {
    if (!(entry instanceof AccountingJournalEntryEntity)) {
      throw new AccountingException(
        'Accounting journal entry must be a valid AccountingJournalEntryEntity.',
      );
    }
  }

  /**
   * Runtime-safe validation of the journal entry collection.
   *
   * Important:
   *
   * Array.isArray(value) narrows an unknown value to any[].
   * Assigning it immediately to readonly unknown[] prevents unsafe `any`
   * propagation under strict @typescript-eslint rules.
   */
  private static ensureEntries(entries: unknown): void {
    if (!Array.isArray(entries)) {
      throw new AccountingException(
        'Accounting journal entries must be an array.',
      );
    }

    const typedEntries: readonly unknown[] = entries;

    const ids = new Set<string>();

    for (const entry of typedEntries) {
      AccountingJournalAggregate.ensureEntry(entry);

      const id = entry.id.value;

      if (ids.has(id)) {
        throw new AccountingException(
          'Accounting journal cannot contain duplicate journal entries.',
        );
      }

      ids.add(id);
    }
  }

  private static ensureLine(
    line: unknown,
  ): asserts line is AccountingJournalLineEntity {
    if (!(line instanceof AccountingJournalLineEntity)) {
      throw new AccountingException(
        'Accounting journal line must be a valid AccountingJournalLineEntity.',
      );
    }
  }

  private static ensurePostingReference(
    postingReference: unknown,
  ): asserts postingReference is AccountingPostingReferenceEntity {
    if (!(postingReference instanceof AccountingPostingReferenceEntity)) {
      throw new AccountingException(
        'Accounting journal posting reference must be a valid AccountingPostingReferenceEntity.',
      );
    }
  }

  // ===========================================================================
  // Identity Guards
  // ===========================================================================

  private static ensureInternalId(id: unknown): asserts id is UniqueEntityId {
    if (!(id instanceof UniqueEntityId)) {
      throw new AccountingException(
        'Accounting journal internal identity must be a valid internal entity identity.',
      );
    }
  }

  private static ensurePeriodPublicId(
    publicId: unknown,
  ): asserts publicId is AccountingPeriodPublicId {
    if (!(publicId instanceof AccountingPeriodPublicId)) {
      throw new AccountingException(
        'Accounting journal period public identity must be valid.',
      );
    }
  }

  // ===========================================================================
  // Entry Identity Guards
  // ===========================================================================

  private static ensureEntryIdIsUnique(
    entry: AccountingJournalEntryEntity,
    existingEntries: readonly AccountingJournalEntryEntity[],
  ): void {
    const entryId = entry.id.value;

    for (const existingEntry of existingEntries) {
      if (existingEntry.id.value === entryId) {
        throw new AccountingException(
          'Accounting journal cannot contain duplicate journal entries.',
        );
      }
    }
  }

  // ===========================================================================
  // Line Identity Guards
  // ===========================================================================

  private static ensureGlobalLineIdIsUnique(
    line: AccountingJournalLineEntity,
    entries: readonly AccountingJournalEntryEntity[],
  ): void {
    for (const entry of entries) {
      if (entry.hasLine(line.id)) {
        throw new AccountingException(
          'Accounting journal cannot contain duplicate journal lines.',
        );
      }
    }
  }

  private static ensureEntryLineIdsAreUnique(
    entry: AccountingJournalEntryEntity,
    existingEntries: readonly AccountingJournalEntryEntity[],
  ): void {
    for (const line of entry.lines) {
      AccountingJournalAggregate.ensureGlobalLineIdIsUnique(
        line,
        existingEntries,
      );
    }
  }

  private static ensureGlobalLineIdsAreUnique(
    entries: readonly AccountingJournalEntryEntity[],
  ): void {
    const lineIds = new Set<string>();

    for (const entry of entries) {
      for (const line of entry.lines) {
        const lineId = line.id.value;

        if (lineIds.has(lineId)) {
          throw new AccountingException(
            'Accounting journal cannot contain duplicate journal lines.',
          );
        }

        lineIds.add(lineId);
      }
    }
  }

  // ===========================================================================
  // Currency Guards
  // ===========================================================================

  private static ensureCurrency(
    currency: unknown,
  ): asserts currency is AccountingCurrency {
    if (!(currency instanceof AccountingCurrency)) {
      throw new AccountingException(
        'Accounting journal currency must be valid.',
      );
    }
  }

  private static ensureEntryCurrency(
    entry: AccountingJournalEntryEntity,
    currency: AccountingCurrency,
  ): void {
    for (const line of entry.lines) {
      AccountingJournalAggregate.ensureLineCurrency(line, currency);
    }
  }

  private static ensureLineCurrency(
    line: AccountingJournalLineEntity,
    currency: AccountingCurrency,
  ): void {
    if (!line.currency.equals(currency)) {
      throw new AccountingException(
        'Accounting journal line currency must match the accounting journal currency.',
      );
    }
  }

  // ===========================================================================
  // Period Reference Invariant
  // ===========================================================================

  private static ensurePeriodReferenceConsistency(
    journal: AccountingJournalEntity,
  ): void {
    const periodId = journal.periodId;
    const periodPublicId = journal.periodPublicId;

    if (periodId === undefined && periodPublicId === undefined) {
      return;
    }

    if (periodId === undefined || periodPublicId === undefined) {
      throw new AccountingException(
        'Accounting journal period reference must contain both internal and public period identities.',
      );
    }

    AccountingJournalAggregate.ensureInternalId(periodId);

    AccountingJournalAggregate.ensurePeriodPublicId(periodPublicId);
  }

  // ===========================================================================
  // Event Guards
  // ===========================================================================

  private static ensureCorrelationId(correlationId: string): void {
    if (
      typeof correlationId !== 'string' ||
      correlationId.trim().length === 0
    ) {
      throw new AccountingException(
        'Accounting journal correlation identity is required.',
      );
    }
  }

  private static ensureOptionalCausationId(
    causationId: string | undefined,
  ): void {
    if (
      causationId !== undefined &&
      (typeof causationId !== 'string' || causationId.trim().length === 0)
    ) {
      throw new AccountingException(
        'Accounting journal causation identity must be a non-empty string when provided.',
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
}
