// -----------------------------------------------------------------------------
// Accounting Journal — Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Accounting Journal aggregate.
//
// Aggregate ownership:
//
// AccountingJournalAggregate
// ├── AccountingJournalEntity
// ├── AccountingJournalEntryEntity[]
// │   └── AccountingJournalLineEntity[]
// └── AccountingPostingReferenceEntity?
//
// Responsibilities:
//
// - persist AccountingJournalAggregate;
// - retrieve AccountingJournalAggregate;
// - retrieve AccountingJournalEntity when explicitly required;
// - query journals by identity;
// - query journals by status;
// - query journals by currency;
// - query journals by Accounting Period reference;
// - query journals by posting reference;
// - query journals by lifecycle state;
// - query journals by posting/reversal timestamps;
// - query journals by audit timestamps;
// - provide existence checks.
//
// The repository is persistence-technology agnostic.
//
// It MUST NOT:
//
// - depend on Prisma or any ORM;
// - expose persistence models;
// - construct persistence records;
// - validate AccountingAccountAggregate;
// - validate AccountingPeriodAggregate;
// - determine whether an Accounting Period is open;
// - determine whether an Accounting Account exists;
// - calculate or mutate journal balances;
// - post or reverse journals;
// - authorize journal operations;
// - record domain events;
// - publish domain events;
// - communicate with external systems.
//
// Aggregate boundaries:
//
// AccountingJournalAggregate owns the complete journal consistency boundary:
//
// AccountingJournalAggregate
// ├── AccountingJournalEntity
// ├── AccountingJournalEntryEntity[]
// │   └── AccountingJournalLineEntity[]
// └── AccountingPostingReferenceEntity?
//
// Cross-aggregate references such as periodId, periodPublicId and accountId
// remain opaque references at the repository boundary.
//
// Validation involving Accounting Account or Accounting Period aggregates
// belongs to the application/domain workflow.
//
// Persistence uniqueness is expected to be enforced by the persistence layer
// according to the accounting schema.
//
// -----------------------------------------------------------------------------
//
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Accounting — Aggregate
// -----------------------------------------------------------------------------

import type { AccountingJournalAggregate } from '../aggregates/accounting-journal.aggregate';

// -----------------------------------------------------------------------------
// Accounting — Entity
// -----------------------------------------------------------------------------

import type { AccountingJournalEntity } from '../entities/accounting-journal.entity';

// -----------------------------------------------------------------------------
// Accounting — Value Objects
// -----------------------------------------------------------------------------

import type { AccountingCurrency } from '../value-objects/accounting-currency.vo';
import type { AccountingJournalPublicId } from '../value-objects/accounting-journal-public-id.vo';
import type { AccountingJournalStatus } from '../value-objects/accounting-journal-status.vo';
import type { AccountingPeriodPublicId } from '../value-objects/accounting-period-public-id.vo';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

/**
 * Repository contract for the Accounting Journal aggregate.
 *
 * Implementations belong to the infrastructure layer.
 *
 * The domain layer depends only on this contract and remains independent
 * from Prisma, SQL, persistence schemas, and other infrastructure concerns.
 */
