// -----------------------------------------------------------------------------
// Accounting — Journal Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the AccountingJournalAggregate and its aggregate-internal entities
// into application-facing Accounting Journal responses.
//
// Aggregate:
//
// AccountingJournalAggregate
// ├── AccountingJournalEntity
// ├── AccountingJournalEntryEntity[]
// │   └── AccountingJournalLineEntity[]
// └── AccountingPostingReferenceEntity?
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map AccountingJournalAggregate -> AccountingJournalResponse.
// - Map AccountingJournalEntity -> AccountingJournalResponse.
// - Map AccountingJournalEntryEntity -> AccountingJournalEntryResponse.
// - Map AccountingJournalLineEntity -> AccountingJournalLineResponse.
// - Map AccountingPostingReferenceEntity ->
//   AccountingPostingReferenceResponse.
// - Serialize Accounting value objects into primitives.
// - Expose journal lifecycle state.
// - Expose journal lifecycle capabilities.
// - Expose journal accounting totals.
// - Expose journal balance state.
// - Expose period public identity when assigned.
// - Expose posting reference when available.
// - Expose posting/reversal timestamps when available.
// - Expose aggregate entries and lines.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the Accounting Journal aggregate.
// - Persist the Accounting Journal.
// - Access Prisma.
// - Access repositories.
// - Resolve Accounting Accounts.
// - Resolve Accounting Periods.
// - Resolve source posting references.
// - Perform authorization.
// - Perform business validation.
// - Recalculate or alter accounting state.
// - Emit domain events.
//
// -----------------------------------------------------------------------------
//
// Identity:
//
// The Accounting Journal public identity is exposed through `publicId`.
//
// Internal journal identity (`id`) is intentionally excluded.
//
// The Accounting Period public identity is exposed through `periodPublicId`
// when the journal has a period reference.
//
// The internal Accounting Period identity (`periodId`) is intentionally
// excluded.
//
// Journal Entry and Journal Line public identities are exposed through their
// respective `publicId` fields.
//
// -----------------------------------------------------------------------------
//
// Account Reference:
//
// AccountingJournalLineEntity currently exposes only:
//
//     accountId: UniqueEntityId
//
// It does not contain an AccountingAccountPublicId.
//
// Therefore the mapper exposes the account reference as `accountId` using its
// current domain identity value.
//
// If AccountingJournalLineEntity is later changed to retain an
// AccountingAccountPublicId, this response mapper should be updated to expose
// the public identity instead.
//
// -----------------------------------------------------------------------------
//
// Accounting:
//
// The aggregate is the authoritative source for:
//
// - totalDebit;
// - totalCredit;
// - balanceDifference;
// - isBalanced();
// - isUnbalanced();
// - canPost();
//
// These values are mapped directly from aggregate behavior rather than
// recalculated inside the response mapper.
//
// -----------------------------------------------------------------------------
//
// Dates:
//
// All Date values are returned as defensive copies.
//
// This prevents consumers of the response object from mutating Date instances
// owned by the domain model.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import { AccountingJournalAggregate } from '../../../domain/aggregates/accounting-journal.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { AccountingJournalEntity } from '../../../domain/entities/accounting-journal.entity';

import type { AccountingJournalEntryEntity } from '../../../domain/entities/accounting-journal-entry.entity';

import type { AccountingJournalLineEntity } from '../../../domain/entities/accounting-journal-line.entity';

import type { AccountingPostingReferenceEntity } from '../../../domain/entities/accounting-posting-reference.entity';

// =============================================================================
// Response
// =============================================================================

// -----------------------------------------------------------------------------
// Journal Line Response
// -----------------------------------------------------------------------------

