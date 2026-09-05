// -----------------------------------------------------------------------------
// Accounting Journal Entry — Entity
// -----------------------------------------------------------------------------
//
// Represents an Accounting Journal Entry within the Accounting Journal
// aggregate.
//
// Aggregate context:
//
// AccountingJournalAggregate
// └── AccountingJournalEntity
//     └── AccountingJournalEntryEntity
//         └── AccountingJournalLineEntity[]
//
// A journal entry is an aggregate-internal entity. It is not an independent
// aggregate root.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain journal-entry identity;
// - maintain journal-entry public identity;
// - maintain entry date;
// - maintain optional description;
// - maintain journal lines;
// - add journal lines;
// - remove journal lines;
// - replace journal lines;
// - provide line-level queries;
// - enforce entry-level structural invariants.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - determine whether the entire journal is balanced;
// - calculate journal-wide debit/credit totals;
// - enforce journal currency;
// - post the journal;
// - reverse the journal;
// - validate accounting periods;
// - validate journal status;
// - validate account existence;
// - access repositories;
// - access Prisma;
// - persist itself;
// - perform authorization.
//
// Journal-level accounting invariants belong to AccountingJournalAggregate.
//
// -----------------------------------------------------------------------------
//
// Persistence note:
//
// Prisma contains journalId on AccountingJournalEntry and entryId on
// AccountingJournalLine because those are persistence foreign keys.
//
// They are intentionally not represented as mutable domain properties here.
//
// The aggregate owns the structural relationship:
//
// Journal
//   -> Entries
//      -> Lines
//
// Infrastructure is responsible for translating that aggregate structure into
// the persistence foreign keys.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Accounting
// -----------------------------------------------------------------------------

import { AccountingException } from '../exceptions/accounting.exception';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { AccountingJournalEntryPublicId } from '../value-objects/accounting-journal-entry-public-id.vo';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import { AccountingJournalLineEntity } from './accounting-journal-line.entity';

// -----------------------------------------------------------------------------
// Properties
// -----------------------------------------------------------------------------

export interface AccountingJournalEntryProps {
  entryDate: Date;
  description: string | undefined;
  lines: AccountingJournalLineEntity[];
  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

export class AccountingJournalEntryEntity extends Entity<
  AccountingJournalEntryProps,
  AccountingJournalEntryPublicId
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Construction is intentionally restricted to the factory and rehydration
   * paths so callers cannot bypass invariant validation.
   */
  private constructor(
    props: AccountingJournalEntryProps,
    id: UniqueEntityId,
    publicId: AccountingJournalEntryPublicId,
  ) {
    super(props, id, publicId);
  }

  // ===========================================================================
  // Factory
  // ===========================================================================

