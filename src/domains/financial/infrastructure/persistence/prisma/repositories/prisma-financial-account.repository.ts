// -----------------------------------------------------------------------------
// sisiMove — Prisma Financial Account Repository
// -----------------------------------------------------------------------------
//
// Infrastructure implementation of the FinancialAccountRepository contract.
//
// Aggregate boundary:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// Ownership:
//
// - FinancialAccount is the aggregate root.
// - FinancialAccountBalance is an aggregate-owned child entity.
// - Cross-domain references such as ownerPublicId remain opaque identifiers.
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
//     PrismaFinancialAccountRepository
//
// When called inside a UnitOfWork, all operations use the transaction-scoped
// Prisma client.
//
// When called outside a UnitOfWork, the context falls back to PrismaService.
//
// This is essential because Financial Account creation is part of the
// registration workflow. If Identity, TravellerProfile, TrustProfile,
// Authentication, or FinancialAccount creation fails, the complete
// registration transaction must roll back.
//
// -----------------------------------------------------------------------------
//
// CROSS-DOMAIN OWNERSHIP:
//
// FinancialAccount
//      │
//      └── ownerPublicId
//               │
//               ▼
//        Identity public ID
//
// ownerPublicId is an opaque public identifier.
//
// This repository never loads, queries, or resolves the Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// PERSISTENCE GRAPH:
//
// FinancialAccount
// └── FinancialAccountBalance
//
// The balance is persisted as part of the FinancialAccount aggregate and is
// therefore written through the same ambient Prisma transaction.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import { Prisma } from '@prisma/client';

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

import { FinancialAccountAggregate } from '../../../../domain/aggregates/financial-account.aggregate';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../../../domain/repositories/financial-account.repository';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import type { FinancialAccountEntity } from '../../../../domain/entities/financial-account.entity';

import type { FinancialAccountBalanceEntity } from '../../../../domain/entities/financial-account-balance.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../../../../domain/value-objects/financial-account-public-id.vo';

import type { FinancialAccountOwnerPublicId } from '../../../../domain/value-objects/financial-account-owner-public-id.vo';

import type { FinancialAccountBalancePublicId } from '../../../../domain/value-objects/financial-account-balance-public-id.vo';

import type { FinancialAccountType } from '../../../../domain/value-objects/financial-account-type.vo';

import { FinancialAccountStatus } from '../../../../domain/value-objects/financial-account-status.vo';

import type { Currency } from '../../../../domain/value-objects/currency.vo';

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  FinancialAccountPrismaMapper,
  type FinancialAccountWithBalance,
} from '../mappers/financial-account-prisma.mapper';

// =============================================================================
// Repository
// =============================================================================

/**
 * Prisma infrastructure implementation of the Financial Account repository.
 *
 * The repository is deliberately transaction-context aware.
 *
 * It does not create transactions itself because Financial Account operations
 * can participate in larger application workflows such as registration.
 *
 * The repository translates between:
 *
 *     FinancialAccountAggregate
 *              ↕
 *     FinancialAccountPrismaMapper
 *              ↕
 *     Prisma FinancialAccount
 *
 * The aggregate owns its balance, so aggregate rehydration includes the
 * FinancialAccountBalance record.
 */
@Injectable()
export class PrismaFinancialAccountRepository implements FinancialAccountRepository {
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
   * This is the critical transaction boundary for this repository.
   */
  private get prisma(): PrismaClientLike {
    return this.transactionContext.getClient();
  }

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persists the complete FinancialAccount aggregate.
   *
   * No repository-owned transaction is created.
   *
   * Therefore, when this method is called inside PrismaUnitOfWork:
   *
   *     FinancialAccount
   *          +
   *     FinancialAccountBalance
   *
   * both participate in the caller's transaction.
   */
  public async save(aggregate: FinancialAccountAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new Error('Financial Account aggregate is required.');
    }

    const persistence = FinancialAccountPrismaMapper.toPersistence(aggregate);

    // -------------------------------------------------------------------------
    // Financial Account Root
    // -------------------------------------------------------------------------

