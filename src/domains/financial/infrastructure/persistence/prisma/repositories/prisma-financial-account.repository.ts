// -----------------------------------------------------------------------------
// Prisma Financial Account Repository
// -----------------------------------------------------------------------------
//
// Infrastructure repository for the Financial Account aggregate.
//
// Aggregate boundary:
//
// FinancialAccountAggregate
// ├── FinancialAccountEntity
// └── FinancialAccountBalanceEntity
//
// Responsibilities:
//
// - Aggregate persistence and rehydration
// - Financial Account root queries
// - Owner queries
// - Account classification queries
// - Account lifecycle queries
// - Currency queries
// - Aggregate-owned balance queries
// - Balance state queries
// - Existence / count queries
//
// The repository does NOT expose:
//
// - FinancialTransactionAggregate
// - FinancialPaymentAggregate
// - FinancialAccountHoldAggregate
// - FinancialSettlementAggregate
// - FinancialAccountWithdrawalAggregate
// - FinancialDisbursementAggregate
//
// Cross-domain references such as ownerPublicId are persisted as opaque
// public identifiers and are not modeled as Prisma relations.
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

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountAggregate } from '../../../../domain/aggregates/financial-account.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import type { FinancialAccountEntity } from '../../../../domain/entities/financial-account.entity';

import type { FinancialAccountBalanceEntity } from '../../../../domain/entities/financial-account-balance.entity';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { FinancialAccountRepository } from '../../../../domain/repositories/financial-account.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../../../../domain/value-objects/financial-account-public-id.vo';

import type { FinancialAccountOwnerPublicId } from '../../../../domain/value-objects/financial-account-owner-public-id.vo';

import type { FinancialAccountBalancePublicId } from '../../../../domain/value-objects/financial-account-balance-public-id.vo';

import type { FinancialAccountType } from '../../../../domain/value-objects/financial-account-type.vo';

import {
  FinancialAccountStatus,
  type FinancialAccountStatusValue,
} from '../../../../domain/value-objects/financial-account-status.vo';

import type { Currency } from '../../../../domain/value-objects/currency.vo';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  FinancialAccountPrismaMapper,
  type FinancialAccountWithBalance,
} from '../../../persistence/prisma/mappers/financial-account-prisma.mapper';

// =============================================================================
// Internal ID
// =============================================================================
//
// Financial Account does not expose a dedicated persistence ID value object.
//
// Entity.id therefore remains:
//
// UniqueEntityId
//
// -----------------------------------------------------------------------------

type FinancialAccountId = UniqueEntityId;

// =============================================================================
// Repository
// =============================================================================