export interface AccountingJournalLineResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Accounting Journal Line.
   */
  publicId: string;

  // ---------------------------------------------------------------------------
  // Account
  // ---------------------------------------------------------------------------

  /**
   * Internal Accounting Account identity referenced by the journal line.
   *
   * The current AccountingJournalLineEntity exposes only the internal account
   * identity. No AccountingAccountPublicId exists on the line entity.
   */
  accountId: string;

  // ---------------------------------------------------------------------------
  // Accounting Direction
  // ---------------------------------------------------------------------------

  /**
   * Accounting journal line direction.
   *
   * Examples:
   *
   * - DEBIT
   * - CREDIT
   */
  type: string;

  /**
   * Indicates whether this is a debit line.
   */
  isDebit: boolean;

  /**
   * Indicates whether this is a credit line.
   */
  isCredit: boolean;

  // ---------------------------------------------------------------------------
  // Amount
  // ---------------------------------------------------------------------------

  /**
   * Non-negative monetary magnitude of the journal line.
   */
  amount: number;

  /**
   * Indicates whether the line amount is zero.
   */
  isZero: boolean;

  /**
   * Indicates whether the line amount is positive.
   */
  isPositive: boolean;

  // ---------------------------------------------------------------------------
  // Currency
  // ---------------------------------------------------------------------------

  /**
   * Currency used by the journal line.
   */
  currency: string;

  /**
   * Indicates whether the line uses KES.
   */
  isKes: boolean;

  // ---------------------------------------------------------------------------
  // Description
  // ---------------------------------------------------------------------------

  /**
   * Optional line description.
   */
  description?: string;

  /**
   * Indicates whether the line has a description.
   */
  hasDescription: boolean;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the journal line was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the journal line was last updated.
   */
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Journal Entry Response
// -----------------------------------------------------------------------------

export interface AccountingJournalEntryResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Accounting Journal Entry.
   */
  publicId: string;

  // ---------------------------------------------------------------------------
  // Entry
  // ---------------------------------------------------------------------------

  /**
   * Accounting date of the journal entry.
   */
  entryDate: Date;

  /**
   * Optional journal entry description.
   */
  description?: string;

  /**
   * Indicates whether the entry has a description.
   */
  hasDescription: boolean;

  // ---------------------------------------------------------------------------
  // Lines
  // ---------------------------------------------------------------------------

  /**
   * Journal lines owned by this journal entry.
   */
  lines: AccountingJournalLineResponse[];

  /**
   * Number of journal lines.
   */
  lineCount: number;

  /**
   * Indicates whether the entry contains at least one line.
   */
  hasLines: boolean;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the journal entry was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the journal entry was last updated.
   */
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Posting Reference Response
// -----------------------------------------------------------------------------

export interface AccountingPostingReferenceResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Accounting Posting Reference.
   */
  publicId: string;

  // ---------------------------------------------------------------------------
  // Source
  // ---------------------------------------------------------------------------

  /**
   * Type of source that produced the accounting posting.
   *
   * Examples:
   *
   * - BOOKING
   * - JOURNEY
   * - WALLET
   * - PAYMENT
   * - COMMISSION
   * - SETTLEMENT
   */
  sourceType: string;

  /**
   * Public identity of the originating source operation.
   */
  sourcePublicId: string;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the posting reference was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the posting reference was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Journal Response
// =============================================================================

