// -----------------------------------------------------------------------------
// Accounting Journal — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Accounting Journal aggregate:
//
// AccountingJournalAggregate
// └── AccountingJournalEntity
//     ├── AccountingJournalEntryEntity[]
//     │   └── AccountingJournalLineEntity[]
//     └── AccountingPostingReferenceEntity?
//
// Persistence:
//
// AccountingJournal
//   ├── AccountingJournalEntry[]
//   │   └── AccountingJournalLine[]
//   └── AccountingPostingReference?
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - map Prisma AccountingJournal records into the domain;
// - rehydrate the complete AccountingJournal aggregate;
// - rehydrate journal entries;
// - rehydrate journal lines;
// - rehydrate the optional posting reference;
// - preserve internal identities;
// - preserve public identities;
// - translate Prisma enum values into domain value objects;
// - translate domain value objects into Prisma enum/primitive values;
// - translate Prisma null values into domain undefined values;
// - translate domain undefined values into Prisma null values;
// - preserve period references;
// - preserve posting/reversal timestamps;
// - preserve audit timestamps;
// - persist the complete aggregate graph.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// The domain aggregate owns:
//
// Journal
//   -> Entries
//      -> Lines
//   -> Posting Reference
//
// Prisma additionally requires:
//
// AccountingJournalEntry.journalId
// AccountingJournalLine.entryId
//
// Those foreign keys are NOT represented as domain properties.
//
// The mapper establishes them only at the persistence boundary.
//
// -----------------------------------------------------------------------------
//
// Period reference:
//
// Domain:
//
// periodId: UniqueEntityId | undefined
// periodPublicId: AccountingPeriodPublicId | undefined
//
// Prisma:
//
// periodId: string | null
//
// periodPublicId is NOT persisted on AccountingJournal.
//
// The public period identity is reconstructed from the loaded AccountingPeriod
// relation.
//
// -----------------------------------------------------------------------------
//
// Posting reference:
//
// AccountingPostingReference is a separate Prisma model with:
//
// journalId String @unique
//
// The optional relation is therefore mapped as an aggregate-owned entity.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// No Account aggregate is loaded.
//
// accountId on AccountingJournalLineEntity remains an opaque internal identity.
//
// No AccountingPeriod aggregate is loaded.
//
// Only the period identity/reference required by the journal aggregate is
// reconstructed.
//
// -----------------------------------------------------------------------------
//
// Strict typing:
//
// No `any` is used.
// Prisma-generated property types are preserved wherever possible.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type {
  AccountingJournal as PrismaAccountingJournal,
  AccountingJournalEntry as PrismaAccountingJournalEntry,
  AccountingJournalLine as PrismaAccountingJournalLine,
  AccountingPostingReference as PrismaAccountingPostingReference,
  AccountingPeriod as PrismaAccountingPeriod,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Accounting — Aggregate
// -----------------------------------------------------------------------------

import { AccountingJournalAggregate } from '../../../../domain/aggregates/accounting-journal.aggregate';

// -----------------------------------------------------------------------------
// Accounting — Entities
// -----------------------------------------------------------------------------

import { AccountingJournalEntity } from '../../../../domain/entities/accounting-journal.entity';

import { AccountingJournalEntryEntity } from '../../../../domain/entities/accounting-journal-entry.entity';

import { AccountingJournalLineEntity } from '../../../../domain/entities/accounting-journal-line.entity';

import { AccountingPostingReferenceEntity } from '../../../../domain/entities/accounting-posting-reference.entity';

// -----------------------------------------------------------------------------
// Accounting — Value Objects
// -----------------------------------------------------------------------------

import {
  AccountingJournalPublicId,
  AccountingJournalEntryPublicId,
  AccountingJournalLinePublicId,
  AccountingPostingReferencePublicId,
  AccountingPeriodPublicId,
  AccountingJournalStatus,
  AccountingJournalLineType,
  AccountingAmount,
  AccountingCurrency,
  AccountingSourceType,
} from '../../../../domain/value-objects';