  public static create(
    entryDate: Date,
    description: string | undefined = undefined,
    lines: AccountingJournalLineEntity[] = [],
    createdAt: Date = new Date(),
  ): AccountingJournalEntryEntity {
    AccountingJournalEntryEntity.ensureValidDate(entryDate, 'entry date');

    AccountingJournalEntryEntity.ensureDescription(description);

    AccountingJournalEntryEntity.ensureLines(lines);

    AccountingJournalEntryEntity.ensureValidDate(createdAt, 'creation date');

    const timestamp = AccountingJournalEntryEntity.cloneDate(createdAt);

    const entity = new AccountingJournalEntryEntity(
      {
        entryDate: AccountingJournalEntryEntity.cloneDate(entryDate),

        description:
          AccountingJournalEntryEntity.normalizeDescription(description),

        lines: [...lines],

        createdAt: timestamp,

        updatedAt: AccountingJournalEntryEntity.cloneDate(timestamp),
      },
      new UniqueEntityId(),
      new AccountingJournalEntryPublicId(),
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Rehydration
  // ===========================================================================

  public static rehydrate(
    props: AccountingJournalEntryProps,
    id: UniqueEntityId,
    publicId: AccountingJournalEntryPublicId,
  ): AccountingJournalEntryEntity {
    if (props === undefined) {
      throw new AccountingException(
        'Accounting journal entry properties are required for rehydration.',
      );
    }

    if (!(id instanceof UniqueEntityId)) {
      throw new AccountingException(
        'Accounting journal entry internal identity is required for rehydration.',
      );
    }

    if (!(publicId instanceof AccountingJournalEntryPublicId)) {
      throw new AccountingException(
        'Accounting journal entry public identity is required for rehydration.',
      );
    }

    AccountingJournalEntryEntity.ensureValidDate(props.entryDate, 'entry date');

    AccountingJournalEntryEntity.ensureDescription(props.description);

    AccountingJournalEntryEntity.ensureLines(props.lines);

    AccountingJournalEntryEntity.ensureValidDate(
      props.createdAt,
      'creation date',
    );

    AccountingJournalEntryEntity.ensureValidDate(
      props.updatedAt,
      'updated date',
    );

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting journal entry updated date cannot be before creation date.',
      );
    }

    const entity = new AccountingJournalEntryEntity(
      {
        entryDate: AccountingJournalEntryEntity.cloneDate(props.entryDate),

        description: AccountingJournalEntryEntity.normalizeDescription(
          props.description,
        ),

        lines: [...props.lines],

        createdAt: AccountingJournalEntryEntity.cloneDate(props.createdAt),

        updatedAt: AccountingJournalEntryEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );

    entity.validateInvariants();

    return entity;
  }

  // ===========================================================================
  // Entry Date
  // ===========================================================================

  public get entryDate(): Date {
    return AccountingJournalEntryEntity.cloneDate(this.props.entryDate);
  }

  public changeEntryDate(entryDate: Date): void {
    AccountingJournalEntryEntity.ensureValidDate(entryDate, 'entry date');

    if (this.props.entryDate.getTime() === entryDate.getTime()) {
      return;
    }

    this.props.entryDate = AccountingJournalEntryEntity.cloneDate(entryDate);

    this.touch();
  }

  // ===========================================================================
  // Description
  // ===========================================================================

  public get description(): string | undefined {
    return this.props.description;
  }

  public hasDescription(): boolean {
    return this.props.description !== undefined;
  }

  public changeDescription(description: string | undefined): void {
    AccountingJournalEntryEntity.ensureDescription(description);

    const normalized =
      AccountingJournalEntryEntity.normalizeDescription(description);

    if (this.props.description === normalized) {
      return;
    }

    this.props.description = normalized;

    this.touch();
  }

  public clearDescription(): void {
    if (this.props.description === undefined) {
      return;
    }

    this.props.description = undefined;

    this.touch();
  }

  // ===========================================================================
  // Lines
  // ===========================================================================

  /**
   * Returns a readonly snapshot of the entry's line collection.
   *
   * The array itself cannot be mutated by callers.
   *
   * The contained line entities remain domain objects owned by the aggregate.
   */
  public get lines(): readonly AccountingJournalLineEntity[] {
    return [...this.props.lines];
  }

  public get lineCount(): number {
    return this.props.lines.length;
  }

  public hasLines(): boolean {
    return this.props.lines.length > 0;
  }

  public hasLine(lineId: UniqueEntityId): boolean {
    AccountingJournalEntryEntity.ensureLineId(lineId);

    return this.props.lines.some((line) => line.id.equals(lineId));
  }

  public getLine(
    lineId: UniqueEntityId,
  ): AccountingJournalLineEntity | undefined {
    AccountingJournalEntryEntity.ensureLineId(lineId);

    return this.props.lines.find((line) => line.id.equals(lineId));
  }

  public addLine(line: AccountingJournalLineEntity): void {
    AccountingJournalEntryEntity.ensureLine(line);

    if (this.hasLine(line.id)) {
      throw new AccountingException(
        'Accounting journal line already belongs to this journal entry.',
      );
    }

    this.props.lines.push(line);

    this.touch();
  }

  public removeLine(lineId: UniqueEntityId): AccountingJournalLineEntity {
    AccountingJournalEntryEntity.ensureLineId(lineId);

    const index = this.props.lines.findIndex((line) => line.id.equals(lineId));

    if (index === -1) {
      throw new AccountingException(
        'Accounting journal line does not belong to this journal entry.',
      );
    }

    const removed = this.props.lines[index];

    if (removed === undefined) {
      throw new AccountingException(
        'Accounting journal line could not be removed from this journal entry.',
      );
    }

    this.props.lines.splice(index, 1);

    this.touch();

    return removed;
  }

  public clearLines(): void {
    if (this.props.lines.length === 0) {
      return;
    }

    this.props.lines.length = 0;

    this.touch();
  }

  public replaceLines(lines: AccountingJournalLineEntity[]): void {
    AccountingJournalEntryEntity.ensureLines(lines);

    if (AccountingJournalEntryEntity.haveSameLines(this.props.lines, lines)) {
      return;
    }

    this.props.lines = [...lines];

    this.touch();
  }

  // ===========================================================================
  // Timestamps
  // ===========================================================================

  public get createdAt(): Date {
    return AccountingJournalEntryEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return AccountingJournalEntryEntity.cloneDate(this.props.updatedAt);
  }

  /**
   * Used by infrastructure when synchronizing persistence timestamps during
   * rehydration or controlled persistence operations.
   */
  public setUpdatedAt(updatedAt: Date): void {
    AccountingJournalEntryEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = AccountingJournalEntryEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting journal entry updated date cannot be before creation date.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ===========================================================================
  // Invariants
  // ===========================================================================

  private validateInvariants(): void {
    AccountingJournalEntryEntity.ensureValidDate(
      this.props.entryDate,
      'entry date',
    );

    AccountingJournalEntryEntity.ensureDescription(this.props.description);

    AccountingJournalEntryEntity.ensureLines(this.props.lines);

    AccountingJournalEntryEntity.ensureValidDate(
      this.props.createdAt,
      'creation date',
    );

    AccountingJournalEntryEntity.ensureValidDate(
      this.props.updatedAt,
      'updated date',
    );

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting journal entry updated date cannot be before creation date.',
      );
    }
  }