export interface AccountingJournalResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Accounting Journal aggregate.
   */
  publicId: string;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current Accounting Journal lifecycle status.
   *
   * Examples:
   *
   * - DRAFT
   * - POSTED
   * - REVERSED
   */
  status: string;

  /**
   * Indicates whether the journal is in DRAFT state.
   */
  isDraft: boolean;

  /**
   * Indicates whether the journal is POSTED.
   */
  isPosted: boolean;

  /**
   * Indicates whether the journal is REVERSED.
   */
  isReversed: boolean;

  /**
   * Indicates whether the journal remains mutable.
   */
  isMutable: boolean;

  /**
   * Indicates whether the journal can transition to POSTED based on its
   * lifecycle state.
   *
   * This is a lifecycle capability and does not necessarily mean the journal
   * satisfies all aggregate posting requirements.
   */
  canBePosted: boolean;

  /**
   * Indicates whether the journal can be reversed.
   */
  canBeReversed: boolean;

  /**
   * Indicates whether the journal satisfies aggregate-local requirements for
   * posting.
   */
  canPost: boolean;

  // ---------------------------------------------------------------------------
  // Currency
  // ---------------------------------------------------------------------------

  /**
   * Currency used by the Accounting Journal.
   */
  currency: string;

  // ---------------------------------------------------------------------------
  // Accounting Period
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Accounting Period associated with this journal.
   *
   * Undefined when the journal has no period assignment.
   */
  periodPublicId?: string;

  /**
   * Indicates whether the journal belongs to an Accounting Period.
   */
  hasPeriod: boolean;

  // ---------------------------------------------------------------------------
  // Entries
  // ---------------------------------------------------------------------------

  /**
   * Accounting Journal Entries owned by this aggregate.
   */
  entries: AccountingJournalEntryResponse[];

  /**
   * Number of journal entries.
   */
  entryCount: number;

  /**
   * Indicates whether the journal contains entries.
   */
  hasEntries: boolean;

  // ---------------------------------------------------------------------------
  // Lines
  // ---------------------------------------------------------------------------

  /**
   * Total number of journal lines across all entries.
   */
  lineCount: number;

  /**
   * Indicates whether the journal contains at least one line.
   */
  hasLines: boolean;

  // ---------------------------------------------------------------------------
  // Debit / Credit Totals
  // ---------------------------------------------------------------------------

  /**
   * Total debit amount across all journal lines.
   */
  totalDebit: number;

  /**
   * Total credit amount across all journal lines.
   */
  totalCredit: number;

  /**
   * Difference between total debits and total credits.
   *
   * A balanced journal has a balanceDifference of zero.
   */
  balanceDifference: number;

  /**
   * Indicates whether total debits equal total credits.
   */
  isBalanced: boolean;

  /**
   * Indicates whether total debits and total credits differ.
   */
  isUnbalanced: boolean;

  // ---------------------------------------------------------------------------
  // Posting Reference
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the posting reference when one exists.
   */
  postingReferencePublicId?: string;

  /**
   * Indicates whether the journal has a posting reference.
   */
  hasPostingReference: boolean;

  /**
   * Posting reference attached to the journal, when available.
   */
  postingReference?: AccountingPostingReferenceResponse;

  // ---------------------------------------------------------------------------
  // Posting
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the journal was posted.
   *
   * Undefined while the journal has not been posted.
   */
  postedAt?: Date;

  /**
   * Timestamp at which the journal was reversed.
   *
   * Undefined while the journal has not been reversed.
   */
  reversedAt?: Date;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the journal was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the journal was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class AccountingJournalResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps an AccountingJournalAggregate into an
   * AccountingJournalResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(
    aggregate: AccountingJournalAggregate,
  ): AccountingJournalResponse {
    if (aggregate === undefined) {
      throw new Error('Accounting Journal aggregate is required.');
    }

    return this.mapJournal(aggregate);
  }

  // ===========================================================================
  // Entity -> Response
  // ===========================================================================

  /**
   * Maps an AccountingJournalEntity directly into an
   * AccountingJournalResponse.
   *
   * This method is intentionally supported for application/read workflows
   * where the aggregate wrapper is not required by the caller.
   *
   * Aggregate-level calculated values are still derived through a temporary
   * rehydrated aggregate because those calculations belong to the aggregate.
   */
  public static fromEntity(
    journal: AccountingJournalEntity,
  ): AccountingJournalResponse {
    if (journal === undefined) {
      throw new Error('Accounting Journal entity is required.');
    }

    const aggregate = AccountingJournalResponseMapper.createAggregate(journal);

    return this.mapJournal(aggregate);
  }

  // ===========================================================================
  // Journal Mapping
  // ===========================================================================

  /**
   * Maps the Accounting Journal aggregate.
   *
   * Aggregate-derived accounting values are deliberately obtained from the
   * aggregate rather than duplicated inside this mapper.
   */
  private static mapJournal(
    aggregate: AccountingJournalAggregate,
  ): AccountingJournalResponse {
    const periodPublicId = aggregate.periodPublicId;

    const postingReference = aggregate.postingReference;

    const postedAt = aggregate.journal.postedAt;

    const reversedAt = aggregate.journal.reversedAt;

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: aggregate.publicId.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: aggregate.status.value,

      isDraft: aggregate.isDraft(),

      isPosted: aggregate.isPosted(),

      isReversed: aggregate.isReversed(),

      isMutable: aggregate.isMutable(),

      canBePosted: aggregate.canBePosted(),

      canBeReversed: aggregate.canBeReversed(),

      canPost: aggregate.canPost(),

      // -----------------------------------------------------------------------
      // Currency
      // -----------------------------------------------------------------------

      currency: aggregate.currency.value,

      // -----------------------------------------------------------------------
      // Accounting Period
      // -----------------------------------------------------------------------

      ...(periodPublicId !== undefined
        ? {
            periodPublicId: periodPublicId.value,
          }
        : {}),

      hasPeriod: aggregate.hasPeriod(),

      // -----------------------------------------------------------------------
      // Entries
      // -----------------------------------------------------------------------

      entries: aggregate.entries.map((entry) => this.mapEntry(entry)),

      entryCount: aggregate.entryCount,

      hasEntries: aggregate.hasEntries(),

      // -----------------------------------------------------------------------
      // Lines
      // -----------------------------------------------------------------------

      lineCount: aggregate.lineCount,

      hasLines: aggregate.hasLines(),

      // -----------------------------------------------------------------------
      // Debit / Credit Totals
      // -----------------------------------------------------------------------

      totalDebit: aggregate.totalDebit,

      totalCredit: aggregate.totalCredit,

      balanceDifference: aggregate.balanceDifference,

      isBalanced: aggregate.isBalanced(),

      isUnbalanced: aggregate.isUnbalanced(),

      // -----------------------------------------------------------------------
      // Posting Reference
      // -----------------------------------------------------------------------

      ...(postingReference !== undefined
        ? {
            postingReferencePublicId: postingReference.publicId.value,

            hasPostingReference: true,

            postingReference: this.mapPostingReference(postingReference),
          }
        : {
            hasPostingReference: false,
          }),

      // -----------------------------------------------------------------------
      // Posting
      // -----------------------------------------------------------------------

      ...(postedAt !== undefined
        ? {
            postedAt: new Date(postedAt.getTime()),
          }
        : {}),

      // -----------------------------------------------------------------------
      // Reversal
      // -----------------------------------------------------------------------

      ...(reversedAt !== undefined
        ? {
            reversedAt: new Date(reversedAt.getTime()),
          }
        : {}),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(aggregate.journal.createdAt.getTime()),

      updatedAt: new Date(aggregate.journal.updatedAt.getTime()),
    };
  }

  // ===========================================================================
  // Entry Mapping
  // ===========================================================================

  /**
   * Maps an Accounting Journal Entry entity.
   */
  private static mapEntry(
    entry: AccountingJournalEntryEntity,
  ): AccountingJournalEntryResponse {
    const description = entry.description;

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: entry.publicId.value,

      // -----------------------------------------------------------------------
      // Entry
      // -----------------------------------------------------------------------

      entryDate: new Date(entry.entryDate.getTime()),

      ...(description !== undefined
        ? {
            description,
          }
        : {}),

      hasDescription: entry.hasDescription(),

      // -----------------------------------------------------------------------
      // Lines
      // -----------------------------------------------------------------------

      lines: entry.lines.map((line) => this.mapLine(line)),

      lineCount: entry.lineCount,

      hasLines: entry.hasLines(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(entry.createdAt.getTime()),

      updatedAt: new Date(entry.updatedAt.getTime()),
    };
  }

  // ===========================================================================
  // Line Mapping
  // ===========================================================================

  /**
   * Maps an Accounting Journal Line entity.
   *
   * The line's account reference is represented using its current internal
   * UniqueEntityId because the domain entity does not retain an
   * AccountingAccountPublicId.
   */
  private static mapLine(
    line: AccountingJournalLineEntity,
  ): AccountingJournalLineResponse {
    const description = line.description;

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: line.publicId.value,

      // -----------------------------------------------------------------------
      // Account
      // -----------------------------------------------------------------------

      accountId: line.accountId.value,

      // -----------------------------------------------------------------------
      // Accounting Direction
      // -----------------------------------------------------------------------

      type: line.type.value,

      isDebit: line.isDebit,

      isCredit: line.isCredit,

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      amount: line.amount.value,

      isZero: line.isZero(),

      isPositive: line.isPositive(),

      // -----------------------------------------------------------------------
      // Currency
      // -----------------------------------------------------------------------

      currency: line.currency.value,

      isKes: line.isKes(),

      // -----------------------------------------------------------------------
      // Description
      // -----------------------------------------------------------------------

      ...(description !== undefined
        ? {
            description,
          }
        : {}),

      hasDescription: line.hasDescription(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(line.createdAt.getTime()),

      updatedAt: new Date(line.updatedAt.getTime()),
    };
  }

  // ===========================================================================
  // Posting Reference Mapping
  // ===========================================================================

  /**
   * Maps an Accounting Posting Reference entity.
   */
  private static mapPostingReference(
    postingReference: AccountingPostingReferenceEntity,
  ): AccountingPostingReferenceResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: postingReference.publicId.value,

      // -----------------------------------------------------------------------
      // Source
      // -----------------------------------------------------------------------

      sourceType: postingReference.sourceType.value,

      sourcePublicId: postingReference.sourcePublicId,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(postingReference.createdAt.getTime()),

      updatedAt: new Date(postingReference.updatedAt.getTime()),
    };
  }

  // ===========================================================================
  // Entity -> Aggregate
  // ===========================================================================

  /**
   * Creates an AccountingJournalAggregate from an entity for the
   * entity-to-response mapping path.
   *
   * The aggregate factory performs the same aggregate invariant validation
   * expected by the domain model.
   */
  private static createAggregate(
    journal: AccountingJournalEntity,
  ): AccountingJournalAggregate {
    return AccountingJournalAggregate.rehydrate(journal);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingJournalResponseMapper;
