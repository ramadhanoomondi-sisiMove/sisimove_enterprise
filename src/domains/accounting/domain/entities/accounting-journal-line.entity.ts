// -----------------------------------------------------------------------------
// Accounting Journal Line — Entity
// -----------------------------------------------------------------------------
//
// Represents an individual debit or credit line within an Accounting Journal
// Entry.
//
// Aggregate context:
//
// AccountingJournalAggregate
// └── AccountingJournalEntryEntity
//     └── AccountingJournalLineEntity
//
// A journal line is not an independent aggregate root.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain journal-line identity;
// - maintain journal-line public identity;
// - maintain account reference;
// - maintain debit/credit direction;
// - maintain monetary amount;
// - maintain currency;
// - maintain optional description;
// - enforce line-level invariants.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - determine whether a journal is balanced;
// - post a journal;
// - reverse a journal;
// - validate accounting periods;
// - load accounts;
// - access repositories;
// - access Prisma;
// - persist itself;
// - perform authorization.
//
// Journal balancing and posting belong to AccountingJournalAggregate.
//
// -----------------------------------------------------------------------------
//
// Accounting reference:
//
// accountId intentionally stores the internal AccountingAccount identity.
//
// The entity does not load or inspect the referenced AccountingAccount.
// Cross-aggregate reference resolution belongs to the application/domain
// workflow.
//
// -----------------------------------------------------------------------------
//
// Amount semantics:
//
// AccountingAmount represents the non-negative monetary magnitude.
//
// AccountingJournalLineType represents the accounting direction:
//
// - DEBIT
// - CREDIT
//
// Therefore the amount itself does not carry a sign.
//
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { AccountingException } from '../exceptions/accounting.exception';

import { AccountingJournalLinePublicId } from '../value-objects/accounting-journal-line-public-id.vo';
import type { AccountingJournalLineType } from '../value-objects/accounting-journal-line-type.vo';
import type { AccountingAmount } from '../value-objects/accounting-amount.vo';
import type { AccountingCurrency } from '../value-objects/accounting-currency.vo';

export interface AccountingJournalLineProps {
  accountId: UniqueEntityId;
  type: AccountingJournalLineType;
  amount: AccountingAmount;
  currency: AccountingCurrency;
  description: string | undefined;
  createdAt: Date;
  updatedAt: Date;
}

export class AccountingJournalLineEntity extends Entity<
  AccountingJournalLineProps,
  AccountingJournalLinePublicId