// =============================================================================
// Persistence Types
// =============================================================================

export interface AccountingJournalPersistence {
  journal: ReturnType<
    typeof AccountingJournalPrismaMapper.journalToPersistence
  >;
}

// =============================================================================
// Prisma Relation Types
// =============================================================================

/**
 * Prisma Accounting Journal record required to rehydrate the complete
 * Accounting Journal aggregate.
 *
 * Required relations:
 *
 * - entries
 * - entries.lines
 * - postingReference
 * - period
 */
export type AccountingJournalWithRelations = PrismaAccountingJournal & {
  entries: Array<
    PrismaAccountingJournalEntry & {
      lines: PrismaAccountingJournalLine[];
    }
  >;

  postingReference: PrismaAccountingPostingReference | null;

  period: PrismaAccountingPeriod | null;
};

// =============================================================================
// Persistence Graph Types
// =============================================================================

export type AccountingJournalPersistenceGraph = {
  id: string;
  publicId: string;

  status: PrismaAccountingJournal['status'];

  currency: PrismaAccountingJournal['currency'];

  periodId: string | null;

  postedAt: Date | null;

  reversedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;

  entries: Array<{
    id: string;
    publicId: string;

    journalId: string;

    entryDate: Date;

    description: string | null;

    createdAt: Date;

    updatedAt: Date;

    lines: Array<{
      id: string;
      publicId: string;

      entryId: string;

      accountId: string;

      type: PrismaAccountingJournalLine['type'];

      amount: PrismaAccountingJournalLine['amount'];

      currency: PrismaAccountingJournalLine['currency'];

      description: string | null;

      createdAt: Date;

      updatedAt: Date;
    }>;
  }>;

  postingReference:
    | {
        id: string;
        publicId: string;

        journalId: string;

        sourceType: PrismaAccountingPostingReference['sourceType'];

        sourcePublicId: PrismaAccountingPostingReference['sourcePublicId'];

        createdAt: Date;

        updatedAt: Date;
      }
    | undefined;
};

// =============================================================================
// Mapper
// =============================================================================

export class AccountingJournalPrismaMapper {
  // ===========================================================================
  // Aggregate → Domain
  // ===========================================================================

  /**
   * Rehydrates the complete Accounting Journal aggregate.
   */
  public static toDomain(
    record: AccountingJournalWithRelations,
  ): AccountingJournalAggregate {
    if (record === undefined || record === null) {
      throw new Error('Accounting Journal Prisma record is required.');
    }

    return AccountingJournalAggregate.rehydrate(this.journalToDomain(record));
  }

  // ===========================================================================
  // Journal → Domain
  // ===========================================================================

