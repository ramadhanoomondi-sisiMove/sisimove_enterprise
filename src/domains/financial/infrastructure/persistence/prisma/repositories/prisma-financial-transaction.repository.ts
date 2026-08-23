// -----------------------------------------------------------------------------
// Prisma Financial Transaction Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the Financial Transaction aggregate.
//
// Aggregate boundary:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// Responsibilities:
//
// - Financial Transaction aggregate persistence and rehydration
// - Aggregate identity lookup
// - Transaction lifecycle queries
// - Transaction classification queries
// - Currency queries
// - Account-reference queries
// - Business-reference queries
// - Accounting-reference queries
// - Aggregate-owned entry queries
// - Transaction integrity queries
// - Transaction amount queries
// - Transaction counting
//
// IMPORTANT:
//
// FinancialTransactionEntryEntity is NOT an aggregate root.
//
// Entries are persisted atomically with their owning Financial Transaction.
//
// This repository therefore does NOT expose:
//
// - saveEntry()
// - deleteEntry()
//
// Financial Account references are opaque domain references:
//
//   FinancialAccountReference
//   ├── type
//   └── publicId
//
// Prisma, however, stores:
//
//   FinancialAccount.id
//
// Therefore this repository resolves:
//
//   FinancialAccountReference.publicId
//                 ↓
//   FinancialAccount.id
//
// before delegating persistence mapping to the mapper.
//
// This repository does NOT manage:
//
// - FinancialAccountAggregate
// - FinancialPaymentAggregate
// - FinancialAccountHoldAggregate
// - FinancialSettlementAggregate
// - FinancialAccountWithdrawalAggregate
// - FinancialDisbursementAggregate
//
// Accounting remains outside the Financial bounded context.
//
// accountingJournalPublicId is persisted only as an opaque identifier.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { $Enums, Prisma } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialTransactionAggregate } from '../../../../domain/aggregates/financial-transaction.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import type { FinancialTransactionEntryEntity } from '../../../../domain/entities/financial-transaction-entry.entity';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { FinancialTransactionRepository } from '../../../../domain/repositories/financial-transaction.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  FinancialAccountReference,
  FinancialTransactionEntryPublicId,
  FinancialTransactionPublicId,
  FinancialTransactionReference,
  FinancialTransactionType,
} from '../../../../domain/value-objects';

import {
  Currency,
  FinancialTransactionEntryType,
  FinancialTransactionStatus,
  Money,
} from '../../../../domain/value-objects';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  FinancialTransactionPrismaMapper,
  type FinancialTransactionWithRelations,
} from '../../../persistence/prisma/mappers/financial-transaction-prisma.mapper';

// =============================================================================
// Repository
// =============================================================================