export class PrismaFinancialAccountRepository implements FinancialAccountRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Prisma Enum Boundary
  // ===========================================================================

  /**
   * Converts a domain account type value into the Prisma enum.
   *
   * The repository is the infrastructure boundary between domain values and
   * Prisma persistence values.
   */
  private toPrismaFinancialAccountType(
    value: string,
  ): $Enums.FinancialAccountType {
    return value as $Enums.FinancialAccountType;
  }

  /**
   * Converts a domain account status value into the Prisma enum.
   *
   * FinancialAccountStatus is validated before reaching this boundary.
   */
  private toPrismaFinancialAccountStatus(
    value: FinancialAccountStatusValue,
  ): $Enums.FinancialAccountStatus {
    return value;
  }

  // ===========================================================================
  // Include Graph
  // ===========================================================================

  /**
   * Complete Financial Account aggregate persistence graph.
   *
   * The balance is an aggregate-owned entity and therefore must be loaded
   * together with the Financial Account root when rehydrating the aggregate.
   */
  private readonly include = {
    balance: true,
  } satisfies Prisma.FinancialAccountInclude;

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persists the complete Financial Account aggregate atomically.
   *
   * Persistence boundary:
   *
   * FinancialAccount
   * └── FinancialAccountBalance
   *
   * The balance is upserted as part of the same database transaction.
   */
  public async save(aggregate: FinancialAccountAggregate): Promise<void> {
    const persistence = FinancialAccountPrismaMapper.toPersistence(aggregate);

    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Root
      // -----------------------------------------------------------------------

      await tx.financialAccount.upsert({
        where: {
          id: persistence.account.id,
        },

        create: {
          id: persistence.account.id,

          publicId: persistence.account.publicId,

          type: this.toPrismaFinancialAccountType(persistence.account.type),

          status: this.toPrismaFinancialAccountStatus(
            persistence.account.status,
          ),

          ownerPublicId: persistence.account.ownerPublicId,

          currency: persistence.account.currency,

          createdAt: persistence.account.createdAt,

          updatedAt: persistence.account.updatedAt,
        },

        update: {
          publicId: persistence.account.publicId,

          type: this.toPrismaFinancialAccountType(persistence.account.type),

          status: this.toPrismaFinancialAccountStatus(
            persistence.account.status,
          ),

          ownerPublicId: persistence.account.ownerPublicId,

          currency: persistence.account.currency,

          updatedAt: persistence.account.updatedAt,
        },
      });

      // -----------------------------------------------------------------------
      // Aggregate-Owned Balance
      // -----------------------------------------------------------------------
      //
      // FinancialAccountBalance has a unique accountId.
      //
      // The balance therefore belongs to exactly one Financial Account.
      //
      // Upsert guarantees:
      //
      // FinancialAccount
      //      │
      //      └── exactly one FinancialAccountBalance
      //
      // -----------------------------------------------------------------------

      await tx.financialAccountBalance.upsert({
        where: {
          accountId: persistence.balance.accountId,
        },

        create: {
          id: persistence.balance.id,

          publicId: persistence.balance.publicId,

          accountId: persistence.balance.accountId,

          availableAmount: persistence.balance.availableAmount,

          pendingAmount: persistence.balance.pendingAmount,

          heldAmount: persistence.balance.heldAmount,

          currency: persistence.balance.currency,

          version: persistence.balance.version,

          createdAt: persistence.balance.createdAt,

          updatedAt: persistence.balance.updatedAt,
        },

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
    });
  }

  // ===========================================================================
  // Aggregate Lookup
  // ===========================================================================

  /**
   * Finds and rehydrates the complete Financial Account aggregate by
   * internal persistence identity.
   */
  public async findById(
    id: FinancialAccountId,
  ): Promise<FinancialAccountAggregate | null> {
    const record = await this.prisma.financialAccount.findUnique({
      where: {
        id: id.value,
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds and rehydrates the complete Financial Account aggregate by
   * public identity.
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

  // ===========================================================================
  // Delete / Exists
  // ===========================================================================

  /**
   * Deletes the complete Financial Account aggregate atomically.
   *
   * The aggregate-owned balance is explicitly deleted before the root.
   */
  public async delete(id: FinancialAccountId): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Aggregate-Owned Balance
      // -----------------------------------------------------------------------

      await tx.financialAccountBalance.deleteMany({
        where: {
          accountId: id.value,
        },
      });

      // -----------------------------------------------------------------------
      // Root
      // -----------------------------------------------------------------------

      await tx.financialAccount.delete({
        where: {
          id: id.value,
        },
      });
    });
  }

  /**
   * Determines whether a Financial Account exists by internal identity.
   */
  public async exists(id: FinancialAccountId): Promise<boolean> {
    return (
      (await this.prisma.financialAccount.count({
        where: {
          id: id.value,
        },
      })) > 0
    );
  }

  /**
   * Determines whether a Financial Account exists by public identity.
   */
  public async existsByPublicId(
    publicId: FinancialAccountPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialAccount.count({
        where: {
          publicId: publicId.value,
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Account Root Queries
  // ===========================================================================

  /**
   * Finds only the Financial Account root entity.
   *
   * The aggregate-owned balance is deliberately not loaded.
   */
  public async findAccountById(
    id: FinancialAccountId,
  ): Promise<FinancialAccountEntity | null> {
    const record = await this.prisma.financialAccount.findUnique({
      where: {
        id: id.value,
      },
    });

    return record === null
      ? null
      : FinancialAccountPrismaMapper.accountToDomain(record);
  }

  /**
   * Finds only the Financial Account root entity by public identity.
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
   * Returns all Financial Account root entities.
   *
   * Balance is intentionally not loaded.
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
  // Owner Queries
  // ===========================================================================

  /**
   * Finds the Financial Account aggregate belonging to an owner.
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
   * Determines whether an owner has a Financial Account.
   */
  public async existsByOwnerPublicId(
    ownerPublicId: FinancialAccountOwnerPublicId,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialAccount.count({
        where: {
          ownerPublicId: ownerPublicId.value,
        },
      })) > 0
    );
  }

  /**
   * Finds an owner's Financial Account by lifecycle status.
   */
  public async findByOwnerPublicIdAndStatus(
    ownerPublicId: FinancialAccountOwnerPublicId,
    status: FinancialAccountStatus,
  ): Promise<FinancialAccountAggregate | null> {
    const record = await this.prisma.financialAccount.findFirst({
      where: {
        ownerPublicId: ownerPublicId.value,

        status: this.toPrismaFinancialAccountStatus(status.value),
      },

      include: this.include,
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Determines whether an owner has an account with the specified status.
   */
  public async existsByOwnerPublicIdAndStatus(
    ownerPublicId: FinancialAccountOwnerPublicId,
    status: FinancialAccountStatus,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialAccount.count({
        where: {
          ownerPublicId: ownerPublicId.value,

          status: this.toPrismaFinancialAccountStatus(status.value),
        },
      })) > 0
    );
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
        type: this.toPrismaFinancialAccountType(type.value),
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
        status: this.toPrismaFinancialAccountStatus(status.value),
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
        type: this.toPrismaFinancialAccountType(type.value),

        status: this.toPrismaFinancialAccountStatus(status.value),
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

        status: this.toPrismaFinancialAccountStatus(status.value),
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
   * Determines whether an account uses the specified currency.
   */
  public async usesCurrency(
    accountId: FinancialAccountId,
    currency: Currency,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialAccount.count({
        where: {
          id: accountId.value,

          currency: currency.value,
        },
      })) > 0
    );
  }

  /**
   * Determines whether a public account uses the specified currency.
   */
  public async usesCurrencyByPublicId(
    accountPublicId: FinancialAccountPublicId,
    currency: Currency,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialAccount.count({
        where: {
          publicId: accountPublicId.value,

          currency: currency.value,
        },
      })) > 0
    );
  }

  // ===========================================================================
  // Account Lifecycle Queries
  // ===========================================================================

  /**
   * Finds active Financial Accounts.
   */
  public async findActiveAccounts(): Promise<FinancialAccountEntity[]> {
    return this.findAccountsByStatus(FinancialAccountStatus.create('ACTIVE'));
  }

  /**
   * Finds suspended Financial Accounts.
   */
  public async findSuspendedAccounts(): Promise<FinancialAccountEntity[]> {
    return this.findAccountsByStatus(
      FinancialAccountStatus.create('SUSPENDED'),
    );
  }

  /**
   * Finds closed Financial Accounts.
   */
  public async findClosedAccounts(): Promise<FinancialAccountEntity[]> {
    return this.findAccountsByStatus(FinancialAccountStatus.create('CLOSED'));
  }

  /**
   * Counts Financial Accounts by lifecycle status.
   */
  public async countByStatus(status: FinancialAccountStatus): Promise<number> {
    return this.prisma.financialAccount.count({
      where: {
        status: this.toPrismaFinancialAccountStatus(status.value),
      },
    });
  }

  /**
   * Counts all Financial Accounts.
   */
  public async count(): Promise<number> {
    return this.prisma.financialAccount.count();
  }

  // ===========================================================================
  // Aggregate-Owned Balance Queries
  // ===========================================================================

  /**
   * Finds the balance belonging to a Financial Account.
   *
   * The balance remains an entity inside the Financial Account aggregate.
   */
  public async findBalanceByAccountId(
    accountId: FinancialAccountId,
  ): Promise<FinancialAccountBalanceEntity | null> {
    const record = await this.prisma.financialAccountBalance.findUnique({
      where: {
        accountId: accountId.value,
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
   * Finds a Financial Account balance by its public identity.
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
   * Determines whether a Financial Account has a balance.
   */
  public async existsBalance(accountId: FinancialAccountId): Promise<boolean> {
    return (
      (await this.prisma.financialAccountBalance.count({
        where: {
          accountId: accountId.value,
        },
      })) > 0
    );
  }

  /**
   * Finds and rehydrates the Financial Account aggregate that owns a balance.
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
   * Only the Financial Account root is mapped because the repository contract
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
    accountId: FinancialAccountId,
    amount: number,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialAccountBalance.count({
        where: {
          accountId: accountId.value,

          availableAmount: {
            gte: amount,
          },
        },
      })) > 0
    );
  }

  /**
   * Determines whether an account has at least the requested pending funds.
   */
  public async hasPendingFunds(
    accountId: FinancialAccountId,
    amount: number,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialAccountBalance.count({
        where: {
          accountId: accountId.value,

          pendingAmount: {
            gte: amount,
          },
        },
      })) > 0
    );
  }

  /**
   * Determines whether an account has at least the requested held funds.
   */
  public async hasHeldFunds(
    accountId: FinancialAccountId,
    amount: number,
  ): Promise<boolean> {
    return (
      (await this.prisma.financialAccountBalance.count({
        where: {
          accountId: accountId.value,

          heldAmount: {
            gte: amount,
          },
        },
      })) > 0
    );
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
  // Aggregate Reconstruction
  // ===========================================================================

  /**
   * Rehydrates the complete Financial Account aggregate.
   */
  private toAggregate(
    record: FinancialAccountWithBalance,
  ): FinancialAccountAggregate {
    return FinancialAccountPrismaMapper.toDomain(record);
  }
}
