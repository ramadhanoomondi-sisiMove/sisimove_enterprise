// -----------------------------------------------------------------------------
// Prisma Accounting Journal Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the Accounting Journal aggregate.
//
// Aggregate boundary:
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
// ├── AccountingJournalEntry[]
// │   └── AccountingJournalLine[]
// ├── AccountingPostingReference?
// └── AccountingPeriod?                  <-- external aggregate reference
//
// AccountingAccount is also a separate aggregate. Journal lines retain only
// the Accounting Account internal identity and this repository does not
// rehydrate or persist AccountingAccount aggregates.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - persist AccountingJournalAggregate;
// - retrieve AccountingJournalAggregate;
// - retrieve AccountingJournalEntity;
// - query journals by identity;
// - query journals by status;
// - query journals by currency;
// - query journals by Accounting Period;
// - query journals by posting reference;
// - query journals by posting source;
// - query journals by lifecycle state;
// - query journals by posting/reversal timestamps;
// - query journals by audit timestamps;
// - provide existence checks;
// - synchronize aggregate-owned entries;
// - synchronize aggregate-owned lines;
// - synchronize aggregate-owned posting reference.
//
// -----------------------------------------------------------------------------
//
// The repository does NOT:
//
// - contain journal business rules;
// - determine whether an Accounting Period is open;
// - validate AccountingAccount aggregates;
// - rehydrate AccountingAccount aggregates;
// - rehydrate AccountingPeriod aggregates;
// - post journals;
// - reverse journals;
// - authorize journal operations;
// - emit domain events;
// - publish domain events;
// - communicate with external systems.
//
// -----------------------------------------------------------------------------
//
// Aggregate ownership:
//
// AccountingJournalAggregate owns:
//
// AccountingJournal
// ├── Entries
// │   └── Lines
// └── Posting Reference
//
// Therefore entries, lines and posting references are synchronized atomically
// with the journal root.
//
// AccountingPeriod and AccountingAccount remain external aggregate
// references.
//
// -----------------------------------------------------------------------------
//
// Persistence identity:
//
// Domain:
//
// - UniqueEntityId
// - AccountingJournalPublicId
// - AccountingJournalEntryPublicId
// - AccountingJournalLinePublicId
// - AccountingPostingReferencePublicId
//
// Prisma:
//
// - AccountingJournal.id
// - AccountingJournal.publicId
// - AccountingJournalEntry.id
// - AccountingJournalEntry.publicId
// - AccountingJournalEntry.journalId
// - AccountingJournalLine.id
// - AccountingJournalLine.publicId
// - AccountingJournalLine.entryId
// - AccountingJournalLine.accountId
// - AccountingPostingReference.id
// - AccountingPostingReference.publicId
// - AccountingPostingReference.journalId
//
// -----------------------------------------------------------------------------
//
// Cross-aggregate references:
//
// AccountingJournal.periodId
// AccountingJournalLine.accountId
//
// remain opaque persistence references.
//
// The repository may verify their persistence existence when required by the
// database foreign key, but does not rehydrate the corresponding aggregates.
//
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// AccountingJournalPrismaMapper already establishes the persistence-only:
//
// - journalId
// - entryId
//
// foreign keys.
//
// This repository therefore uses the mapper persistence graph and writes
// those values directly into Prisma records.
//
// -----------------------------------------------------------------------------
//
// Persistence strategy:
//
// save():
//
// 1. Maps the complete aggregate into the persistence graph.
// 2. Opens one database transaction.
// 3. Upserts the journal root.
// 4. Removes aggregate-owned entries that are no longer present.
// 5. Upserts current entries.
// 6. Removes lines that are no longer present.
// 7. Upserts current lines.
// 8. Synchronizes the optional posting reference.
//
// All aggregate-owned changes therefore succeed or fail atomically.
//
// -----------------------------------------------------------------------------
//
// Prisma error boundary:
//
// Prisma/database errors remain infrastructure concerns.
//
// This repository does not translate generic Prisma errors into domain
// exceptions because no Accounting Journal persistence exception contract has
// been supplied here.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import { $Enums, Prisma } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { AccountingJournalAggregate } from '../../../../domain/aggregates/accounting-journal.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import type { AccountingJournalEntity } from '../../../../domain/entities/accounting-journal.entity';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { AccountingJournalRepository } from '../../../../domain/repositories/accounting-journal.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

