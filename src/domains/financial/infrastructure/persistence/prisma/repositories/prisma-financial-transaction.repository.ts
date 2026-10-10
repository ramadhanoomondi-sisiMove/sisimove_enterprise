// -----------------------------------------------------------------------------
// sisiMove — Prisma Financial Transaction Repository
// -----------------------------------------------------------------------------
//
// Infrastructure implementation of the FinancialTransactionRepository
// contract.
//
// Aggregate boundary:
//
// FinancialTransactionAggregate
// ├── FinancialTransactionEntity
// └── FinancialTransactionEntryEntity[]
//
// Ownership:
//
// - FinancialTransaction is the aggregate root.
// - FinancialTransactionEntry is an aggregate-owned child entity.
// - FinancialAccount references remain opaque domain references.
// - Accounting references remain opaque identifiers.
//
// -----------------------------------------------------------------------------
//
// TRANSACTION PARTICIPATION:
//
// This repository does NOT create its own Prisma transactions.
//
// PrismaTransactionContext determines which Prisma client is currently
// available:
//
//     UnitOfWork
//         │
//         ▼
//     PrismaUnitOfWork
//         │
//         ▼
//     Prisma $transaction(tx)
//         │
//         ▼
//     PrismaTransactionContext
//         │
//         ▼
//     PrismaFinancialTransactionRepository
//
// When called inside a UnitOfWork, all operations use the transaction-scoped
// Prisma client.
//
// When called outside a UnitOfWork, the context falls back to PrismaService.
//
// This is essential because Financial Transaction persistence can participate
// in larger application workflows such as:
//
//     Booking
//        ↓
//     Payment
//        ↓
//     Financial Transaction
//        ↓
//     Financial Account
//
// The repository therefore never owns the transaction boundary.
//
// -----------------------------------------------------------------------------
//
// CROSS-DOMAIN ACCOUNT REFERENCES:
//
// The domain uses:
//
//   FinancialAccountReference
//   ├── type
//   └── publicId
//
// Prisma stores:
//
//   FinancialAccount.id
//
// Therefore this repository resolves:
//
//   FinancialAccountReference.publicId
//                 ↓
//        FinancialAccount.id
//
// before persistence.
//
// The repository never rehydrates or manages a FinancialAccount aggregate.
//
// -----------------------------------------------------------------------------
//
// AGGREGATE PERSISTENCE:
//
// FinancialTransaction
// └── FinancialTransactionEntry[]
//
// Entries are aggregate-owned children.
//
// The complete transaction aggregate is persisted through the same ambient
// Prisma client.
//
// No saveEntry() or deleteEntry() operation exists.
//
// -----------------------------------------------------------------------------
//
// ACCOUNTING:
//
// accountingJournalPublicId is persisted as an opaque identifier.
//
// This repository does not manage:
//
// - AccountingJournalAggregate
// - AccountingEntryAggregate
// - FinancialAccountAggregate
// - FinancialPaymentAggregate
// - FinancialAccountHoldAggregate
// - FinancialSettlementAggregate
// - FinancialAccountWithdrawalAggregate
// - FinancialDisbursementAggregate
//
// Accounting remains outside the Financial bounded context.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { $Enums, Prisma } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Transaction Context
// -----------------------------------------------------------------------------

import {
  PrismaTransactionContext,
  type PrismaClientLike,
} from '../../../../../../infrastructure/database/prisma/prisma-transaction.context';

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
} from '../mappers/financial-transaction-prisma.mapper';

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma infrastructure implementation of the Financial Transaction
 * repository.
 *
 * The repository is deliberately transaction-context aware.
 *
 * It does not create transactions itself because Financial Transaction
 * operations may participate in larger application workflows.
 *
 * The repository translates between:
 *
 *     FinancialTransactionAggregate
 *              ↕
 *     FinancialTransactionPrismaMapper
 *              ↕
 *     Prisma FinancialTransaction
 *
 * The aggregate owns its entry collection, so complete aggregate
 * rehydration includes the transaction entries.
 */