export interface AccountingJournalRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists an Accounting Journal aggregate.
   *
   * The implementation determines whether the operation results in an
   * insert or update.
   */
  save(aggregate: AccountingJournalAggregate): Promise<void>;

  /**
   * Deletes an Accounting Journal aggregate.
   *
   * Business rules governing whether deletion is permitted belong to the
   * application/domain workflow.
   */
  delete(aggregate: AccountingJournalAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries — Identity
  // ===========================================================================

  /**
   * Finds an Accounting Journal aggregate by public identity.
   */
  findByPublicId(
    publicId: AccountingJournalPublicId,
  ): Promise<AccountingJournalAggregate | null>;

  /**
   * Finds an Accounting Journal aggregate by internal identity.
   */
  findById(id: UniqueEntityId): Promise<AccountingJournalAggregate | null>;

  // ===========================================================================
  // Aggregate Queries — Status
  // ===========================================================================

  /**
   * Finds Accounting Journal aggregates by explicit status.
   */
  findByStatus(
    status: AccountingJournalStatus,
  ): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds all DRAFT Accounting Journal aggregates.
   */
  findDraft(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds all POSTED Accounting Journal aggregates.
   */
  findPosted(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds all REVERSED Accounting Journal aggregates.
   */
  findReversed(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds all mutable DRAFT journals.
   */
  findMutable(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds all journals that are not mutable.
   */
  findImmutable(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals that are eligible for posting based on persisted
   * aggregate state.
   *
   * Complete posting validation remains an aggregate concern.
   */
  findPostingEligible(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals that are not currently eligible for posting based on
   * persisted aggregate state.
   */
  findPostingIneligible(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals that are eligible for reversal based on persisted
   * aggregate state.
   */
  findReversalEligible(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals that are not currently eligible for reversal.
   */
  findReversalIneligible(): Promise<AccountingJournalAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Currency
  // ===========================================================================

  /**
   * Finds journals using the supplied accounting currency.
   */
  findByCurrency(
    currency: AccountingCurrency,
  ): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals using a currency other than the supplied currency.
   */
  findNotByCurrency(
    currency: AccountingCurrency,
  ): Promise<AccountingJournalAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Accounting Period
  // ===========================================================================

  /**
   * Finds journals assigned to an Accounting Period by internal identity.
   *
   * The repository treats the period identity as an opaque cross-aggregate
   * reference.
   */
  findByPeriodId(
    periodId: UniqueEntityId,
  ): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals assigned to an Accounting Period by public identity.
   */
  findByPeriodPublicId(
    periodPublicId: AccountingPeriodPublicId,
  ): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals that have no Accounting Period assigned.
   */
  findWithoutPeriod(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals that have an Accounting Period assigned.
   */
  findWithPeriod(): Promise<AccountingJournalAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Posting Reference
  // ===========================================================================

  /**
   * Finds journals associated with a posting reference public identity.
   */
  findByPostingReferencePublicId(
    postingReferencePublicId: string,
  ): Promise<AccountingJournalAggregate | null>;

  /**
   * Finds journals that contain a posting reference.
   */
  findWithPostingReference(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals that do not contain a posting reference.
   */
  findWithoutPostingReference(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals associated with a source type from the posting reference.
   */
  findByPostingSourceType(
    sourceType: string,
  ): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals associated with a source identity from the posting
   * reference.
   */
  findByPostingSourcePublicId(
    sourcePublicId: string,
  ): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals associated with both a posting source type and source
   * public identity.
   */
  findByPostingSource(
    sourceType: string,
    sourcePublicId: string,
  ): Promise<AccountingJournalAggregate[]>;

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds the Accounting Journal entity by public identity.
   *
   * Aggregate-level behavior should normally use aggregate queries.
   */
  findEntityByPublicId(
    publicId: AccountingJournalPublicId,
  ): Promise<AccountingJournalEntity | null>;

  /**
   * Finds the Accounting Journal entity by internal identity.
   */
  findEntityById(id: UniqueEntityId): Promise<AccountingJournalEntity | null>;

  /**
   * Finds Accounting Journal entities by explicit status.
   */
  findEntitiesByStatus(
    status: AccountingJournalStatus,
  ): Promise<AccountingJournalEntity[]>;

  // ===========================================================================
  // Posting / Reversal Timestamp Queries
  // ===========================================================================

  /**
   * Finds journals posted after the supplied timestamp.
   */
  findPostedAfter(postedAfter: Date): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals posted before the supplied timestamp.
   */
  findPostedBefore(postedBefore: Date): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals reversed after the supplied timestamp.
   */
  findReversedAfter(reversedAfter: Date): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals reversed before the supplied timestamp.
   */
  findReversedBefore(
    reversedBefore: Date,
  ): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals that have been posted but not reversed.
   */
  findPostedNotReversed(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals that have been reversed.
   */
  findWithReversal(): Promise<AccountingJournalAggregate[]>;

  // ===========================================================================
  // Audit Queries
  // ===========================================================================

  /**
   * Finds journals created after the supplied timestamp.
   */
  findCreatedAfter(createdAfter: Date): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals created before the supplied timestamp.
   */
  findCreatedBefore(createdBefore: Date): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals updated after the supplied timestamp.
   */
  findUpdatedAfter(updatedAfter: Date): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds journals updated before the supplied timestamp.
   */
  findUpdatedBefore(updatedBefore: Date): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds all journals ordered by creation timestamp.
   */
  findAllOrderedByCreatedAt(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds all journals ordered by posting timestamp.
   */
  findAllOrderedByPostedAt(): Promise<AccountingJournalAggregate[]>;

  /**
   * Finds all journals ordered by entry/journal chronology.
   *
   * The persistence implementation should use the journal creation or
   * equivalent deterministic chronology available to it.
   */
  findAllOrderedByCreatedAtDescending(): Promise<AccountingJournalAggregate[]>;

  // ===========================================================================
  // Existence Queries — Identity
  // ===========================================================================

  /**
   * Determines whether a journal exists by public identity.
   */
  existsByPublicId(publicId: AccountingJournalPublicId): Promise<boolean>;

  /**
   * Determines whether a journal exists by internal identity.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Existence Queries — Status
  // ===========================================================================

  /**
   * Determines whether any journal exists with the supplied status.
   */
  existsByStatus(status: AccountingJournalStatus): Promise<boolean>;

  /**
   * Determines whether at least one DRAFT journal exists.
   */
  existsDraft(): Promise<boolean>;

  /**
   * Determines whether at least one POSTED journal exists.
   */
  existsPosted(): Promise<boolean>;

  /**
   * Determines whether at least one REVERSED journal exists.
   */
  existsReversed(): Promise<boolean>;

  /**
   * Determines whether at least one mutable journal exists.
   */
  existsMutable(): Promise<boolean>;

  /**
   * Determines whether at least one posting-eligible journal exists.
   */
  existsPostingEligible(): Promise<boolean>;

  /**
   * Determines whether at least one reversal-eligible journal exists.
   */
  existsReversalEligible(): Promise<boolean>;

  // ===========================================================================
  // Existence Queries — Currency
  // ===========================================================================

  /**
   * Determines whether at least one journal exists using the supplied
   * currency.
   */
  existsByCurrency(currency: AccountingCurrency): Promise<boolean>;

  // ===========================================================================
  // Existence Queries — Accounting Period
  // ===========================================================================

  /**
   * Determines whether at least one journal references the supplied
   * Accounting Period internal identity.
   */
  existsByPeriodId(periodId: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether at least one journal references the supplied
   * Accounting Period public identity.
   */
  existsByPeriodPublicId(
    periodPublicId: AccountingPeriodPublicId,
  ): Promise<boolean>;

  /**
   * Determines whether at least one journal has no period assigned.
   */
  existsWithoutPeriod(): Promise<boolean>;

  /**
   * Determines whether at least one journal has a period assigned.
   */
  existsWithPeriod(): Promise<boolean>;

  // ===========================================================================
  // Existence Queries — Posting Reference
  // ===========================================================================

  /**
   * Determines whether a journal exists with the supplied posting reference
   * public identity.
   */
  existsByPostingReferencePublicId(
    postingReferencePublicId: string,
  ): Promise<boolean>;

  /**
   * Determines whether at least one journal has a posting reference.
   */
  existsWithPostingReference(): Promise<boolean>;

  /**
   * Determines whether at least one journal has no posting reference.
   */
  existsWithoutPostingReference(): Promise<boolean>;

  /**
   * Determines whether at least one journal exists for the supplied posting
   * source.
   */
  existsByPostingSource(
    sourceType: string,
    sourcePublicId: string,
  ): Promise<boolean>;

  // ===========================================================================
  // Existence Queries — Posting / Reversal
  // ===========================================================================

  /**
   * Determines whether at least one journal was posted after the supplied
   * timestamp.
   */
  existsPostedAfter(postedAfter: Date): Promise<boolean>;

  /**
   * Determines whether at least one journal was posted before the supplied
   * timestamp.
   */
  existsPostedBefore(postedBefore: Date): Promise<boolean>;

  /**
   * Determines whether at least one journal was reversed after the supplied
   * timestamp.
   */
  existsReversedAfter(reversedAfter: Date): Promise<boolean>;

  /**
   * Determines whether at least one journal was reversed before the supplied
   * timestamp.
   */
  existsReversedBefore(reversedBefore: Date): Promise<boolean>;

  /**
   * Determines whether at least one posted journal has not been reversed.
   */
  existsPostedNotReversed(): Promise<boolean>;

  /**
   * Determines whether at least one reversed journal exists.
   */
  existsWithReversal(): Promise<boolean>;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingJournalRepository;