> {
  public constructor(
    props: AccountingJournalLineProps,
    id?: UniqueEntityId,
    publicId?: AccountingJournalLinePublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    accountId: UniqueEntityId,
    type: AccountingJournalLineType,
    amount: AccountingAmount,
    currency: AccountingCurrency,
    description: string | undefined = undefined,
    createdAt: Date = new Date(),
  ): AccountingJournalLineEntity {
    AccountingJournalLineEntity.ensureAccountId(accountId);
    AccountingJournalLineEntity.ensureType(type);
    AccountingJournalLineEntity.ensureAmount(amount);
    AccountingJournalLineEntity.ensureCurrency(currency);
    AccountingJournalLineEntity.ensureDescription(description);

    AccountingJournalLineEntity.ensureValidDate(createdAt, 'creation date');

    const timestamp = AccountingJournalLineEntity.cloneDate(createdAt);

    const entity = new AccountingJournalLineEntity(
      {
        accountId,
        type,
        amount,
        currency,
        description:
          AccountingJournalLineEntity.normalizeDescription(description),
        createdAt: timestamp,
        updatedAt: AccountingJournalLineEntity.cloneDate(timestamp),
      },
      new UniqueEntityId(),
      new AccountingJournalLinePublicId(),
    );

    entity.validateInvariants();

    return entity;
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: AccountingJournalLineProps,
    id: UniqueEntityId,
    publicId: AccountingJournalLinePublicId,
  ): AccountingJournalLineEntity {
    if (props === undefined) {
      throw new AccountingException(
        'Accounting journal line properties are required for rehydration.',
      );
    }

    if (id === undefined) {
      throw new AccountingException(
        'Accounting journal line internal identity is required for rehydration.',
      );
    }

    if (publicId === undefined) {
      throw new AccountingException(
        'Accounting journal line public identity is required for rehydration.',
      );
    }

    AccountingJournalLineEntity.ensureAccountId(props.accountId);

    AccountingJournalLineEntity.ensureType(props.type);

    AccountingJournalLineEntity.ensureAmount(props.amount);

    AccountingJournalLineEntity.ensureCurrency(props.currency);

    AccountingJournalLineEntity.ensureDescription(props.description);

    AccountingJournalLineEntity.ensureValidDate(
      props.createdAt,
      'creation date',
    );

    AccountingJournalLineEntity.ensureValidDate(
      props.updatedAt,
      'updated date',
    );

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting journal line updated date cannot be before creation date.',
      );
    }

    const entity = new AccountingJournalLineEntity(
      {
        accountId: props.accountId,
        type: props.type,
        amount: props.amount,
        currency: props.currency,
        description: AccountingJournalLineEntity.normalizeDescription(
          props.description,
        ),
        createdAt: AccountingJournalLineEntity.cloneDate(props.createdAt),
        updatedAt: AccountingJournalLineEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );

    entity.validateInvariants();

    return entity;
  }

  // ---------------------------------------------------------------------------
  // Account
  // ---------------------------------------------------------------------------

  public get accountId(): UniqueEntityId {
    return this.props.accountId;
  }

  public referencesAccount(accountId: UniqueEntityId): boolean {
    AccountingJournalLineEntity.ensureAccountId(accountId);

    return this.props.accountId.equals(accountId);
  }

  public changeAccount(accountId: UniqueEntityId): void {
    AccountingJournalLineEntity.ensureAccountId(accountId);

    if (this.props.accountId.equals(accountId)) {
      return;
    }

    this.props.accountId = accountId;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Type
  // ---------------------------------------------------------------------------

  public get type(): AccountingJournalLineType {
    return this.props.type;
  }

  public get isDebit(): boolean {
    return this.props.type.isDebit();
  }

  public get isCredit(): boolean {
    return this.props.type.isCredit();
  }

  public changeType(type: AccountingJournalLineType): void {
    AccountingJournalLineEntity.ensureType(type);

    if (this.props.type.equals(type)) {
      return;
    }

    this.props.type = type;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Amount
  // ---------------------------------------------------------------------------

  public get amount(): AccountingAmount {
    return this.props.amount;
  }

  public isZero(): boolean {
    return this.props.amount.isZero();
  }

  public isPositive(): boolean {
    return this.props.amount.isPositive();
  }

  public changeAmount(amount: AccountingAmount): void {
    AccountingJournalLineEntity.ensureAmount(amount);

    if (this.props.amount.equals(amount)) {
      return;
    }

    this.props.amount = amount;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Currency
  // ---------------------------------------------------------------------------

  public get currency(): AccountingCurrency {
    return this.props.currency;
  }

  public isKes(): boolean {
    return this.props.currency.isKes();
  }

  public changeCurrency(currency: AccountingCurrency): void {
    AccountingJournalLineEntity.ensureCurrency(currency);

    if (this.props.currency.equals(currency)) {
      return;
    }

    this.props.currency = currency;

    this.touch();
  }

  // ---------------------------------------------------------------------------
  // Description
  // ---------------------------------------------------------------------------

  public get description(): string | undefined {
    return this.props.description;
  }

  public hasDescription(): boolean {
    return this.props.description !== undefined;
  }

  public changeDescription(description: string | undefined): void {
    AccountingJournalLineEntity.ensureDescription(description);

    const normalized =
      AccountingJournalLineEntity.normalizeDescription(description);

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

  // ---------------------------------------------------------------------------
  // Timestamps
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return AccountingJournalLineEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return AccountingJournalLineEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    AccountingJournalLineEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = AccountingJournalLineEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting journal line updated date cannot be before creation date.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ---------------------------------------------------------------------------
  // Invariants
  // ---------------------------------------------------------------------------

  private validateInvariants(): void {
    AccountingJournalLineEntity.ensureAccountId(this.props.accountId);

    AccountingJournalLineEntity.ensureType(this.props.type);

    AccountingJournalLineEntity.ensureAmount(this.props.amount);

    AccountingJournalLineEntity.ensureCurrency(this.props.currency);

    AccountingJournalLineEntity.ensureDescription(this.props.description);

    AccountingJournalLineEntity.ensureValidDate(
      this.props.createdAt,
      'creation date',
    );

    AccountingJournalLineEntity.ensureValidDate(
      this.props.updatedAt,
      'updated date',
    );

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting journal line updated date cannot be before creation date.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Guards
  // ---------------------------------------------------------------------------

  private static ensureAccountId(accountId: UniqueEntityId): void {
    if (accountId === undefined || !(accountId instanceof UniqueEntityId)) {
      throw new AccountingException(
        'Accounting journal line account identity must be a valid internal entity identity.',
      );
    }
  }

  private static ensureType(type: AccountingJournalLineType): void {
    if (type === undefined) {
      throw new AccountingException(
        'Accounting journal line type is required.',
      );
    }
  }

  private static ensureAmount(amount: AccountingAmount): void {
    if (amount === undefined) {
      throw new AccountingException(
        'Accounting journal line amount is required.',
      );
    }
  }

  private static ensureCurrency(currency: AccountingCurrency): void {
    if (currency === undefined) {
      throw new AccountingException(
        'Accounting journal line currency is required.',
      );
    }
  }

  private static ensureDescription(description: string | undefined): void {
    if (description !== undefined && typeof description !== 'string') {
      throw new AccountingException(
        'Accounting journal line description must be a string.',
      );
    }

    if (description !== undefined && description.trim().length > 1000) {
      throw new AccountingException(
        'Accounting journal line description cannot exceed 1000 characters.',
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

  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AccountingException(
        `Accounting journal line ${fieldName} must be a valid date.`,
      );
    }
  }

  private static cloneDate(value: Date): Date {
    AccountingJournalLineEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