export class PrismaFinancialTransactionRepository implements FinancialTransactionRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Prisma Enum Boundary
  // ===========================================================================

  /**
   * Converts a domain FinancialTransactionType value into its Prisma
   * persistence representation.
   *
   * Domain values intentionally remain independent from Prisma enums.
   */
  private toPrismaFinancialTransactionType(
    value: string,
  ): $Enums.FinancialTransactionType {
    return value as $Enums.FinancialTransactionType;
  }

  /**
   * Converts a domain FinancialTransactionStatus value into its Prisma
   * persistence representation.
   */
  private toPrismaFinancialTransactionStatus(
    value: string,
  ): $Enums.FinancialTransactionStatus {
    return value as $Enums.FinancialTransactionStatus;
  }

  /**
   * Converts a domain FinancialTransactionEntryType value into its Prisma
   * persistence representation.
   */
  private toPrismaFinancialTransactionEntryType(
    value: string,
  ): $Enums.FinancialTransactionEntryType {
    return value as $Enums.FinancialTransactionEntryType;
  }

  // ===========================================================================
  // Complete Aggregate Include Graph
  // ===========================================================================

  /**
   * Complete persistence graph required to rehydrate the aggregate.
   *
   * FinancialTransaction
   * ├── sourceAccount
   * ├── destinationAccount
   * └── entries[]
   *      └── account
   *
   * The account relations are required because the domain uses opaque
   * FinancialAccountReference value objects rather than Prisma foreign keys.
   */
  private readonly include = {
    sourceAccount: true,

    destinationAccount: true,

    entries: {
      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    },
  } satisfies Prisma.FinancialTransactionInclude;

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persists the complete Financial Transaction aggregate atomically.
   *
   * The transaction root and all aggregate-owned entries are persisted inside
   * one database transaction.
   */
  public async save(aggregate: FinancialTransactionAggregate): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Resolve every account reference required by the aggregate.
      // -----------------------------------------------------------------------

      const accountIds = await this.resolveAggregateAccountIds(tx, aggregate);

      // -----------------------------------------------------------------------
      // Convert aggregate into persistence structures.
      // -----------------------------------------------------------------------

      const persistence = FinancialTransactionPrismaMapper.toPersistence(
        aggregate,
        accountIds,
      );

      // -----------------------------------------------------------------------
      // Transaction Root
      // -----------------------------------------------------------------------

      await tx.financialTransaction.upsert({
        where: {
          id: persistence.transaction.id,
        },

        create: {
          id: persistence.transaction.id,

          publicId: persistence.transaction.publicId,

          type: this.toPrismaFinancialTransactionType(
            persistence.transaction.type,
          ),

          status: this.toPrismaFinancialTransactionStatus(
            persistence.transaction.status,
          ),

          sourceAccountId: persistence.transaction.sourceAccountId,

          destinationAccountId: persistence.transaction.destinationAccountId,

          amount: persistence.transaction.amount,

          currency: persistence.transaction.currency,

          referenceType: persistence.transaction.referenceType,

          referencePublicId: persistence.transaction.referencePublicId,

          accountingJournalPublicId:
            persistence.transaction.accountingJournalPublicId,

          completedAt: persistence.transaction.completedAt,

          failedAt: persistence.transaction.failedAt,

          reversedAt: persistence.transaction.reversedAt,

          cancelledAt: persistence.transaction.cancelledAt,

          createdAt: persistence.transaction.createdAt,

          updatedAt: persistence.transaction.updatedAt,
        },

        update: {
          publicId: persistence.transaction.publicId,

          type: this.toPrismaFinancialTransactionType(
            persistence.transaction.type,
          ),

          status: this.toPrismaFinancialTransactionStatus(
            persistence.transaction.status,
          ),

          sourceAccountId: persistence.transaction.sourceAccountId,

          destinationAccountId: persistence.transaction.destinationAccountId,

          amount: persistence.transaction.amount,

          currency: persistence.transaction.currency,

          referenceType: persistence.transaction.referenceType,

          referencePublicId: persistence.transaction.referencePublicId,

          accountingJournalPublicId:
            persistence.transaction.accountingJournalPublicId,

          completedAt: persistence.transaction.completedAt,

          failedAt: persistence.transaction.failedAt,

          reversedAt: persistence.transaction.reversedAt,

          cancelledAt: persistence.transaction.cancelledAt,

          updatedAt: persistence.transaction.updatedAt,
        },
      });

      // -----------------------------------------------------------------------
      // Aggregate-Owned Entries
      // -----------------------------------------------------------------------
      //
      // The aggregate owns its complete entry collection.
      //
      // Entries that no longer belong to the aggregate are removed and the
      // current aggregate entries are recreated atomically.
      //
      // -----------------------------------------------------------------------

      await tx.financialTransactionEntry.deleteMany({
        where: {
          transactionId: persistence.transaction.id,
        },
      });

      if (persistence.entries.length > 0) {
        await tx.financialTransactionEntry.createMany({
          data: persistence.entries.map((entry) => ({
            id: entry.id,

            publicId: entry.publicId,

            transactionId: entry.transactionId,

            accountId: entry.accountId,

            type: this.toPrismaFinancialTransactionEntryType(entry.type),

            balanceType: entry.balanceType,

            amount: entry.amount,

            createdAt: entry.createdAt,
          })),
        });
      }
    });
  }

  // ===========================================================================
  // Aggregate Lookup
  // ===========================================================================

  /**
   * Finds and rehydrates the complete aggregate by internal persistence ID.
   */
  public async findById(
    id: UniqueEntityId,
  ): Promise<FinancialTransactionAggregate | null> {
    const record = await this.prisma.financialTransaction.findUnique({
      where: {
        id: id.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds and rehydrates the complete aggregate by public identity.
   */
  public async findByPublicId(
    publicId: FinancialTransactionPublicId,
  ): Promise<FinancialTransactionAggregate | null> {
    const record = await this.prisma.financialTransaction.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Exists
  // ===========================================================================

  /**
   * Determines whether a Financial Transaction exists by internal identity.
   */
  public async exists(id: UniqueEntityId): Promise<boolean> {
    return (
      (await this.prisma.financialTransaction.count({
        where: {
          id: id.value,
        },
      })) > 0
    );
  }

  /**
   * Determines whether a Financial Transaction exists by public identity.
   */
  public async existsByPublicId(
    publicId: FinancialTransactionPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialTransaction.count({
        where: {
          publicId: publicId.value,
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  public async findByStatus(
    status: FinancialTransactionStatus,
  ): Promise<FinancialTransactionAggregate[]> {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        status: this.toPrismaFinancialTransactionStatus(status.value),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async hasStatus(
    id: UniqueEntityId,
    status: FinancialTransactionStatus,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialTransaction.count({
        where: {
          id: id.value,

          status: this.toPrismaFinancialTransactionStatus(status.value),
        },
      })) > 0
    );
  }

  public async findPending(): Promise<FinancialTransactionAggregate[]> {
    return this.findByStatus(this.toFinancialTransactionStatus('PENDING'));
  }

  public async findCompleted(): Promise<FinancialTransactionAggregate[]> {
    return this.findByStatus(this.toFinancialTransactionStatus('COMPLETED'));
  }

  public async findFailed(): Promise<FinancialTransactionAggregate[]> {
    return this.findByStatus(this.toFinancialTransactionStatus('FAILED'));
  }

  public async findCancelled(): Promise<FinancialTransactionAggregate[]> {
    return this.findByStatus(this.toFinancialTransactionStatus('CANCELLED'));
  }

  public async findReversed(): Promise<FinancialTransactionAggregate[]> {
    return this.findByStatus(this.toFinancialTransactionStatus('REVERSED'));
  }

  /**
   * Finds transactions in any terminal lifecycle state.
   *
   * Terminal:
   *
   * - COMPLETED
   * - FAILED
   * - REVERSED
   * - CANCELLED
   */
  public async findTerminal(): Promise<FinancialTransactionAggregate[]> {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        status: {
          in: ['COMPLETED', 'FAILED', 'REVERSED', 'CANCELLED'],
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async countByStatus(
    status: FinancialTransactionStatus,
  ): Promise<number> {
    return this.prisma.financialTransaction.count({
      where: {
        status: this.toPrismaFinancialTransactionStatus(status.value),
      },
    });
  }

  public async count(): Promise<number> {
    return this.prisma.financialTransaction.count();
  }

  // ===========================================================================
  // Transaction Classification
  // ===========================================================================

  public async findByType(
    type: FinancialTransactionType,
  ): Promise<FinancialTransactionAggregate[]> {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        type: this.toPrismaFinancialTransactionType(type.value),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByTypeAndStatus(
    type: FinancialTransactionType,
    status: FinancialTransactionStatus,
  ): Promise<FinancialTransactionAggregate[]> {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        type: this.toPrismaFinancialTransactionType(type.value),

        status: this.toPrismaFinancialTransactionStatus(status.value),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async countByType(type: FinancialTransactionType): Promise<number> {
    return this.prisma.financialTransaction.count({
      where: {
        type: this.toPrismaFinancialTransactionType(type.value),
      },
    });
  }

  public async countByTypeAndStatus(
    type: FinancialTransactionType,
    status: FinancialTransactionStatus,
  ): Promise<number> {
    return this.prisma.financialTransaction.count({
      where: {
        type: this.toPrismaFinancialTransactionType(type.value),

        status: this.toPrismaFinancialTransactionStatus(status.value),
      },
    });
  }

  // ===========================================================================
  // Currency Queries
  // ===========================================================================

  public async findByCurrency(
    currency: Currency,
  ): Promise<FinancialTransactionAggregate[]> {
    const records = await this.prisma.financialTransaction.findMany({
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

  public async findByCurrencyAndStatus(
    currency: Currency,
    status: FinancialTransactionStatus,
  ): Promise<FinancialTransactionAggregate[]> {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        currency: currency.value,

        status: this.toPrismaFinancialTransactionStatus(status.value),
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async usesCurrency(
    id: UniqueEntityId,
    currency: Currency,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialTransaction.count({
        where: {
          id: id.value,

          currency: currency.value,
        },
      })) > 0
    );
  }

  public async usesCurrencyByPublicId(
    publicId: FinancialTransactionPublicId,
    currency: Currency,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialTransaction.count({
        where: {
          publicId: publicId.value,

          currency: currency.value,
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Account Reference Queries
  // ===========================================================================

  public async findByAccount(
    account: FinancialAccountReference,
  ): Promise<FinancialTransactionAggregate[]> {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        OR: [
          {
            sourceAccount: {
              publicId: account.publicId,
            },
          },

          {
            destinationAccount: {
              publicId: account.publicId,
            },
          },

          {
            entries: {
              some: {
                account: {
                  publicId: account.publicId,
                },
              },
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

  public async findBySourceAccount(
    account: FinancialAccountReference,
  ): Promise<FinancialTransactionAggregate[]> {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        sourceAccount: {
          publicId: account.publicId,
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByDestinationAccount(
    account: FinancialAccountReference,
  ): Promise<FinancialTransactionAggregate[]> {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        destinationAccount: {
          publicId: account.publicId,
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async involvesAccount(
    id: UniqueEntityId,
    account: FinancialAccountReference,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialTransaction.count({
        where: {
          id: id.value,

          OR: [
            {
              sourceAccount: {
                publicId: account.publicId,
              },
            },

            {
              destinationAccount: {
                publicId: account.publicId,
              },
            },

            {
              entries: {
                some: {
                  account: {
                    publicId: account.publicId,
                  },
                },
              },
            },
          ],
        },
      })) > 0
    );
  }

  public async involvesAccountByPublicId(
    publicId: FinancialTransactionPublicId,
    account: FinancialAccountReference,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialTransaction.count({
        where: {
          publicId: publicId.value,

          OR: [
            {
              sourceAccount: {
                publicId: account.publicId,
              },
            },

            {
              destinationAccount: {
                publicId: account.publicId,
              },
            },

            {
              entries: {
                some: {
                  account: {
                    publicId: account.publicId,
                  },
                },
              },
            },
          ],
        },
      })) > 0
    );
  }

  public async countByAccount(
    account: FinancialAccountReference,
  ): Promise<number> {
    return this.prisma.financialTransaction.count({
      where: {
        OR: [
          {
            sourceAccount: {
              publicId: account.publicId,
            },
          },

          {
            destinationAccount: {
              publicId: account.publicId,
            },
          },

          {
            entries: {
              some: {
                account: {
                  publicId: account.publicId,
                },
              },
            },
          },
        ],
      },
    });
  }

  public async countBySourceAccount(
    account: FinancialAccountReference,
  ): Promise<number> {
    return this.prisma.financialTransaction.count({
      where: {
        sourceAccount: {
          publicId: account.publicId,
        },
      },
    });
  }

  public async countByDestinationAccount(
    account: FinancialAccountReference,
  ): Promise<number> {
    return this.prisma.financialTransaction.count({
      where: {
        destinationAccount: {
          publicId: account.publicId,
        },
      },
    });
  }

  // ===========================================================================
  // Business Reference Queries
  // ===========================================================================

  public async findByReference(
    reference: FinancialTransactionReference,
  ): Promise<FinancialTransactionAggregate[]> {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        referenceType: reference.type,

        referencePublicId: reference.publicId,
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async existsByReference(
    reference: FinancialTransactionReference,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialTransaction.count({
        where: {
          referenceType: reference.type,

          referencePublicId: reference.publicId,
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Accounting Reference Queries
  // ===========================================================================

  public async findByAccountingJournalPublicId(
    accountingJournalPublicId: string,
  ): Promise<FinancialTransactionAggregate | null> {
    const record = await this.prisma.financialTransaction.findFirst({
      where: {
        accountingJournalPublicId,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async hasAccountingJournal(id: UniqueEntityId): Promise<boolean> {
    return (
      (await this.prisma.financialTransaction.count({
        where: {
          id: id.value,

          accountingJournalPublicId: {
            not: null,
          },
        },
      })) > 0
    );
  }

  public async hasAccountingJournalByPublicId(
    publicId: FinancialTransactionPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialTransaction.count({
        where: {
          publicId: publicId.value,

          accountingJournalPublicId: {
            not: null,
          },
        },
      })) > 0
    );
  }

  public async findCompletedWithoutAccountingJournal(): Promise<
    FinancialTransactionAggregate[]
  > {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        status: 'COMPLETED',

        accountingJournalPublicId: null,
      },

      include: this.include,

      orderBy: {
        completedAt: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Entry Queries
  // ===========================================================================

  public async findEntriesByTransactionId(
    transactionId: UniqueEntityId,
  ): Promise<FinancialTransactionEntryEntity[]> {
    const transaction = await this.prisma.financialTransaction.findUnique({
      where: {
        id: transactionId.value,
      },

      select: {
        currency: true,
      },
    });

    if (transaction === null) {
      return [];
    }

    const entries = await this.prisma.financialTransactionEntry.findMany({
      where: {
        transactionId: transactionId.value,
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return entries.map((entry) =>
      FinancialTransactionPrismaMapper.entryToDomain(
        entry,
        transaction.currency,
      ),
    );
  }

  public async findEntriesByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<FinancialTransactionEntryEntity[]> {
    const transaction = await this.prisma.financialTransaction.findUnique({
      where: {
        publicId: transactionPublicId.value,
      },

      select: {
        id: true,
        currency: true,
      },
    });

    if (transaction === null) {
      return [];
    }

    const entries = await this.prisma.financialTransactionEntry.findMany({
      where: {
        transactionId: transaction.id,
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return entries.map((entry) =>
      FinancialTransactionPrismaMapper.entryToDomain(
        entry,
        transaction.currency,
      ),
    );
  }

  public async findEntryByPublicId(
    entryPublicId: FinancialTransactionEntryPublicId,
  ): Promise<FinancialTransactionEntryEntity | null> {
    const record = await this.prisma.financialTransactionEntry.findUnique({
      where: {
        publicId: entryPublicId.value,
      },

      include: {
        account: true,

        transaction: {
          select: {
            currency: true,
          },
        },
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialTransactionPrismaMapper.entryToDomain(
      record,
      record.transaction.currency,
    );
  }

  public async existsEntryByPublicId(
    entryPublicId: FinancialTransactionEntryPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialTransactionEntry.count({
        where: {
          publicId: entryPublicId.value,
        },
      })) > 0
    );
  }

  public async countEntries(transactionId: UniqueEntityId): Promise<number> {
    return this.prisma.financialTransactionEntry.count({
      where: {
        transactionId: transactionId.value,
      },
    });
  }

  // ===========================================================================
  // Entry Account Queries
  // ===========================================================================

  public async findEntriesByAccount(
    account: FinancialAccountReference,
  ): Promise<FinancialTransactionEntryEntity[]> {
    const entries = await this.prisma.financialTransactionEntry.findMany({
      where: {
        account: {
          publicId: account.publicId,
        },
      },

      include: {
        account: true,

        transaction: {
          select: {
            currency: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return entries.map((entry) =>
      FinancialTransactionPrismaMapper.entryToDomain(
        entry,
        entry.transaction.currency,
      ),
    );
  }

  public async findEntriesByAccountAndType(
    account: FinancialAccountReference,
    type: FinancialTransactionEntryType,
  ): Promise<FinancialTransactionEntryEntity[]> {
    const entries = await this.prisma.financialTransactionEntry.findMany({
      where: {
        account: {
          publicId: account.publicId,
        },

        type: this.toPrismaFinancialTransactionEntryType(type.value),
      },

      include: {
        account: true,

        transaction: {
          select: {
            currency: true,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return entries.map((entry) =>
      FinancialTransactionPrismaMapper.entryToDomain(
        entry,
        entry.transaction.currency,
      ),
    );
  }

  public async hasEntryForAccount(
    transactionId: UniqueEntityId,
    account: FinancialAccountReference,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialTransactionEntry.count({
        where: {
          transactionId: transactionId.value,

          account: {
            publicId: account.publicId,
          },
        },
      })) > 0
    );
  }

  public async hasEntryForAccountByPublicId(
    transactionPublicId: FinancialTransactionPublicId,
    account: FinancialAccountReference,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialTransactionEntry.count({
        where: {
          transaction: {
            publicId: transactionPublicId.value,
          },

          account: {
            publicId: account.publicId,
          },
        },
      })) > 0
    );
  }

  public async countEntriesByAccount(
    account: FinancialAccountReference,
  ): Promise<number> {
    return this.prisma.financialTransactionEntry.count({
      where: {
        account: {
          publicId: account.publicId,
        },
      },
    });
  }

  public async countEntriesByAccountAndType(
    account: FinancialAccountReference,
    type: FinancialTransactionEntryType,
  ): Promise<number> {
    return this.prisma.financialTransactionEntry.count({
      where: {
        account: {
          publicId: account.publicId,
        },

        type: this.toPrismaFinancialTransactionEntryType(type.value),
      },
    });
  }

  // ===========================================================================
  // Entry Direction Queries
  // ===========================================================================

  public async findDebitEntries(
    transactionId: UniqueEntityId,
  ): Promise<FinancialTransactionEntryEntity[]> {
    return this.findEntriesByTransactionIdAndType(
      transactionId,
      this.toFinancialTransactionEntryType('DEBIT'),
    );
  }

  public async findCreditEntries(
    transactionId: UniqueEntityId,
  ): Promise<FinancialTransactionEntryEntity[]> {
    return this.findEntriesByTransactionIdAndType(
      transactionId,
      this.toFinancialTransactionEntryType('CREDIT'),
    );
  }

  public async hasDebitEntry(transactionId: UniqueEntityId): Promise<boolean> {
    return (
      (await this.prisma.financialTransactionEntry.count({
        where: {
          transactionId: transactionId.value,

          type: 'DEBIT',
        },
      })) > 0
    );
  }

  public async hasCreditEntry(transactionId: UniqueEntityId): Promise<boolean> {
    return (
      (await this.prisma.financialTransactionEntry.count({
        where: {
          transactionId: transactionId.value,

          type: 'CREDIT',
        },
      })) > 0
    );
  }

  public async hasDoubleEntry(transactionId: UniqueEntityId): Promise<boolean> {
    const [debits, credits] = await Promise.all([
      this.hasDebitEntry(transactionId),
      this.hasCreditEntry(transactionId),
    ]);

    return debits && credits;
  }

  // ===========================================================================
  // Entry Balance Queries
  // ===========================================================================

  public async calculateTotalDebits(
    transactionId: UniqueEntityId,
  ): Promise<Money> {
    return this.calculateEntryTotal(transactionId, 'DEBIT');
  }

  public async calculateTotalCredits(
    transactionId: UniqueEntityId,
  ): Promise<Money> {
    return this.calculateEntryTotal(transactionId, 'CREDIT');
  }

  public async isBalanced(transactionId: UniqueEntityId): Promise<boolean> {
    const transaction = await this.prisma.financialTransaction.findUnique({
      where: {
        id: transactionId.value,
      },

      select: {
        currency: true,
      },
    });

    if (transaction === null) {
      return false;
    }

    const [debit, credit] = await Promise.all([
      this.prisma.financialTransactionEntry.aggregate({
        where: {
          transactionId: transactionId.value,

          type: 'DEBIT',
        },

        _sum: {
          amount: true,
        },
      }),

      this.prisma.financialTransactionEntry.aggregate({
        where: {
          transactionId: transactionId.value,

          type: 'CREDIT',
        },

        _sum: {
          amount: true,
        },
      }),
    ]);

    return (debit._sum.amount ?? 0) === (credit._sum.amount ?? 0);
  }

  public async isBalancedByPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<boolean> {
    const transaction = await this.prisma.financialTransaction.findUnique({
      where: {
        publicId: transactionPublicId.value,
      },

      select: {
        id: true,
      },
    });

    if (transaction === null) {
      return false;
    }

    return this.isBalanced(new UniqueEntityId(transaction.id));
  }

  // ===========================================================================
  // Transaction Amount Queries
  // ===========================================================================

  public async findByAmount(
    amount: Money,
  ): Promise<FinancialTransactionAggregate[]> {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        amount: amount.amount,

        currency: amount.currency.value,
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findByCurrencyAndAmount(
    currency: Currency,
    amount: Money,
  ): Promise<FinancialTransactionAggregate[]> {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        currency: currency.value,

        amount: amount.amount,
      },

      include: this.include,

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Transaction Integrity Queries
  // ===========================================================================

  public async findPendingWithEntries(): Promise<
    FinancialTransactionAggregate[]
  > {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        status: 'PENDING',

        entries: {
          some: {},
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findPendingWithoutEntries(): Promise<
    FinancialTransactionAggregate[]
  > {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        status: 'PENDING',

        entries: {
          none: {},
        },
      },

      include: this.include,

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) => this.toAggregate(record));
  }

  public async findCompletedWithUnbalancedEntries(): Promise<
    FinancialTransactionAggregate[]
  > {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        status: 'COMPLETED',

        entries: {
          some: {},
        },
      },

      include: this.include,

      orderBy: {
        completedAt: 'asc',
      },
    });

    return records
      .map((record) => this.toAggregate(record))
      .filter((aggregate) => this.aggregateIsUnbalanced(aggregate));
  }

  public async findCompletedWithAmountMismatch(): Promise<
    FinancialTransactionAggregate[]
  > {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        status: 'COMPLETED',

        entries: {
          some: {},
        },
      },

      include: this.include,

      orderBy: {
        completedAt: 'asc',
      },
    });

    return records
      .map((record) => this.toAggregate(record))
      .filter((aggregate) => this.aggregateHasAmountMismatch(aggregate));
  }

  /**
   * FinancialTransactionEntry deliberately has no currency column.
   *
   * Entry currency is inherited from FinancialTransaction.currency.
   *
   * Therefore a persisted entry cannot contain an independently different
   * currency under the current persistence model.
   *
   * This condition is structurally impossible and therefore produces no
   * records.
   *
   * Promise.resolve() is used instead of async/await because there is no
   * asynchronous work to perform.
   */
  public findWithEntryCurrencyMismatch(): Promise<
    FinancialTransactionAggregate[]
  > {
    return Promise.resolve([]);
  }

  // ===========================================================================
  // Aggregate Reconstruction
  // ===========================================================================

  /**
   * Rehydrates the complete Financial Transaction aggregate.
   */
  private toAggregate(
    record: FinancialTransactionWithRelations,
  ): FinancialTransactionAggregate {
    return FinancialTransactionPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Account Resolution
  // ===========================================================================

  /**
   * Converts all opaque domain FinancialAccountReference values into internal
   * Prisma FinancialAccount IDs.
   *
   * No database access occurs inside the mapper.
   *
   * Database resolution therefore belongs at this infrastructure repository
   * boundary.
   */
  private async resolveAggregateAccountIds(
    tx: Prisma.TransactionClient,
    aggregate: FinancialTransactionAggregate,
  ): Promise<Map<string, string>> {
    const publicIds = new Set<string>();

    // -------------------------------------------------------------------------
    // Source Account
    // -------------------------------------------------------------------------

    if (aggregate.transaction.sourceAccount !== undefined) {
      publicIds.add(aggregate.transaction.sourceAccount.publicId);
    }

    // -------------------------------------------------------------------------
    // Destination Account
    // -------------------------------------------------------------------------

    if (aggregate.transaction.destinationAccount !== undefined) {
      publicIds.add(aggregate.transaction.destinationAccount.publicId);
    }

    // -------------------------------------------------------------------------
    // Entry Accounts
    // -------------------------------------------------------------------------

    for (const entry of aggregate.entries) {
      publicIds.add(entry.account.publicId);
    }

    if (publicIds.size === 0) {
      return new Map();
    }

    const accounts = await tx.financialAccount.findMany({
      where: {
        publicId: {
          in: [...publicIds],
        },
      },

      select: {
        id: true,
        publicId: true,
      },
    });

    const accountIds = new Map<string, string>();

    for (const account of accounts) {
      accountIds.set(account.publicId, account.id);
    }

    // -------------------------------------------------------------------------
    // Referential Integrity
    // -------------------------------------------------------------------------

    for (const publicId of publicIds) {
      if (!accountIds.has(publicId)) {
        throw new Error(
          `Financial Account "${publicId}" referenced by Financial Transaction "${aggregate.transaction.publicId.value}" does not exist.`,
        );
      }
    }

    return accountIds;
  }

  // ===========================================================================
  // Entry Queries — Internal Helpers
  // ===========================================================================

  private async findEntriesByTransactionIdAndType(
    transactionId: UniqueEntityId,
    type: FinancialTransactionEntryType,
  ): Promise<FinancialTransactionEntryEntity[]> {
    const transaction = await this.prisma.financialTransaction.findUnique({
      where: {
        id: transactionId.value,
      },

      select: {
        currency: true,
      },
    });

    if (transaction === null) {
      return [];
    }

    const entries = await this.prisma.financialTransactionEntry.findMany({
      where: {
        transactionId: transactionId.value,

        type: this.toPrismaFinancialTransactionEntryType(type.value),
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return entries.map((entry) =>
      FinancialTransactionPrismaMapper.entryToDomain(
        entry,
        transaction.currency,
      ),
    );
  }

  // ===========================================================================
  // Entry Amount Helpers
  // ===========================================================================

  private async calculateEntryTotal(
    transactionId: UniqueEntityId,
    type: $Enums.FinancialTransactionEntryType,
  ): Promise<Money> {
    const transaction = await this.prisma.financialTransaction.findUnique({
      where: {
        id: transactionId.value,
      },

      select: {
        currency: true,
      },
    });

    if (transaction === null) {
      throw new Error(
        `Financial Transaction "${transactionId.value}" does not exist.`,
      );
    }

    const result = await this.prisma.financialTransactionEntry.aggregate({
      where: {
        transactionId: transactionId.value,

        type,
      },

      _sum: {
        amount: true,
      },
    });

    return Money.create(
      result._sum.amount ?? 0,
      Currency.create(transaction.currency),
    );
  }

  // ===========================================================================
  // Aggregate Integrity Helpers
  // ===========================================================================

  private aggregateIsUnbalanced(
    aggregate: FinancialTransactionAggregate,
  ): boolean {
    const debits = aggregate.entries
      .filter((entry) => entry.type.value === 'DEBIT')
      .reduce((total, entry) => total + entry.amount.amount, 0);

    const credits = aggregate.entries
      .filter((entry) => entry.type.value === 'CREDIT')
      .reduce((total, entry) => total + entry.amount.amount, 0);

    return debits !== credits;
  }

  private aggregateHasAmountMismatch(
    aggregate: FinancialTransactionAggregate,
  ): boolean {
    const debits = aggregate.entries
      .filter((entry) => entry.type.value === 'DEBIT')
      .reduce((total, entry) => total + entry.amount.amount, 0);

    const credits = aggregate.entries
      .filter((entry) => entry.type.value === 'CREDIT')
      .reduce((total, entry) => total + entry.amount.amount, 0);

    const transactionAmount = aggregate.transaction.amount.amount;

    return debits !== transactionAmount || credits !== transactionAmount;
  }

  // ===========================================================================
  // Domain Value-Object Helpers
  // ===========================================================================

  private toFinancialTransactionStatus(
    value: string,
  ): FinancialTransactionStatus {
    return FinancialTransactionStatus.create(value);
  }

  private toFinancialTransactionEntryType(
    value: string,
  ): FinancialTransactionEntryType {
    return FinancialTransactionEntryType.create(value);
  }
}
