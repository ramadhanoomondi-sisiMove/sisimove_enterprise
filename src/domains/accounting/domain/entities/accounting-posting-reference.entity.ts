// -----------------------------------------------------------------------------
// Accounting Posting Reference — Entity
// -----------------------------------------------------------------------------
//
// Represents the source reference attached to an Accounting Journal.
//
// Aggregate context:
//
// AccountingJournalAggregate
// └── AccountingPostingReferenceEntity
//
// A posting reference identifies the external/domain operation that caused a
// journal to be posted.
//
// Examples:
//
// - BOOKING
// - JOURNEY
// - WALLET
// - PAYMENT
// - COMMISSION
// - SETTLEMENT
//
// sourceType remains a string rather than a closed enum because the Accounting
// Kernel should not need to know every business domain that can produce an
// accounting posting.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - maintain posting-reference identity;
// - maintain posting-reference public identity;
// - maintain source type;
// - maintain source public identity;
// - enforce reference-level invariants.
//
// -----------------------------------------------------------------------------
//
// This entity does NOT:
//
// - resolve the source entity;
// - access another domain;
// - access repositories;
// - access Prisma;
// - post journals;
// - reverse journals;
// - determine whether a source operation is valid;
// - perform authorization.
//
// The reference is an accounting traceability mechanism only.
//
// -----------------------------------------------------------------------------