  // ===========================================================================
  // Line Guards
  // ===========================================================================

  private static ensureLine(line: AccountingJournalLineEntity): void {
    if (!(line instanceof AccountingJournalLineEntity)) {
      throw new AccountingException(
        'Accounting journal entry line must be a valid AccountingJournalLineEntity.',
      );
    }
  }

  private static ensureLines(lines: AccountingJournalLineEntity[]): void {
    if (!Array.isArray(lines)) {
      throw new AccountingException(
        'Accounting journal entry lines must be an array.',
      );
    }

    const ids = new Set<string>();

    for (const line of lines) {
      AccountingJournalEntryEntity.ensureLine(line);

      const id = line.id.value;

      if (ids.has(id)) {
        throw new AccountingException(
          'Accounting journal entry cannot contain duplicate journal lines.',
        );
      }

      ids.add(id);
    }
  }

  private static ensureLineId(lineId: UniqueEntityId): void {
    if (!(lineId instanceof UniqueEntityId)) {
      throw new AccountingException(
        'Accounting journal line identity must be a valid internal entity identity.',
      );
    }
  }

  // ===========================================================================
  // Description Guards
  // ===========================================================================

  private static ensureDescription(description: string | undefined): void {
    if (description !== undefined && typeof description !== 'string') {
      throw new AccountingException(
        'Accounting journal entry description must be a string.',
      );
    }

    if (description !== undefined && description.trim().length > 1000) {
      throw new AccountingException(
        'Accounting journal entry description cannot exceed 1000 characters.',
      );
    }
  }

  private static normalizeDescription(
    description: string | undefined,
  ): string | undefined {
    if (description === undefined) {
      return undefined;
    }

    const normalized = description.trim();

    return normalized.length === 0 ? undefined : normalized;
  }

  // ===========================================================================
  // Date Guards
  // ===========================================================================

  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AccountingException(
        `Accounting journal entry ${fieldName} must be a valid date.`,
      );
    }
  }

  private static cloneDate(value: Date): Date {
    AccountingJournalEntryEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }

  // ===========================================================================
  // Line Comparison
  // ===========================================================================

  private static haveSameLines(
    current: readonly AccountingJournalLineEntity[],
    replacement: readonly AccountingJournalLineEntity[],
  ): boolean {
    if (current.length !== replacement.length) {
      return false;
    }

    for (let index = 0; index < current.length; index++) {
      const currentLine = current[index];
      const replacementLine = replacement[index];

      if (currentLine === undefined || replacementLine === undefined) {
        return false;
      }

      if (!currentLine.id.equals(replacementLine.id)) {
        return false;
      }
    }

    return true;
  }
}