@Injectable()
export class PrismaFinancialTransactionRepository implements FinancialTransactionRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Resolves the Prisma client through the ambient transaction context.
   *
   * Inside UnitOfWork:
   *
   *     Prisma.TransactionClient
   *
   * Outside UnitOfWork:
   *
   *     PrismaService
   */
  public constructor(
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  // ===========================================================================
  // Current Prisma Client
  // ===========================================================================

  /**
   * Returns the Prisma client appropriate for the current execution context.
   *
   * This is the transaction boundary for this repository.
   */
  private get prisma(): PrismaClientLike {
    return this.transactionContext.getClient();
  }

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
   * The account relations are loaded because the domain uses opaque
   * FinancialAccountReference value objects rather than Prisma foreign-key
   * identifiers.
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
   * Persists the complete Financial Transaction aggregate.
   *
   * No repository-owned transaction is created.
   *
   * When called inside PrismaUnitOfWork, the transaction root and all
   * aggregate-owned entries participate in the caller's transaction.
   *
   * The persistence sequence is:
   *
   *     1. Resolve FinancialAccount references.
   *     2. Map the aggregate into persistence structures.
   *     3. Upsert the FinancialTransaction root.
   *     4. Replace the aggregate-owned entry collection.
   *
   * The caller owns the transaction boundary.
   */
  public async save(aggregate: FinancialTransactionAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('Financial Transaction aggregate is required.');
    }

    // -------------------------------------------------------------------------
    // Resolve opaque FinancialAccount references.
    // -------------------------------------------------------------------------

    const accountIds = await this.resolveAggregateAccountIds(aggregate);

    // -------------------------------------------------------------------------
    // Convert aggregate into persistence structures.
    // -------------------------------------------------------------------------

    const persistence = FinancialTransactionPrismaMapper.toPersistence(
      aggregate,
      accountIds,
    );

    // -------------------------------------------------------------------------
    // Financial Transaction Root
    // -------------------------------------------------------------------------

    await this.prisma.financialTransaction.upsert({
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

    // -------------------------------------------------------------------------
    // Aggregate-Owned Entries
    // -------------------------------------------------------------------------
    //
    // FinancialTransactionEntry is not an aggregate root.
    //
    // The aggregate owns the complete entry collection.
    //
    // Therefore the repository does not expose independent entry persistence.
    //
    // Existing entries are replaced with the current aggregate state.
    //
    // When save() executes inside a UnitOfWork, both the deletion and creation
    // participate in that same ambient database transaction.
    //
    // -------------------------------------------------------------------------

    await this.prisma.financialTransactionEntry.deleteMany({
      where: {
        transactionId: persistence.transaction.id,
      },
    });

    if (persistence.entries.length > 0) {
      await this.prisma.financialTransactionEntry.createMany({
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
        id: id.toString(),
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
    const count = await this.prisma.financialTransaction.count({
      where: {
        id: id.toString(),
      },
    });

    return count > 0;
  }

  /**
   * Determines whether a Financial Transaction exists by public identity.
   */
  public async existsByPublicId(
    publicId: FinancialTransactionPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.financialTransaction.count({
      where: {
        publicId: publicId.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  /**
   * Finds complete Financial Transaction aggregates by lifecycle status.
   */
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

  /**
   * Determines whether a transaction has the supplied lifecycle status.
   */
  public async hasStatus(
    id: UniqueEntityId,
    status: FinancialTransactionStatus,
  ): Promise<boolean> {
    const count = await this.prisma.financialTransaction.count({
      where: {
        id: id.toString(),

        status: this.toPrismaFinancialTransactionStatus(status.value),
      },
    });

    return count > 0;
  }

  /**
   * Finds pending transactions.
   */
  public async findPending(): Promise<FinancialTransactionAggregate[]> {
    return this.findByStatus(FinancialTransactionStatus.create('PENDING'));
  }

  /**
   * Finds completed transactions.
   */
  public async findCompleted(): Promise<FinancialTransactionAggregate[]> {
    return this.findByStatus(FinancialTransactionStatus.create('COMPLETED'));
  }

  /**
   * Finds failed transactions.
   */
  public async findFailed(): Promise<FinancialTransactionAggregate[]> {
    return this.findByStatus(FinancialTransactionStatus.create('FAILED'));
  }

  /**
   * Finds cancelled transactions.
   */
  public async findCancelled(): Promise<FinancialTransactionAggregate[]> {
    return this.findByStatus(FinancialTransactionStatus.create('CANCELLED'));
  }

  /**
   * Finds reversed transactions.
   */
  public async findReversed(): Promise<FinancialTransactionAggregate[]> {
    return this.findByStatus(FinancialTransactionStatus.create('REVERSED'));
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
          in: [
            this.toPrismaFinancialTransactionStatus('COMPLETED'),
            this.toPrismaFinancialTransactionStatus('FAILED'),
            this.toPrismaFinancialTransactionStatus('REVERSED'),
            this.toPrismaFinancialTransactionStatus('CANCELLED'),
          ],
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
   * Counts transactions by lifecycle status.
   */
  public async countByStatus(
    status: FinancialTransactionStatus,
  ): Promise<number> {
    return this.prisma.financialTransaction.count({
      where: {
        status: this.toPrismaFinancialTransactionStatus(status.value),
      },
    });
  }

  /**
   * Counts all Financial Transactions.
   */
  public async count(): Promise<number> {
    return this.prisma.financialTransaction.count();
  }

  // ===========================================================================
  // Transaction Classification
  // ===========================================================================

  /**
   * Finds transactions by transaction type.
   */
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

  /**
   * Finds transactions by type and lifecycle status.
   */
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

  /**
   * Counts transactions by type.
   */
  public async countByType(type: FinancialTransactionType): Promise<number> {
    return this.prisma.financialTransaction.count({
      where: {
        type: this.toPrismaFinancialTransactionType(type.value),
      },
    });
  }

  /**
   * Counts transactions by type and lifecycle status.
   */
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

  /**
   * Finds transactions using a currency.
   */
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

  /**
   * Finds transactions by currency and lifecycle status.
   */
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

  /**
   * Determines whether a transaction uses the supplied currency.
   */
  public async usesCurrency(
    id: UniqueEntityId,
    currency: Currency,
  ): Promise<boolean> {
    const count = await this.prisma.financialTransaction.count({
      where: {
        id: id.toString(),

        currency: currency.value,
      },
    });

    return count > 0;
  }

  /**
   * Determines whether a public transaction uses the supplied currency.
   */
  public async usesCurrencyByPublicId(
    publicId: FinancialTransactionPublicId,
    currency: Currency,
  ): Promise<boolean> {
    const count = await this.prisma.financialTransaction.count({
      where: {
        publicId: publicId.value,

        currency: currency.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Account Reference Queries
  // ===========================================================================

  /**
   * Finds transactions involving an account in any transaction role.
   *
   * An account may appear as:
   *
   * - source account;
   * - destination account;
   * - entry account.
   */
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

  /**
   * Finds transactions where the supplied account is the source account.
   */
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

  /**
   * Finds transactions where the supplied account is the destination account.
   */
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

  /**
   * Determines whether a transaction involves an account in any role.
   */
  public async involvesAccount(
    id: UniqueEntityId,
    account: FinancialAccountReference,
  ): Promise<boolean> {
    const count = await this.prisma.financialTransaction.count({
      where: {
        id: id.toString(),

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

    return count > 0;
  }

  /**
   * Determines whether a public transaction involves an account.
   */
  public async involvesAccountByPublicId(
    publicId: FinancialTransactionPublicId,
    account: FinancialAccountReference,
  ): Promise<boolean> {
    const count = await this.prisma.financialTransaction.count({
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
    });

    return count > 0;
  }

  /**
   * Counts transactions involving an account in any role.
   */
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

  /**
   * Counts transactions where an account is the source account.
   */
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

  /**
   * Counts transactions where an account is the destination account.
   */
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

  /**
   * Finds transactions associated with a business reference.
   *
   * Both reference fields are persisted as opaque identifiers.
   */
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

  /**
   * Determines whether any transaction exists for a business reference.
   */
  public async existsByReference(
    reference: FinancialTransactionReference,
  ): Promise<boolean> {
    const count = await this.prisma.financialTransaction.count({
      where: {
        referenceType: reference.type,

        referencePublicId: reference.publicId,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Accounting Reference Queries
  // ===========================================================================

  /**
   * Finds the transaction associated with an accounting journal.
   *
   * accountingJournalPublicId remains an opaque identifier.
   */
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

  /**
   * Determines whether a transaction has an accounting journal reference.
   */
  public async hasAccountingJournal(id: UniqueEntityId): Promise<boolean> {
    const count = await this.prisma.financialTransaction.count({
      where: {
        id: id.toString(),

        accountingJournalPublicId: {
          not: null,
        },
      },
    });

    return count > 0;
  }

  /**
   * Determines whether a public transaction has an accounting journal
   * reference.
   */
  public async hasAccountingJournalByPublicId(
    publicId: FinancialTransactionPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.financialTransaction.count({
      where: {
        publicId: publicId.value,

        accountingJournalPublicId: {
          not: null,
        },
      },
    });

    return count > 0;
  }

  /**
   * Finds completed transactions that have not yet received an accounting
   * journal reference.
   */
  public async findCompletedWithoutAccountingJournal(): Promise<
    FinancialTransactionAggregate[]
  > {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        status: this.toPrismaFinancialTransactionStatus('COMPLETED'),

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

  /**
   * Finds all aggregate-owned entries for a transaction.
   *
   * Entry currency is inherited from the owning transaction.
   */
  public async findEntriesByTransactionId(
    transactionId: UniqueEntityId,
  ): Promise<FinancialTransactionEntryEntity[]> {
    const transaction = await this.prisma.financialTransaction.findUnique({
      where: {
        id: transactionId.toString(),
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
        transactionId: transactionId.toString(),
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

  /**
   * Finds all aggregate-owned entries using the transaction public identity.
   */
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

  /**
   * Finds an aggregate-owned entry by public identity.
   */
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

  /**
   * Determines whether an entry exists by public identity.
   */
  public async existsEntryByPublicId(
    entryPublicId: FinancialTransactionEntryPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.financialTransactionEntry.count({
      where: {
        publicId: entryPublicId.value,
      },
    });

    return count > 0;
  }

  /**
   * Counts aggregate-owned entries for a transaction.
   */
  public async countEntries(transactionId: UniqueEntityId): Promise<number> {
    return this.prisma.financialTransactionEntry.count({
      where: {
        transactionId: transactionId.toString(),
      },
    });
  }

  // ===========================================================================
  // Entry Account Queries
  // ===========================================================================

  /**
   * Finds transaction entries belonging to an account.
   */
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

  /**
   * Finds transaction entries belonging to an account and having a specific
   * entry type.
   */
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

  /**
   * Determines whether a transaction contains an entry for an account.
   */
  public async hasEntryForAccount(
    transactionId: UniqueEntityId,
    account: FinancialAccountReference,
  ): Promise<boolean> {
    const count = await this.prisma.financialTransactionEntry.count({
      where: {
        transactionId: transactionId.toString(),

        account: {
          publicId: account.publicId,
        },
      },
    });

    return count > 0;
  }

  /**
   * Determines whether a public transaction contains an entry for an account.
   */
  public async hasEntryForAccountByPublicId(
    transactionPublicId: FinancialTransactionPublicId,
    account: FinancialAccountReference,
  ): Promise<boolean> {
    const count = await this.prisma.financialTransactionEntry.count({
      where: {
        transaction: {
          publicId: transactionPublicId.value,
        },

        account: {
          publicId: account.publicId,
        },
      },
    });

    return count > 0;
  }

  /**
   * Counts entries belonging to an account.
   */
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

  /**
   * Counts entries belonging to an account with a specific type.
   */
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

  /**
   * Finds debit entries for a transaction.
   */
  public async findDebitEntries(
    transactionId: UniqueEntityId,
  ): Promise<FinancialTransactionEntryEntity[]> {
    return this.findEntriesByTransactionIdAndType(
      transactionId,
      FinancialTransactionEntryType.create('DEBIT'),
    );
  }

  /**
   * Finds credit entries for a transaction.
   */
  public async findCreditEntries(
    transactionId: UniqueEntityId,
  ): Promise<FinancialTransactionEntryEntity[]> {
    return this.findEntriesByTransactionIdAndType(
      transactionId,
      FinancialTransactionEntryType.create('CREDIT'),
    );
  }

  /**
   * Determines whether a transaction contains a debit entry.
   */
  public async hasDebitEntry(transactionId: UniqueEntityId): Promise<boolean> {
    const count = await this.prisma.financialTransactionEntry.count({
      where: {
        transactionId: transactionId.toString(),

        type: this.toPrismaFinancialTransactionEntryType('DEBIT'),
      },
    });

    return count > 0;
  }

  /**
   * Determines whether a transaction contains a credit entry.
   */
  public async hasCreditEntry(transactionId: UniqueEntityId): Promise<boolean> {
    const count = await this.prisma.financialTransactionEntry.count({
      where: {
        transactionId: transactionId.toString(),

        type: this.toPrismaFinancialTransactionEntryType('CREDIT'),
      },
    });

    return count > 0;
  }

  /**
   * Determines whether the transaction has both debit and credit entries.
   */
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

  /**
   * Calculates the total debit amount for a transaction.
   */
  public async calculateTotalDebits(
    transactionId: UniqueEntityId,
  ): Promise<Money> {
    return this.calculateEntryTotal(
      transactionId,
      this.toPrismaFinancialTransactionEntryType('DEBIT'),
    );
  }

  /**
   * Calculates the total credit amount for a transaction.
   */
  public async calculateTotalCredits(
    transactionId: UniqueEntityId,
  ): Promise<Money> {
    return this.calculateEntryTotal(
      transactionId,
      this.toPrismaFinancialTransactionEntryType('CREDIT'),
    );
  }

  /**
   * Determines whether transaction debit and credit entries balance.
   */
  public async isBalanced(transactionId: UniqueEntityId): Promise<boolean> {
    const transaction = await this.prisma.financialTransaction.findUnique({
      where: {
        id: transactionId.toString(),
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
          transactionId: transactionId.toString(),

          type: this.toPrismaFinancialTransactionEntryType('DEBIT'),
        },

        _sum: {
          amount: true,
        },
      }),

      this.prisma.financialTransactionEntry.aggregate({
        where: {
          transactionId: transactionId.toString(),

          type: this.toPrismaFinancialTransactionEntryType('CREDIT'),
        },

        _sum: {
          amount: true,
        },
      }),
    ]);

    return (debit._sum.amount ?? 0) === (credit._sum.amount ?? 0);
  }

  /**
   * Determines whether a public transaction is balanced.
   */
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

  /**
   * Finds transactions with an exact monetary amount.
   */
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

  /**
   * Finds transactions by currency and exact monetary amount.
   */
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

  /**
   * Finds pending transactions that already contain entries.
   */
  public async findPendingWithEntries(): Promise<
    FinancialTransactionAggregate[]
  > {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        status: this.toPrismaFinancialTransactionStatus('PENDING'),

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

  /**
   * Finds pending transactions that do not yet contain entries.
   */
  public async findPendingWithoutEntries(): Promise<
    FinancialTransactionAggregate[]
  > {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        status: this.toPrismaFinancialTransactionStatus('PENDING'),

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

  /**
   * Finds completed transactions whose entries are not balanced.
   *
   * Prisma cannot directly compare the aggregate debit and credit sums in the
   * same relational query, so the aggregate is rehydrated and validated in
   * memory.
   */
  public async findCompletedWithUnbalancedEntries(): Promise<
    FinancialTransactionAggregate[]
  > {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        status: this.toPrismaFinancialTransactionStatus('COMPLETED'),

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

  /**
   * Finds completed transactions where entry totals do not match the
   * transaction amount.
   */
  public async findCompletedWithAmountMismatch(): Promise<
    FinancialTransactionAggregate[]
  > {
    const records = await this.prisma.financialTransaction.findMany({
      where: {
        status: this.toPrismaFinancialTransactionStatus('COMPLETED'),

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
   *
   * Prisma records are translated into domain objects exclusively through the
   * FinancialTransactionPrismaMapper.
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
   * Resolves all opaque FinancialAccountReference values contained by the
   * aggregate into internal Prisma FinancialAccount IDs.
   *
   * No database access occurs inside the mapper.
   *
   * Database resolution therefore belongs at this infrastructure repository
   * boundary.
   *
   * The lookup uses the ambient Prisma client so account resolution participates
   * in the caller's UnitOfWork transaction.
   */
  private async resolveAggregateAccountIds(
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

    const accounts = await this.prisma.financialAccount.findMany({
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

  /**
   * Finds transaction entries by transaction identity and entry type.
   *
   * Entry currency is inherited from the owning transaction.
   */
  private async findEntriesByTransactionIdAndType(
    transactionId: UniqueEntityId,
    type: FinancialTransactionEntryType,
  ): Promise<FinancialTransactionEntryEntity[]> {
    const transaction = await this.prisma.financialTransaction.findUnique({
      where: {
        id: transactionId.toString(),
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
        transactionId: transactionId.toString(),

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

  /**
   * Calculates the total amount for a particular entry direction.
   *
   * Entry currency is inherited from the transaction.
   */
  private async calculateEntryTotal(
    transactionId: UniqueEntityId,
    type: $Enums.FinancialTransactionEntryType,
  ): Promise<Money> {
    const transaction = await this.prisma.financialTransaction.findUnique({
      where: {
        id: transactionId.toString(),
      },

      select: {
        currency: true,
      },
    });

    if (transaction === null) {
      throw new Error(
        `Financial Transaction "${transactionId.toString()}" does not exist.`,
      );
    }

    const result = await this.prisma.financialTransactionEntry.aggregate({
      where: {
        transactionId: transactionId.toString(),

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

  /**
   * Determines whether aggregate debit and credit totals differ.
   */
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

  /**
   * Determines whether either debit or credit totals differ from the
   * transaction amount.
   */
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
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaFinancialTransactionRepository;