import { Entity } from '../../../../foundation/kernel/domain/entity';
import { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

import { AccountingException } from '../exceptions/accounting.exception';

import { AccountingPostingReferencePublicId } from '../value-objects/accounting-posting-reference-public-id.vo';
import type { AccountingSourceType } from '../value-objects/accounting-source-type.vo';

export interface AccountingPostingReferenceProps {
  sourceType: AccountingSourceType;
  sourcePublicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class AccountingPostingReferenceEntity extends Entity<
  AccountingPostingReferenceProps,
  AccountingPostingReferencePublicId
> {
  public constructor(
    props: AccountingPostingReferenceProps,
    id?: UniqueEntityId,
    publicId?: AccountingPostingReferencePublicId,
  ) {
    super(props, id, publicId);
  }

  // ---------------------------------------------------------------------------
  // Factory
  // ---------------------------------------------------------------------------

  public static create(
    sourceType: AccountingSourceType,
    sourcePublicId: string,
    createdAt: Date = new Date(),
  ): AccountingPostingReferenceEntity {
    AccountingPostingReferenceEntity.ensureSourceType(sourceType);

    AccountingPostingReferenceEntity.ensureSourcePublicId(sourcePublicId);

    AccountingPostingReferenceEntity.ensureValidDate(
      createdAt,
      'creation date',
    );

    const timestamp = AccountingPostingReferenceEntity.cloneDate(createdAt);

    const entity = new AccountingPostingReferenceEntity(
      {
        sourceType,
        sourcePublicId:
          AccountingPostingReferenceEntity.normalizeSourcePublicId(
            sourcePublicId,
          ),
        createdAt: timestamp,
        updatedAt: AccountingPostingReferenceEntity.cloneDate(timestamp),
      },
      new UniqueEntityId(),
      new AccountingPostingReferencePublicId(),
    );

    entity.validateInvariants();

    return entity;
  }

  // ---------------------------------------------------------------------------
  // Rehydration
  // ---------------------------------------------------------------------------

  public static rehydrate(
    props: AccountingPostingReferenceProps,
    id: UniqueEntityId,
    publicId: AccountingPostingReferencePublicId,
  ): AccountingPostingReferenceEntity {
    if (props === undefined) {
      throw new AccountingException(
        'Accounting posting reference properties are required for rehydration.',
      );
    }

    if (id === undefined) {
      throw new AccountingException(
        'Accounting posting reference internal identity is required for rehydration.',
      );
    }

    if (publicId === undefined) {
      throw new AccountingException(
        'Accounting posting reference public identity is required for rehydration.',
      );
    }

    AccountingPostingReferenceEntity.ensureSourceType(props.sourceType);

    AccountingPostingReferenceEntity.ensureSourcePublicId(props.sourcePublicId);

    AccountingPostingReferenceEntity.ensureValidDate(
      props.createdAt,
      'creation date',
    );

    AccountingPostingReferenceEntity.ensureValidDate(
      props.updatedAt,
      'updated date',
    );

    if (props.updatedAt.getTime() < props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting posting reference updated date cannot be before creation date.',
      );
    }

    const entity = new AccountingPostingReferenceEntity(
      {
        sourceType: props.sourceType,
        sourcePublicId:
          AccountingPostingReferenceEntity.normalizeSourcePublicId(
            props.sourcePublicId,
          ),
        createdAt: AccountingPostingReferenceEntity.cloneDate(props.createdAt),
        updatedAt: AccountingPostingReferenceEntity.cloneDate(props.updatedAt),
      },
      id,
      publicId,
    );

    entity.validateInvariants();

    return entity;
  }

  // ---------------------------------------------------------------------------
  // Source
  // ---------------------------------------------------------------------------

  public get sourceType(): AccountingSourceType {
    return this.props.sourceType;
  }

  public get sourcePublicId(): string {
    return this.props.sourcePublicId;
  }

  public references(
    sourceType: AccountingSourceType,
    sourcePublicId: string,
  ): boolean {
    AccountingPostingReferenceEntity.ensureSourceType(sourceType);

    AccountingPostingReferenceEntity.ensureSourcePublicId(sourcePublicId);

    return (
      this.props.sourceType.equals(sourceType) &&
      this.props.sourcePublicId ===
        AccountingPostingReferenceEntity.normalizeSourcePublicId(sourcePublicId)
    );
  }

  public changeSource(
    sourceType: AccountingSourceType,
    sourcePublicId: string,
  ): void {
    AccountingPostingReferenceEntity.ensureSourceType(sourceType);

    AccountingPostingReferenceEntity.ensureSourcePublicId(sourcePublicId);

    const normalizedSourcePublicId =
      AccountingPostingReferenceEntity.normalizeSourcePublicId(sourcePublicId);

    const sourceTypeChanged = !this.props.sourceType.equals(sourceType);

    const sourcePublicIdChanged =
      this.props.sourcePublicId !== normalizedSourcePublicId;

    if (!sourceTypeChanged && !sourcePublicIdChanged) {
      return;
    }

    this.props.sourceType = sourceType;
    this.props.sourcePublicId = normalizedSourcePublicId;

    this.touch();
  }

  public referencesSourceType(sourceType: AccountingSourceType): boolean {
    AccountingPostingReferenceEntity.ensureSourceType(sourceType);

    return this.props.sourceType.equals(sourceType);
  }

  // ---------------------------------------------------------------------------
  // Timestamps
  // ---------------------------------------------------------------------------

  public get createdAt(): Date {
    return AccountingPostingReferenceEntity.cloneDate(this.props.createdAt);
  }

  public get updatedAt(): Date {
    return AccountingPostingReferenceEntity.cloneDate(this.props.updatedAt);
  }

  public setUpdatedAt(updatedAt: Date): void {
    AccountingPostingReferenceEntity.ensureValidDate(updatedAt, 'updated date');

    const timestamp = AccountingPostingReferenceEntity.cloneDate(updatedAt);

    if (timestamp.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting posting reference updated date cannot be before creation date.',
      );
    }

    this.props.updatedAt = timestamp;
  }

  // ---------------------------------------------------------------------------
  // Invariants
  // ---------------------------------------------------------------------------

  private validateInvariants(): void {
    AccountingPostingReferenceEntity.ensureSourceType(this.props.sourceType);

    AccountingPostingReferenceEntity.ensureSourcePublicId(
      this.props.sourcePublicId,
    );

    AccountingPostingReferenceEntity.ensureValidDate(
      this.props.createdAt,
      'creation date',
    );

    AccountingPostingReferenceEntity.ensureValidDate(
      this.props.updatedAt,
      'updated date',
    );

    if (this.props.updatedAt.getTime() < this.props.createdAt.getTime()) {
      throw new AccountingException(
        'Accounting posting reference updated date cannot be before creation date.',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Guards
  // ---------------------------------------------------------------------------

  private static ensureSourceType(sourceType: AccountingSourceType): void {
    if (sourceType === undefined) {
      throw new AccountingException(
        'Accounting posting reference source type is required.',
      );
    }
  }

  private static ensureSourcePublicId(sourcePublicId: string): void {
    if (
      typeof sourcePublicId !== 'string' ||
      sourcePublicId.trim().length === 0
    ) {
      throw new AccountingException(
        'Accounting posting reference source public identity is required.',
      );
    }

    if (sourcePublicId.trim().length > 255) {
      throw new AccountingException(
        'Accounting posting reference source public identity cannot exceed 255 characters.',
      );
    }
  }

  private static normalizeSourcePublicId(sourcePublicId: string): string {
    return sourcePublicId.trim();
  }

  private static ensureValidDate(value: Date, fieldName: string): void {
    if (!(value instanceof Date) || !Number.isFinite(value.getTime())) {
      throw new AccountingException(
        `Accounting posting reference ${fieldName} must be a valid date.`,
      );
    }
  }

  private static cloneDate(value: Date): Date {
    AccountingPostingReferenceEntity.ensureValidDate(value, 'date');

    return new Date(value.getTime());
  }
}