import type { AccountingJournalPublicId } from '../../../../domain/value-objects/accounting-journal-public-id.vo';

import {
  AccountingJournalStatus,
  type AccountingJournalStatusValue,
} from '../../../../domain/value-objects/accounting-journal-status.vo';

import type { AccountingCurrency } from '../../../../domain/value-objects/accounting-currency.vo';

import type { AccountingPeriodPublicId } from '../../../../domain/value-objects/accounting-period-public-id.vo';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  AccountingJournalPrismaMapper,
  type AccountingJournalPersistenceGraph,
  type AccountingJournalWithRelations,
} from '../../../persistence/prisma/mappers/accounting-journal-prisma.mapper';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaAccountingJournalRepository implements AccountingJournalRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Prisma Enum Boundary
  // ===========================================================================

  /**
   * Converts a domain AccountingJournalStatus value into the corresponding
   * Prisma enum.
   *
   * The domain value object has already validated the value before reaching
   * the infrastructure boundary.
   */
  private toPrismaAccountingJournalStatus(
    value: AccountingJournalStatusValue,
  ): $Enums.AccountingJournalStatus {
    switch (value) {
      case 'DRAFT':
        return $Enums.AccountingJournalStatus.DRAFT;

      case 'POSTED':
        return $Enums.AccountingJournalStatus.POSTED;

      case 'REVERSED':
        return $Enums.AccountingJournalStatus.REVERSED;

      default:
        throw new Error(
          `Unsupported AccountingJournalStatus "${String(
            value,
          )}" supplied to Prisma repository.`,
        );
    }
  }

  // ===========================================================================
  // Complete Aggregate Include Graph
  // ===========================================================================

  /**
   * Complete Accounting Journal aggregate relation graph.
   *
   * The mapper requires:
   *
   * - entries;
   * - entries.lines;
   * - postingReference;
   * - period.
   *
   * The complete AccountingPeriod relation is loaded because the current
   * AccountingJournalPrismaMapper type expects PrismaAccountingPeriod.
   *
   * The period itself is NOT rehydrated as an aggregate. The mapper only
   * extracts its public identity.
   */
  private readonly include = {
    entries: {
      include: {
        lines: true,
      },
    },

    postingReference: true,

    period: true,
  } satisfies Prisma.AccountingJournalInclude;

  // ===========================================================================
  // Create / Save
  // ===========================================================================

  /**
   * Persists the complete Accounting Journal aggregate.
   *
   * The AccountingJournalRepository contract exposes save() as the persistence
   * operation, therefore save() supports both:
   *
   * - creation of a new journal;
   * - synchronization of an existing journal.
   *
   * All aggregate-owned records are synchronized inside one transaction.
   */
  public async save(aggregate: AccountingJournalAggregate): Promise<void> {
    try {
      const persistence =
        AccountingJournalPrismaMapper.toPersistence(aggregate);

      await this.prisma.$transaction(async (tx) => {
        // ---------------------------------------------------------------------
        // Journal Root
        // ---------------------------------------------------------------------

        await tx.accountingJournal.upsert({
          where: {
            id: persistence.journal.id,
          },

          create: {
            id: persistence.journal.id,

            publicId: persistence.journal.publicId,

            status: this.toPrismaAccountingJournalStatus(
              persistence.journal.status,
            ),

            currency: persistence.journal.currency,

            periodId: persistence.journal.periodId,

            postedAt: persistence.journal.postedAt,

            reversedAt: persistence.journal.reversedAt,

            createdAt: persistence.journal.createdAt,

            updatedAt: persistence.journal.updatedAt,
          },

          update: {
            publicId: persistence.journal.publicId,

            status: this.toPrismaAccountingJournalStatus(
              persistence.journal.status,
            ),

            currency: persistence.journal.currency,

            periodId: persistence.journal.periodId,

            postedAt: persistence.journal.postedAt,

            reversedAt: persistence.journal.reversedAt,

            updatedAt: persistence.journal.updatedAt,
          },
        });

        // ---------------------------------------------------------------------
        // Aggregate-Owned Entry Reconciliation
        // ---------------------------------------------------------------------

        const persistedEntryIds = persistence.journal.entries.map(
          (entry) => entry.id,
        );

        if (persistedEntryIds.length === 0) {
          await tx.accountingJournalEntry.deleteMany({
            where: {
              journalId: persistence.journal.id,
            },
          });
        } else {
          await tx.accountingJournalEntry.deleteMany({
            where: {
              journalId: persistence.journal.id,

              id: {
                notIn: persistedEntryIds,
              },
            },
          });
        }

        // ---------------------------------------------------------------------
        // Current Entries
        // ---------------------------------------------------------------------

        for (const entry of persistence.journal.entries) {
          await this.upsertEntry(tx, persistence.journal.id, entry);
        }

        // ---------------------------------------------------------------------
        // Aggregate-Owned Posting Reference
        // ---------------------------------------------------------------------

        await this.synchronizePostingReference(
          tx,
          persistence.journal.id,
          persistence.journal.postingReference,
        );
      });
    } catch (error: unknown) {
      throw this.translatePersistenceError(error);
    }
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Deletes an Accounting Journal aggregate.
   *
   * Entries and lines are aggregate-owned and are therefore removed together
   * with the journal.
   *
   * The Prisma schema also has cascading deletion from:
   *
   * Journal
   * └── Entry
   *     └── Line
   *
   * and:
   *
   * Journal
   * └── PostingReference
   *
   * The explicit transaction keeps the aggregate boundary clear in the
   * infrastructure implementation.
   */
  public async delete(aggregate: AccountingJournalAggregate): Promise<void> {
    try {
      const journalId = aggregate.journal.id.toString();

      await this.prisma.$transaction(async (tx) => {
        await tx.accountingJournal.delete({
          where: {
            id: journalId,
          },
        });
      });
    } catch (error: unknown) {
      throw this.translatePersistenceError(error);
    }
  }

  // ===========================================================================
  // Aggregate Queries — Identity
  // ===========================================================================

  /**
   * Finds a complete Accounting Journal aggregate by internal identity.
   */
  public async findById(
    id: UniqueEntityId,
  ): Promise<AccountingJournalAggregate | null> {
    const record = await this.prisma.accountingJournal.findUnique({
      where: {
        id: id.toString(),
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds a complete Accounting Journal aggregate by public identity.
   */
  public async findByPublicId(
    publicId: AccountingJournalPublicId,
  ): Promise<AccountingJournalAggregate | null> {
    const record = await this.prisma.accountingJournal.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Aggregate Queries — Status
  // ===========================================================================

  /**
   * Finds Accounting Journal aggregates by status.
   */
  public async findByStatus(
    status: AccountingJournalStatus,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        status: this.toPrismaAccountingJournalStatus(status.value),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all DRAFT journals.
   */
  public async findDraft(): Promise<AccountingJournalAggregate[]> {
    return this.findByStatus(AccountingJournalStatus.create('DRAFT'));
  }

  /**
   * Finds all POSTED journals.
   */
  public async findPosted(): Promise<AccountingJournalAggregate[]> {
    return this.findByStatus(AccountingJournalStatus.create('POSTED'));
  }

  /**
   * Finds all REVERSED journals.
   */
  public async findReversed(): Promise<AccountingJournalAggregate[]> {
    return this.findByStatus(AccountingJournalStatus.create('REVERSED'));
  }

  /**
   * Finds all mutable journals.
   *
   * A mutable journal is currently represented by DRAFT status.
   */
  public async findMutable(): Promise<AccountingJournalAggregate[]> {
    return this.findByStatus(AccountingJournalStatus.create('DRAFT'));
  }

  /**
   * Finds all immutable journals.
   *
   * Any journal that is not DRAFT is considered immutable by persisted
   * lifecycle state.
   */
  public async findImmutable(): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        status: {
          not: $Enums.AccountingJournalStatus.DRAFT,
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals that are candidates for posting based on persisted
   * lifecycle state.
   *
   * Final posting validation remains the responsibility of the aggregate and
   * application workflow.
   */
  public async findPostingEligible(): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        status: $Enums.AccountingJournalStatus.DRAFT,
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals that are not currently posting candidates.
   */
  public async findPostingIneligible(): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        status: {
          not: $Enums.AccountingJournalStatus.DRAFT,
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals that are candidates for reversal based on persisted state.
   *
   * A reversal candidate must:
   *
   * - be POSTED;
   * - not already have a reversal timestamp.
   */
  public async findReversalEligible(): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        status: $Enums.AccountingJournalStatus.POSTED,

        reversedAt: null,
      },

      include: this.include,

      orderBy: {
        postedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals that are not currently reversal candidates.
   */
  public async findReversalIneligible(): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        OR: [
          {
            status: {
              not: $Enums.AccountingJournalStatus.POSTED,
            },
          },

          {
            reversedAt: {
              not: null,
            },
          },
        ],
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Currency
  // ===========================================================================

  /**
   * Finds journals using the supplied accounting currency.
   */
  public async findByCurrency(
    currency: AccountingCurrency,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        currency: currency.value,
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals using a currency other than the supplied currency.
   */
  public async findNotByCurrency(
    currency: AccountingCurrency,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        currency: {
          not: currency.value,
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Accounting Period
  // ===========================================================================

  /**
   * Finds journals assigned to an Accounting Period by internal identity.
   *
   * The Accounting Period remains a separate aggregate.
   */
  public async findByPeriodId(
    periodId: UniqueEntityId,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        periodId: periodId.toString(),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals assigned to an Accounting Period by public identity.
   *
   * The public identity is resolved through the persistence relation.
   */
  public async findByPeriodPublicId(
    periodPublicId: AccountingPeriodPublicId,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        period: {
          publicId: periodPublicId.value,
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals without an Accounting Period.
   */
  public async findWithoutPeriod(): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        periodId: null,
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals assigned to an Accounting Period.
   */
  public async findWithPeriod(): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        periodId: {
          not: null,
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Aggregate Queries — Posting Reference
  // ===========================================================================

  /**
   * Finds a journal by posting reference public identity.
   */
  public async findByPostingReferencePublicId(
    postingReferencePublicId: string,
  ): Promise<AccountingJournalAggregate | null> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        postingReference: {
          publicId: postingReferencePublicId,
        },
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds journals that contain a posting reference.
   */
  public async findWithPostingReference(): Promise<
    AccountingJournalAggregate[]
  > {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        postingReference: {
          isNot: null,
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals without a posting reference.
   */
  public async findWithoutPostingReference(): Promise<
    AccountingJournalAggregate[]
  > {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        postingReference: {
          is: null,
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals by posting source type.
   */
  public async findByPostingSourceType(
    sourceType: string,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        postingReference: {
          is: {
            sourceType,
          },
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals by posting source public identity.
   */
  public async findByPostingSourcePublicId(
    sourcePublicId: string,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        postingReference: {
          is: {
            sourcePublicId,
          },
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals associated with a complete posting source.
   */
  public async findByPostingSource(
    sourceType: string,
    sourcePublicId: string,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        postingReference: {
          is: {
            sourceType,
            sourcePublicId,
          },
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds the Accounting Journal entity by public identity.
   *
   * The aggregate relation graph is loaded because the current mapper's
   * journalToDomain() reconstructs the journal entity together with its
   * aggregate-owned components.
   */
  public async findEntityByPublicId(
    publicId: AccountingJournalPublicId,
  ): Promise<AccountingJournalEntity | null> {
    const record = await this.prisma.accountingJournal.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: this.include,
    });

    return record === null
      ? null
      : AccountingJournalPrismaMapper.toJournalDomain(record);
  }

  /**
   * Finds the Accounting Journal entity by internal identity.
   */
  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<AccountingJournalEntity | null> {
    const record = await this.prisma.accountingJournal.findUnique({
      where: {
        id: id.toString(),
      },

      include: this.include,
    });

    return record === null
      ? null
      : AccountingJournalPrismaMapper.toJournalDomain(record);
  }

  /**
   * Finds Accounting Journal entities by status.
   */
  public async findEntitiesByStatus(
    status: AccountingJournalStatus,
  ): Promise<AccountingJournalEntity[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        status: this.toPrismaAccountingJournalStatus(status.value),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      AccountingJournalPrismaMapper.toJournalDomain(record),
    );
  }

  // ===========================================================================
  // Posting / Reversal Timestamp Queries
  // ===========================================================================

  /**
   * Finds journals posted after the supplied timestamp.
   */
  public async findPostedAfter(
    postedAfter: Date,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        postedAt: {
          gt: postedAfter,
        },
      },

      include: this.include,

      orderBy: {
        postedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals posted before the supplied timestamp.
   */
  public async findPostedBefore(
    postedBefore: Date,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        postedAt: {
          lt: postedBefore,
        },
      },

      include: this.include,

      orderBy: {
        postedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals reversed after the supplied timestamp.
   */
  public async findReversedAfter(
    reversedAfter: Date,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        reversedAt: {
          gt: reversedAfter,
        },
      },

      include: this.include,

      orderBy: {
        reversedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals reversed before the supplied timestamp.
   */
  public async findReversedBefore(
    reversedBefore: Date,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        reversedAt: {
          lt: reversedBefore,
        },
      },

      include: this.include,

      orderBy: {
        reversedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals that have been posted but not reversed.
   */
  public async findPostedNotReversed(): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        status: $Enums.AccountingJournalStatus.POSTED,

        postedAt: {
          not: null,
        },

        reversedAt: null,
      },

      include: this.include,

      orderBy: {
        postedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals that have been reversed.
   */
  public async findWithReversal(): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        reversedAt: {
          not: null,
        },
      },

      include: this.include,

      orderBy: {
        reversedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Audit Queries
  // ===========================================================================

  /**
   * Finds journals created after the supplied timestamp.
   */
  public async findCreatedAfter(
    createdAfter: Date,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        createdAt: {
          gt: createdAfter,
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals created before the supplied timestamp.
   */
  public async findCreatedBefore(
    createdBefore: Date,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        createdAt: {
          lt: createdBefore,
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals updated after the supplied timestamp.
   */
  public async findUpdatedAfter(
    updatedAfter: Date,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        updatedAt: {
          gt: updatedAfter,
        },
      },

      include: this.include,

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds journals updated before the supplied timestamp.
   */
  public async findUpdatedBefore(
    updatedBefore: Date,
  ): Promise<AccountingJournalAggregate[]> {
    const records = await this.prisma.accountingJournal.findMany({
      where: {
        updatedAt: {
          lt: updatedBefore,
        },
      },

      include: this.include,

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all journals ordered by creation timestamp ascending.
   */
  public async findAllOrderedByCreatedAt(): Promise<
    AccountingJournalAggregate[]
  > {
    const records = await this.prisma.accountingJournal.findMany({
      include: this.include,

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all journals ordered by posting timestamp ascending.
   *
   * Prisma sorts nullable values according to database/provider semantics.
   */
  public async findAllOrderedByPostedAt(): Promise<
    AccountingJournalAggregate[]
  > {
    const records = await this.prisma.accountingJournal.findMany({
      include: this.include,

      orderBy: {
        postedAt: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  /**
   * Finds all journals ordered by creation timestamp descending.
   *
   * This method exists separately from findAllOrderedByCreatedAt() because
   * both directions are explicitly part of the repository contract.
   */
  public async findAllOrderedByCreatedAtDescending(): Promise<
    AccountingJournalAggregate[]
  > {
    const records = await this.prisma.accountingJournal.findMany({
      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Existence Queries — Identity
  // ===========================================================================

  /**
   * Determines whether a journal exists by public identity.
   */
  public async existsByPublicId(
    publicId: AccountingJournalPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether a journal exists by internal identity.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence Queries — Status
  // ===========================================================================

  /**
   * Determines whether at least one journal exists with the supplied status.
   */
  public async existsByStatus(
    status: AccountingJournalStatus,
  ): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        status: this.toPrismaAccountingJournalStatus(status.value),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one DRAFT journal exists.
   */
  public async existsDraft(): Promise<boolean> {
    return this.existsByStatus(AccountingJournalStatus.create('DRAFT'));
  }

  /**
   * Determines whether at least one POSTED journal exists.
   */
  public async existsPosted(): Promise<boolean> {
    return this.existsByStatus(AccountingJournalStatus.create('POSTED'));
  }

  /**
   * Determines whether at least one REVERSED journal exists.
   */
  public async existsReversed(): Promise<boolean> {
    return this.existsByStatus(AccountingJournalStatus.create('REVERSED'));
  }

  /**
   * Determines whether at least one mutable journal exists.
   */
  public async existsMutable(): Promise<boolean> {
    return this.existsDraft();
  }

  /**
   * Determines whether at least one posting-eligible journal exists.
   */
  public async existsPostingEligible(): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        status: $Enums.AccountingJournalStatus.DRAFT,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one reversal-eligible journal exists.
   */
  public async existsReversalEligible(): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        status: $Enums.AccountingJournalStatus.POSTED,

        reversedAt: null,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence Queries — Currency
  // ===========================================================================

  /**
   * Determines whether at least one journal exists using the supplied
   * currency.
   */
  public async existsByCurrency(
    currency: AccountingCurrency,
  ): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        currency: currency.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence Queries — Accounting Period
  // ===========================================================================

  /**
   * Determines whether at least one journal references the supplied period
   * internal identity.
   */
  public async existsByPeriodId(periodId: UniqueEntityId): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        periodId: periodId.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one journal references the supplied period
   * public identity.
   */
  public async existsByPeriodPublicId(
    periodPublicId: AccountingPeriodPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        period: {
          publicId: periodPublicId.value,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one journal has no period.
   */
  public async existsWithoutPeriod(): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        periodId: null,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one journal has a period.
   */
  public async existsWithPeriod(): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        periodId: {
          not: null,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence Queries — Posting Reference
  // ===========================================================================

  /**
   * Determines whether a journal exists with the supplied posting reference
   * public identity.
   */
  public async existsByPostingReferencePublicId(
    postingReferencePublicId: string,
  ): Promise<boolean> {
    const record = await this.prisma.accountingPostingReference.findUnique({
      where: {
        publicId: postingReferencePublicId,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one journal has a posting reference.
   */
  public async existsWithPostingReference(): Promise<boolean> {
    const record = await this.prisma.accountingPostingReference.findFirst({
      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one journal has no posting reference.
   */
  public async existsWithoutPostingReference(): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        postingReference: {
          is: null,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one journal exists for the supplied posting
   * source.
   */
  public async existsByPostingSource(
    sourceType: string,
    sourcePublicId: string,
  ): Promise<boolean> {
    const record = await this.prisma.accountingPostingReference.findFirst({
      where: {
        sourceType,

        sourcePublicId,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence Queries — Posting / Reversal
  // ===========================================================================

  /**
   * Determines whether at least one journal was posted after the supplied
   * timestamp.
   */
  public async existsPostedAfter(postedAfter: Date): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        postedAt: {
          gt: postedAfter,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one journal was posted before the supplied
   * timestamp.
   */
  public async existsPostedBefore(postedBefore: Date): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        postedAt: {
          lt: postedBefore,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one journal was reversed after the supplied
   * timestamp.
   */
  public async existsReversedAfter(reversedAfter: Date): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        reversedAt: {
          gt: reversedAfter,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one journal was reversed before the supplied
   * timestamp.
   */
  public async existsReversedBefore(reversedBefore: Date): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        reversedAt: {
          lt: reversedBefore,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one posted journal has not been reversed.
   */
  public async existsPostedNotReversed(): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        status: $Enums.AccountingJournalStatus.POSTED,

        postedAt: {
          not: null,
        },

        reversedAt: null,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Determines whether at least one reversed journal exists.
   */
  public async existsWithReversal(): Promise<boolean> {
    const record = await this.prisma.accountingJournal.findFirst({
      where: {
        reversedAt: {
          not: null,
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Persistence Helpers
  // ===========================================================================

  /**
   * Upserts an aggregate-owned Accounting Journal Entry.
   *
   * The entry persistence graph contains the persistence-only journalId FK.
   */
  private async upsertEntry(
    tx: Prisma.TransactionClient,
    journalId: string,
    entry: AccountingJournalPersistenceGraph['entries'][number],
  ): Promise<void> {
    if (entry.journalId !== journalId) {
      throw new Error(
        `Cannot persist Accounting Journal Entry "${entry.publicId}": ` +
          `entry belongs to journal "${entry.journalId}" but aggregate root ` +
          `is journal "${journalId}".`,
      );
    }

    // -------------------------------------------------------------------------
    // Entry
    // -------------------------------------------------------------------------

    await tx.accountingJournalEntry.upsert({
      where: {
        id: entry.id,
      },

      create: {
        id: entry.id,

        publicId: entry.publicId,

        journalId,

        entryDate: entry.entryDate,

        description: entry.description,

        createdAt: entry.createdAt,

        updatedAt: entry.updatedAt,
      },

      update: {
        publicId: entry.publicId,

        journalId,

        entryDate: entry.entryDate,

        description: entry.description,

        updatedAt: entry.updatedAt,
      },
    });

    // -------------------------------------------------------------------------
    // Entry-Owned Lines
    // -------------------------------------------------------------------------

    const persistedLineIds = entry.lines.map((line) => line.id);

    if (persistedLineIds.length === 0) {
      await tx.accountingJournalLine.deleteMany({
        where: {
          entryId: entry.id,
        },
      });
    } else {
      await tx.accountingJournalLine.deleteMany({
        where: {
          entryId: entry.id,

          id: {
            notIn: persistedLineIds,
          },
        },
      });
    }

    // -------------------------------------------------------------------------
    // Current Lines
    // -------------------------------------------------------------------------

    for (const line of entry.lines) {
      await this.upsertLine(tx, entry.id, line);
    }
  }

  /**
   * Upserts an aggregate-owned Accounting Journal Line.
   *
   * accountId is an opaque reference to the Accounting Account aggregate.
   *
   * The repository does not load or rehydrate the Accounting Account.
   */
  private async upsertLine(
    tx: Prisma.TransactionClient,
    entryId: string,
    line: AccountingJournalPersistenceGraph['entries'][number]['lines'][number],
  ): Promise<void> {
    if (line.entryId !== entryId) {
      throw new Error(
        `Cannot persist Accounting Journal Line "${line.publicId}": ` +
          `line belongs to entry "${line.entryId}" but persistence entry ` +
          `is "${entryId}".`,
      );
    }

    await tx.accountingJournalLine.upsert({
      where: {
        id: line.id,
      },

      create: {
        id: line.id,

        publicId: line.publicId,

        entryId,

        accountId: line.accountId,

        type: line.type,

        amount: line.amount,

        currency: line.currency,

        description: line.description,

        createdAt: line.createdAt,

        updatedAt: line.updatedAt,
      },

      update: {
        publicId: line.publicId,

        entryId,

        accountId: line.accountId,

        type: line.type,

        amount: line.amount,

        currency: line.currency,

        description: line.description,

        updatedAt: line.updatedAt,
      },
    });
  }

  /**
   * Synchronizes the aggregate-owned optional posting reference.
   *
   * There can be at most one posting reference because Prisma defines:
   *
   * AccountingPostingReference.journalId @unique
   */
  private async synchronizePostingReference(
    tx: Prisma.TransactionClient,
    journalId: string,
    postingReference:
      AccountingJournalPersistenceGraph['postingReference'] | undefined,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // No Posting Reference
    // -------------------------------------------------------------------------

    if (postingReference === undefined) {
      await tx.accountingPostingReference.deleteMany({
        where: {
          journalId,
        },
      });

      return;
    }

    // -------------------------------------------------------------------------
    // Ownership Guard
    // -------------------------------------------------------------------------

    if (postingReference.journalId !== journalId) {
      throw new Error(
        `Cannot persist Accounting Posting Reference "${postingReference.publicId}": ` +
          `reference belongs to journal "${postingReference.journalId}" but ` +
          `aggregate root is journal "${journalId}".`,
      );
    }

    // -------------------------------------------------------------------------
    // Upsert Posting Reference
    // -------------------------------------------------------------------------

    await tx.accountingPostingReference.upsert({
      where: {
        journalId,
      },

      create: {
        id: postingReference.id,

        publicId: postingReference.publicId,

        journalId,

        sourceType: postingReference.sourceType,

        sourcePublicId: postingReference.sourcePublicId,

        createdAt: postingReference.createdAt,

        updatedAt: postingReference.updatedAt,
      },

      update: {
        publicId: postingReference.publicId,

        sourceType: postingReference.sourceType,

        sourcePublicId: postingReference.sourcePublicId,

        updatedAt: postingReference.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Aggregate Reconstruction
  // ===========================================================================

  /**
   * Rehydrates the complete Accounting Journal aggregate.
   *
   * The mapper is the only component responsible for translating persistence
   * records into domain objects.
   */
  private toAggregate(
    record: AccountingJournalWithRelations,
  ): AccountingJournalAggregate {
    return AccountingJournalPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Persistence Error Translation
  // ===========================================================================

  /**
   * Keeps persistence errors at the infrastructure boundary.
   *
   * No Accounting Journal persistence exception has been supplied in the
   * current domain contract, therefore known Prisma errors are not translated
   * into invented domain exceptions.
   *
   * This method exists as the repository's explicit error boundary and can be
   * extended later when concrete Accounting exceptions are introduced.
   */
  private translatePersistenceError(error: unknown): Error {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return new Error(
        `Accounting Journal persistence error (${error.code}).`,
        {
          cause: error,
        },
      );
    }

    return error instanceof Error
      ? error
      : new Error('An unknown Accounting Journal persistence error occurred.');
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaAccountingJournalRepository;