  /**
   * Maps the Prisma AccountingJournal root and all aggregate-owned
   * components into the AccountingJournalEntity.
   */
  public static journalToDomain(
    record: AccountingJournalWithRelations,
  ): AccountingJournalEntity {
    if (record === undefined || record === null) {
      throw new Error('Accounting Journal Prisma record is required.');
    }

    // -------------------------------------------------------------------------
    // Period reference
    // -------------------------------------------------------------------------

    const periodId =
      record.periodId !== null
        ? new UniqueEntityId(record.periodId)
        : undefined;

    const periodPublicId =
      record.period !== null
        ? new AccountingPeriodPublicId(record.period.publicId)
        : undefined;

    // -------------------------------------------------------------------------
    // Entries
    // -------------------------------------------------------------------------

    const entries = record.entries.map((entry) => this.entryToDomain(entry));

    // -------------------------------------------------------------------------
    // Posting Reference
    // -------------------------------------------------------------------------

    const postingReference =
      record.postingReference !== null
        ? this.postingReferenceToDomain(record.postingReference)
        : undefined;

    // -------------------------------------------------------------------------
    // Rehydrate journal
    // -------------------------------------------------------------------------

    return AccountingJournalEntity.rehydrate(
      {
        status: AccountingJournalStatus.create(record.status),

        currency: AccountingCurrency.create(record.currency),

        periodId,

        periodPublicId,

        entries,

        postingReference,

        postedAt:
          record.postedAt !== null
            ? new Date(record.postedAt.getTime())
            : undefined,

        reversedAt:
          record.reversedAt !== null
            ? new Date(record.reversedAt.getTime())
            : undefined,

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      new UniqueEntityId(record.id),

      new AccountingJournalPublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Entry → Domain
  // ===========================================================================

  /**
   * Maps a Prisma AccountingJournalEntry into an
   * aggregate-internal AccountingJournalEntryEntity.
   *
   * journalId is intentionally not mapped because the domain entity does not
   * own the persistence foreign key.
   */
  public static entryToDomain(
    record: PrismaAccountingJournalEntry & {
      lines: PrismaAccountingJournalLine[];
    },
  ): AccountingJournalEntryEntity {
    if (record === undefined || record === null) {
      throw new Error('Accounting Journal Entry Prisma record is required.');
    }

    const lines = record.lines.map((line) => this.lineToDomain(line));

    return AccountingJournalEntryEntity.rehydrate(
      {
        entryDate: new Date(record.entryDate.getTime()),

        description: record.description ?? undefined,

        lines,

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      new UniqueEntityId(record.id),

      new AccountingJournalEntryPublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Line → Domain
  // ===========================================================================

  /**
   * Maps a Prisma AccountingJournalLine into an
   * aggregate-internal AccountingJournalLineEntity.
   *
   * entryId is intentionally not mapped because the domain line does not own
   * the persistence foreign key.
   *
   * accountId is preserved as an opaque internal identity.
   */
  public static lineToDomain(
    record: PrismaAccountingJournalLine,
  ): AccountingJournalLineEntity {
    if (record === undefined || record === null) {
      throw new Error('Accounting Journal Line Prisma record is required.');
    }

    return AccountingJournalLineEntity.rehydrate(
      {
        accountId: new UniqueEntityId(record.accountId),

        type: AccountingJournalLineType.create(record.type),

        amount: AccountingAmount.create(record.amount),

        currency: AccountingCurrency.create(record.currency),

        description: record.description ?? undefined,

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      new UniqueEntityId(record.id),

      new AccountingJournalLinePublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Posting Reference → Domain
  // ===========================================================================

  /**
   * Maps the optional Prisma posting reference into the
   * aggregate-owned AccountingPostingReferenceEntity.
   *
   * journalId is intentionally not mapped because it is the persistence
   * relationship connecting the entity to its aggregate root.
   */
  public static postingReferenceToDomain(
    record: PrismaAccountingPostingReference,
  ): AccountingPostingReferenceEntity {
    if (record === undefined || record === null) {
      throw new Error(
        'Accounting Posting Reference Prisma record is required.',
      );
    }

    return AccountingPostingReferenceEntity.rehydrate(
      {
        sourceType: AccountingSourceType.create(record.sourceType),

        sourcePublicId: record.sourcePublicId,

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      new UniqueEntityId(record.id),

      new AccountingPostingReferencePublicId(record.publicId),
    );
  }

  // ===========================================================================
  // Journal → Persistence
  // ===========================================================================

  /**
   * Maps the Accounting Journal aggregate into its complete persistence graph.
   *
   * IMPORTANT:
   *
   * This method returns the journal object itself.
   *
   * The outer AccountingJournalPersistence wrapper is created by
   * toPersistence().
   */
  public static journalToPersistence(
    aggregate: AccountingJournalAggregate,
  ): AccountingJournalPersistenceGraph {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Accounting Journal aggregate is required.');
    }

    const journal = aggregate.journal;

    const journalId = journal.id.toString();

    // -------------------------------------------------------------------------
    // Entries
    // -------------------------------------------------------------------------

    const entries = journal.entries.map((entry) => {
      const entryId = entry.id.toString();

      return {
        id: entryId,

        publicId: entry.publicId.value,

        // Persistence-only FK.
        journalId,

        entryDate: entry.entryDate,

        description: entry.description ?? null,

        createdAt: entry.createdAt,

        updatedAt: entry.updatedAt,

        // -------------------------------------------------------------------
        // Lines
        // -------------------------------------------------------------------

        lines: entry.lines.map((line) => ({
          id: line.id.toString(),

          publicId: line.publicId.value,

          // Persistence-only FK.
          entryId,

          // Opaque internal Account identity.
          accountId: line.accountId.toString(),

          type: line.type.value,

          amount: line.amount.value,

          currency: line.currency.value,

          description: line.description ?? null,

          createdAt: line.createdAt,

          updatedAt: line.updatedAt,
        })),
      };
    });

    // -------------------------------------------------------------------------
    // Posting Reference
    // -------------------------------------------------------------------------

    const postingReference =
      journal.postingReference === undefined
        ? undefined
        : {
            id: journal.postingReference.id.toString(),

            publicId: journal.postingReference.publicId.value,

            // Persistence-only FK.
            journalId,

            sourceType: journal.postingReference.sourceType.value,

            sourcePublicId: journal.postingReference.sourcePublicId,

            createdAt: journal.postingReference.createdAt,

            updatedAt: journal.postingReference.updatedAt,
          };

    // -------------------------------------------------------------------------
    // Journal
    // -------------------------------------------------------------------------

    return {
      id: journalId,

      publicId: journal.publicId.value,

      status: journal.status.value,

      currency: journal.currency.value,

      periodId: journal.periodId?.toString() ?? null,

      postedAt: journal.postedAt ?? null,

      reversedAt: journal.reversedAt ?? null,

      createdAt: journal.createdAt,

      updatedAt: journal.updatedAt,

      entries,

      postingReference,
    };
  }

  // ===========================================================================
  // Aggregate → Persistence
  // ===========================================================================

  /**
   * Wraps the journal persistence graph in the aggregate persistence shape.
   *
   * Result:
   *
   * {
   *   journal: {
   *     ...
   *   }
   * }
   */
  public static toPersistence(
    aggregate: AccountingJournalAggregate,
  ): AccountingJournalPersistence {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Accounting Journal aggregate is required.');
    }

    return {
      journal: this.journalToPersistence(aggregate),
    };
  }

  // ===========================================================================
  // Journal Domain Convenience
  // ===========================================================================

  public static toJournalDomain(
    record: AccountingJournalWithRelations,
  ): AccountingJournalEntity {
    return this.journalToDomain(record);
  }

  // ===========================================================================
  // Aggregate Convenience
  // ===========================================================================

  public static toJournalAggregate(
    record: AccountingJournalWithRelations,
  ): AccountingJournalAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================
  // Entry Domain Convenience
  // ===========================================================================

  public static toEntryDomain(
    record: PrismaAccountingJournalEntry & {
      lines: PrismaAccountingJournalLine[];
    },
  ): AccountingJournalEntryEntity {
    return this.entryToDomain(record);
  }

  // ===========================================================================
  // Line Domain Convenience
  // ===========================================================================

  public static toLineDomain(
    record: PrismaAccountingJournalLine,
  ): AccountingJournalLineEntity {
    return this.lineToDomain(record);
  }

  // ===========================================================================
  // Posting Reference Domain Convenience
  // ===========================================================================

  public static toPostingReferenceDomain(
    record: PrismaAccountingPostingReference,
  ): AccountingPostingReferenceEntity {
    return this.postingReferenceToDomain(record);
  }

  // ===========================================================================
  // Domain Component
  // ===========================================================================

  public static toDomainComponent(
    record: AccountingJournalWithRelations,
  ): AccountingJournalEntity {
    return this.journalToDomain(record);
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default AccountingJournalPrismaMapper;