    await this.prisma.financialAccount.upsert({
      where: {
        id: persistence.account.id,
      },

      create: persistence.account,

      update: {
        publicId: persistence.account.publicId,
        type: persistence.account.type,
        status: persistence.account.status,
        ownerPublicId: persistence.account.ownerPublicId,
        currency: persistence.account.currency,
        updatedAt: persistence.account.updatedAt,
      },
    });

    // -------------------------------------------------------------------------
    // Aggregate-Owned Balance
    // -------------------------------------------------------------------------
    //
    // The balance is owned by the FinancialAccount aggregate.
    //
    // accountId uniquely identifies the balance belonging to the aggregate
    // root.
    //
    // No separate transaction is created here.
    //
    // -------------------------------------------------------------------------

    await this.prisma.financialAccountBalance.upsert({
      where: {
        accountId: persistence.balance.accountId,
      },

      create: persistence.balance,

      update: {
        publicId: persistence.balance.publicId,
        availableAmount: persistence.balance.availableAmount,
        pendingAmount: persistence.balance.pendingAmount,
        heldAmount: persistence.balance.heldAmount,
        currency: persistence.balance.currency,
        version: persistence.balance.version,
        updatedAt: persistence.balance.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds and rehydrates the complete FinancialAccount aggregate by internal
   * persistence identity.
   */
  public async findById(
    id: UniqueEntityId,
  ): Promise<FinancialAccountAggregate | null> {
    const record = await this.prisma.financialAccount.findUnique({
      where: {
        id: id.toString(),
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds and rehydrates the complete FinancialAccount aggregate by public
   * identity.
   */
  public async findByPublicId(
    publicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountAggregate | null> {
    const record = await this.prisma.financialAccount.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds the FinancialAccount aggregate belonging to an owner.
   *
   * ownerPublicId remains an opaque cross-domain reference.
   */
  public async findByOwnerPublicId(
    ownerPublicId: FinancialAccountOwnerPublicId,
  ): Promise<FinancialAccountAggregate | null> {
    const record = await this.prisma.financialAccount.findUnique({
      where: {
        ownerPublicId: ownerPublicId.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds an owner's FinancialAccount by lifecycle status.
   */
  public async findByOwnerPublicIdAndStatus(
    ownerPublicId: FinancialAccountOwnerPublicId,
    status: FinancialAccountStatus,
  ): Promise<FinancialAccountAggregate | null> {
    const record = await this.prisma.financialAccount.findFirst({
      where: {
        ownerPublicId: ownerPublicId.value,
        status: status.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds only the FinancialAccount root entity by internal identity.
   *
   * The aggregate-owned balance is deliberately not loaded.
   */
  public async findAccountById(
    id: UniqueEntityId,
  ): Promise<FinancialAccountEntity | null> {
    const record = await this.prisma.financialAccount.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null
      ? null
      : FinancialAccountPrismaMapper.accountToDomain(record);
  }

  /**
   * Finds only the FinancialAccount root entity by public identity.
   */
  public async findAccountByPublicId(
    publicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountEntity | null> {
    const record = await this.prisma.financialAccount.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null
      ? null
      : FinancialAccountPrismaMapper.accountToDomain(record);
  }

  /**
   * Returns all FinancialAccount root entities.
   *
   * The balance is intentionally not loaded.
   */
  public async findAccounts(): Promise<FinancialAccountEntity[]> {
    const records = await this.prisma.financialAccount.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountPrismaMapper.accountToDomain(record),
    );
  }

  // ===========================================================================
  // Delete / Exists
  // ===========================================================================

  /**
   * Deletes the FinancialAccount aggregate root.
   *
   * No repository-owned transaction is created.
   *
   * Referential cleanup is expected to be handled by the Prisma relation
   * configuration where appropriate.
   */
  public async delete(id: UniqueEntityId): Promise<void> {
    const account = await this.prisma.financialAccount.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    if (account === null) {
      return;
    }

    await this.prisma.financialAccount.delete({
      where: {
        id: account.id,
      },
    });
  }

  /**
   * Determines whether a FinancialAccount exists by internal identity.
   */
  public async exists(id: UniqueEntityId): Promise<boolean> {
    const count = await this.prisma.financialAccount.count({
      where: {
        id: id.toString(),
      },
    });

    return count > 0;
  }

  /**
   * Determines whether a FinancialAccount exists by public identity.
   */
  public async existsByPublicId(
    publicId: FinancialAccountPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.financialAccount.count({
      where: {
        publicId: publicId.value,
      },
    });

    return count > 0;
  }

  /**
   * Determines whether an owner already has a FinancialAccount.
   *
   * This is used directly by account creation to enforce the one-account-per-
   * owner invariant.
   */
  public async existsByOwnerPublicId(
    ownerPublicId: FinancialAccountOwnerPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.financialAccount.count({
      where: {
        ownerPublicId: ownerPublicId.value,
      },
    });

    return count > 0;
  }

  /**
   * Determines whether an owner has an account with the supplied status.
   */
  public async existsByOwnerPublicIdAndStatus(
    ownerPublicId: FinancialAccountOwnerPublicId,
    status: FinancialAccountStatus,
  ): Promise<boolean> {
    const count = await this.prisma.financialAccount.count({
      where: {
        ownerPublicId: ownerPublicId.value,
        status: status.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Account Classification Queries
  // ===========================================================================

  /**
   * Finds accounts by account type.
   */
  public async findAccountsByType(
    type: FinancialAccountType,
  ): Promise<FinancialAccountEntity[]> {
    const records = await this.prisma.financialAccount.findMany({
      where: {
        type: type.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountPrismaMapper.accountToDomain(record),
    );
  }

  /**
   * Finds accounts by lifecycle status.
   */
  public async findAccountsByStatus(
    status: FinancialAccountStatus,
  ): Promise<FinancialAccountEntity[]> {
    const records = await this.prisma.financialAccount.findMany({
      where: {
        status: status.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountPrismaMapper.accountToDomain(record),
    );
  }

  /**
   * Finds accounts using a specific currency.
   */
  public async findAccountsByCurrency(
    currency: Currency,
  ): Promise<FinancialAccountEntity[]> {
    const records = await this.prisma.financialAccount.findMany({
      where: {
        currency: currency.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountPrismaMapper.accountToDomain(record),
    );
  }

  /**
   * Finds accounts by type and lifecycle status.
   */
  public async findAccountsByTypeAndStatus(
    type: FinancialAccountType,
    status: FinancialAccountStatus,
  ): Promise<FinancialAccountEntity[]> {
    const records = await this.prisma.financialAccount.findMany({
      where: {
        type: type.value,
        status: status.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountPrismaMapper.accountToDomain(record),
    );
  }

  /**
   * Finds accounts by currency and lifecycle status.
   */
  public async findAccountsByCurrencyAndStatus(
    currency: Currency,
    status: FinancialAccountStatus,
  ): Promise<FinancialAccountEntity[]> {
    const records = await this.prisma.financialAccount.findMany({
      where: {
        currency: currency.value,
        status: status.value,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountPrismaMapper.accountToDomain(record),
    );
  }

  // ===========================================================================
  // Currency Compatibility
  // ===========================================================================

  /**
   * Determines whether an account uses the supplied currency.
   */
  public async usesCurrency(
    accountId: UniqueEntityId,
    currency: Currency,
  ): Promise<boolean> {
    const count = await this.prisma.financialAccount.count({
      where: {
        id: accountId.toString(),
        currency: currency.value,
      },
    });

    return count > 0;
  }

  /**
   * Determines whether a public account uses the supplied currency.
   */
  public async usesCurrencyByPublicId(
    accountPublicId: FinancialAccountPublicId,
    currency: Currency,
  ): Promise<boolean> {
    const count = await this.prisma.financialAccount.count({
      where: {
        publicId: accountPublicId.value,
        currency: currency.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Account Lifecycle Queries
  // ===========================================================================

  /**
   * Finds active FinancialAccounts.
   */
  public async findActiveAccounts(): Promise<FinancialAccountEntity[]> {
    return this.findAccountsByStatus(FinancialAccountStatus.create('ACTIVE'));
  }

  /**
   * Finds suspended FinancialAccounts.
   */
  public async findSuspendedAccounts(): Promise<FinancialAccountEntity[]> {
    return this.findAccountsByStatus(
      FinancialAccountStatus.create('SUSPENDED'),
    );
  }

  /**
   * Finds closed FinancialAccounts.
   */
  public async findClosedAccounts(): Promise<FinancialAccountEntity[]> {
    return this.findAccountsByStatus(FinancialAccountStatus.create('CLOSED'));
  }

  /**
   * Counts FinancialAccounts by lifecycle status.
   */
  public async countByStatus(status: FinancialAccountStatus): Promise<number> {
    return this.prisma.financialAccount.count({
      where: {
        status: status.value,
      },
    });
  }

  /**
   * Counts all FinancialAccounts.
   */
  public async count(): Promise<number> {
    return this.prisma.financialAccount.count();
  }

  // ===========================================================================
  // Aggregate-Owned Balance Queries
  // ===========================================================================

  /**
   * Finds the balance belonging to a FinancialAccount.
   *
   * The balance remains an entity inside the FinancialAccount aggregate.
   */
  public async findBalanceByAccountId(
    accountId: UniqueEntityId,
  ): Promise<FinancialAccountBalanceEntity | null> {
    const record = await this.prisma.financialAccountBalance.findUnique({
      where: {
        accountId: accountId.toString(),
      },
    });

    return record === null
      ? null
      : FinancialAccountPrismaMapper.balanceToDomain(record);
  }

  /**
   * Finds the balance belonging to an account identified by public identity.
   */
  public async findBalanceByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountBalanceEntity | null> {
    const record = await this.prisma.financialAccountBalance.findFirst({
      where: {
        account: {
          publicId: accountPublicId.value,
        },
      },
    });

    return record === null
      ? null
      : FinancialAccountPrismaMapper.balanceToDomain(record);
  }

  /**
   * Finds a FinancialAccount balance by public identity.
   */
  public async findBalanceByPublicId(
    publicId: FinancialAccountBalancePublicId,
  ): Promise<FinancialAccountBalanceEntity | null> {
    const record = await this.prisma.financialAccountBalance.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null
      ? null
      : FinancialAccountPrismaMapper.balanceToDomain(record);
  }

  /**
   * Determines whether a FinancialAccount has a balance.
   */
  public async existsBalance(accountId: UniqueEntityId): Promise<boolean> {
    const count = await this.prisma.financialAccountBalance.count({
      where: {
        accountId: accountId.toString(),
      },
    });

    return count > 0;
  }

  /**
   * Finds and rehydrates the FinancialAccount aggregate that owns a balance.
   */
  public async findByBalancePublicId(
    balancePublicId: FinancialAccountBalancePublicId,
  ): Promise<FinancialAccountAggregate | null> {
    const record = await this.prisma.financialAccountBalance.findUnique({
      where: {
        publicId: balancePublicId.value,
      },

      include: {
        account: {
          include: this.include,
        },
      },
    });

    if (record === null) {
      return null;
    }

    return this.toAggregate(record.account);
  }

  // ===========================================================================
  // Balance State Queries
  // ===========================================================================

  /**
   * Finds accounts with positive available funds.
   *
   * Only the FinancialAccount root is mapped because this repository method
   * returns FinancialAccountEntity rather than the complete aggregate.
   */
  public async findAccountsWithAvailableFunds(): Promise<
    FinancialAccountEntity[]
  > {
    const records = await this.prisma.financialAccount.findMany({
      where: {
        balance: {
          is: {
            availableAmount: {
              gt: 0,
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountPrismaMapper.accountToDomain(record),
    );
  }

  /**
   * Finds accounts with positive pending funds.
   */
  public async findAccountsWithPendingFunds(): Promise<
    FinancialAccountEntity[]
  > {
    const records = await this.prisma.financialAccount.findMany({
      where: {
        balance: {
          is: {
            pendingAmount: {
              gt: 0,
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountPrismaMapper.accountToDomain(record),
    );
  }

  /**
   * Finds accounts with positive held funds.
   */
  public async findAccountsWithHeldFunds(): Promise<FinancialAccountEntity[]> {
    const records = await this.prisma.financialAccount.findMany({
      where: {
        balance: {
          is: {
            heldAmount: {
              gt: 0,
            },
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountPrismaMapper.accountToDomain(record),
    );
  }

  /**
   * Finds accounts whose complete monetary state is zero.
   *
   * available = 0
   * pending   = 0
   * held      = 0
   */
  public async findZeroBalanceAccounts(): Promise<FinancialAccountEntity[]> {
    const records = await this.prisma.financialAccount.findMany({
      where: {
        balance: {
          is: {
            availableAmount: 0,
            pendingAmount: 0,
            heldAmount: 0,
          },
        },
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountPrismaMapper.accountToDomain(record),
    );
  }

  /**
   * Determines whether an account has at least the requested available funds.
   */
  public async hasAvailableFunds(
    accountId: UniqueEntityId,
    amount: number,
  ): Promise<boolean> {
    const count = await this.prisma.financialAccountBalance.count({
      where: {
        accountId: accountId.toString(),

        availableAmount: {
          gte: amount,
        },
      },
    });

    return count > 0;
  }

  /**
   * Determines whether an account has at least the requested pending funds.
   */
  public async hasPendingFunds(
    accountId: UniqueEntityId,
    amount: number,
  ): Promise<boolean> {
    const count = await this.prisma.financialAccountBalance.count({
      where: {
        accountId: accountId.toString(),

        pendingAmount: {
          gte: amount,
        },
      },
    });

    return count > 0;
  }

  /**
   * Determines whether an account has at least the requested held funds.
   */
  public async hasHeldFunds(
    accountId: UniqueEntityId,
    amount: number,
  ): Promise<boolean> {
    const count = await this.prisma.financialAccountBalance.count({
      where: {
        accountId: accountId.toString(),

        heldAmount: {
          gte: amount,
        },
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Balance State Aggregation
  // ===========================================================================

  /**
   * Counts accounts with positive available funds.
   */
  public async countAccountsWithAvailableFunds(): Promise<number> {
    return this.prisma.financialAccount.count({
      where: {
        balance: {
          is: {
            availableAmount: {
              gt: 0,
            },
          },
        },
      },
    });
  }

  /**
   * Counts accounts with positive pending funds.
   */
  public async countAccountsWithPendingFunds(): Promise<number> {
    return this.prisma.financialAccount.count({
      where: {
        balance: {
          is: {
            pendingAmount: {
              gt: 0,
            },
          },
        },
      },
    });
  }

  /**
   * Counts accounts with positive held funds.
   */
  public async countAccountsWithHeldFunds(): Promise<number> {
    return this.prisma.financialAccount.count({
      where: {
        balance: {
          is: {
            heldAmount: {
              gt: 0,
            },
          },
        },
      },
    });
  }

  /**
   * Counts accounts whose complete monetary state is zero.
   */
  public async countZeroBalanceAccounts(): Promise<number> {
    return this.prisma.financialAccount.count({
      where: {
        balance: {
          is: {
            availableAmount: 0,
            pendingAmount: 0,
            heldAmount: 0,
          },
        },
      },
    });
  }

  // ===========================================================================
  // Prisma Include Graph
  // ===========================================================================

  /**
   * Complete aggregate rehydration graph.
   *
   * The balance is part of the FinancialAccount aggregate and is therefore
   * loaded whenever the complete aggregate is requested.
   */
  private readonly include = {
    balance: true,
  } satisfies Prisma.FinancialAccountInclude;

  // ===========================================================================
  // Aggregate Reconstruction
  // ===========================================================================

  /**
   * Rehydrates the complete FinancialAccount aggregate.
   *
   * Prisma records are translated into domain entities exclusively through the
   * FinancialAccountPrismaMapper.
   */
  private toAggregate(
    record: FinancialAccountWithBalance,
  ): FinancialAccountAggregate {
    return FinancialAccountPrismaMapper.toDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaFinancialAccountRepository;
