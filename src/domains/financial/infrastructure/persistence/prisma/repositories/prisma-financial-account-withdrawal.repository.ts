// -----------------------------------------------------------------------------
// Financial Account Withdrawal Prisma Repository
// -----------------------------------------------------------------------------
//
// Persistence implementation for the Financial Account Withdrawal aggregate.
//
// Aggregate:
//
// FinancialAccountWithdrawalAggregate
// └── FinancialAccountWithdrawalEntity
//
// Persistence:
//
// FinancialAccountWithdrawal
// ├── FinancialAccount
// ├── destinationType
// ├── destinationValue
// ├── disbursementPublicId
// └── transactionPublicId
//
// The withdrawal destination is an immutable historical snapshot.
//
// It is NOT a relation to FinancialDisbursementDestination.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import {
  FinancialDisbursementDestinationType as PrismaFinancialDisbursementDestinationType,
  type Prisma,
  type PrismaClient,
} from '@prisma/client';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalRepository } from '../../../../domain/repositories/financial-account-withdrawal.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalAggregate } from '../../../../domain/aggregates/financial-account-withdrawal.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalEntity } from '../../../../domain/entities/financial-account-withdrawal.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  FinancialAccountWithdrawalPrismaMapper,
  type FinancialAccountWithdrawalWithRelations,
} from '../mappers/financial-account-withdrawal-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../../../../domain/value-objects/financial-account-public-id.vo';

import type { FinancialAccountWithdrawalPublicId } from '../../../../domain/value-objects/financial-account-withdrawal-public-id.vo';

import type { FinancialReferenceType } from '../../../../domain/value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../../../../domain/value-objects/financial-reference-public-id.vo';

import type { FinancialAccountWithdrawalStatus } from '../../../../domain/value-objects/financial-account-withdrawal-status.vo';

import { FinancialAccountWithdrawalStatus as FinancialAccountWithdrawalStatusFactory } from '../../../../domain/value-objects/financial-account-withdrawal-status.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountWithdrawalException } from '../../../../domain/exceptions/financial-account-withdrawal.exception';

// =============================================================================
// Repository
// =============================================================================

export class PrismaFinancialAccountWithdrawalRepository implements FinancialAccountWithdrawalRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaClient) {}

  // ===========================================================================
  // Save
  // ===========================================================================

  /**
   * Persists the current state of an existing Financial Account Withdrawal.
   *
   * Internal identity, public identity, and Financial Account ownership are
   * immutable persistence identities.
   *
   * The withdrawal destination is persisted directly as an immutable snapshot.
   *
   * No FinancialDisbursementDestination relation is resolved.
   */
  public async save(
    aggregate: FinancialAccountWithdrawalAggregate,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Existing Record
      // -----------------------------------------------------------------------

      const existing = await tx.financialAccountWithdrawal.findUnique({
        where: {
          id: aggregate.id.toString(),
        },

        select: {
          id: true,
          publicId: true,
          accountId: true,
        },
      });

      // -----------------------------------------------------------------------
      // Existence
      // -----------------------------------------------------------------------

      if (existing === null) {
        throw new FinancialAccountWithdrawalException(
          `Financial Account Withdrawal "${aggregate.publicId.value}" does not exist and cannot be updated.`,
        );
      }

      // -----------------------------------------------------------------------
      // Public Identity Stability
      // -----------------------------------------------------------------------

      if (existing.publicId !== aggregate.publicId.value) {
        throw new FinancialAccountWithdrawalException(
          `Financial Account Withdrawal internal identity "${aggregate.id.toString()}" is associated with a different public identity.`,
        );
      }

      // -----------------------------------------------------------------------
      // Account Resolution
      // -----------------------------------------------------------------------

      const accountId = await this.resolveAccountId(
        tx,
        aggregate.accountPublicId,
      );

      // -----------------------------------------------------------------------
      // Account Ownership Stability
      // -----------------------------------------------------------------------

      if (existing.accountId !== accountId) {
        throw new FinancialAccountWithdrawalException(
          `Financial Account Withdrawal "${aggregate.publicId.value}" cannot be moved to another Financial Account.`,
        );
      }

      // -----------------------------------------------------------------------
      // Domain → Persistence
      // -----------------------------------------------------------------------

      const persistence =
        FinancialAccountWithdrawalPrismaMapper.aggregateToPersistence(
          aggregate,
        );

      const withdrawal = persistence.withdrawal;

      // -----------------------------------------------------------------------
      // Destination Type
      // -----------------------------------------------------------------------

      const destinationType = this.toPrismaDestinationType(
        withdrawal.destinationType,
      );

      // -----------------------------------------------------------------------
      // Update
      // -----------------------------------------------------------------------

      await tx.financialAccountWithdrawal.update({
        where: {
          id: aggregate.id.toString(),
        },

        data: {
          accountId,

          amount: withdrawal.amount,

          currency: withdrawal.currency,

          destinationType,

          destinationValue: withdrawal.destinationValue,

          status: withdrawal.status,

          referenceType: withdrawal.referenceType,

          referencePublicId: withdrawal.referencePublicId,

          disbursementPublicId: withdrawal.disbursementPublicId,

          requestedAt: withdrawal.requestedAt,

          completedAt: withdrawal.completedAt,

          failedAt: withdrawal.failedAt,

          cancelledAt: withdrawal.cancelledAt,

          updatedAt: withdrawal.updatedAt,
        },
      });
    });
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Physical deletion of Financial Account Withdrawals is unsupported.
   *
   * Financial withdrawal records must remain auditable.
   */
  public delete(aggregate: FinancialAccountWithdrawalAggregate): Promise<void> {
    return Promise.reject(
      new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal "${aggregate.publicId.value}" cannot be physically deleted.`,
      ),
    );
  }

  // ===========================================================================
  // Find By Public ID
  // ===========================================================================

  /**
   * Finds a complete Financial Account Withdrawal aggregate by public ID.
   */
  public async findByPublicId(
    publicId: FinancialAccountWithdrawalPublicId,
  ): Promise<FinancialAccountWithdrawalAggregate | null> {
    const record = await this.prisma.financialAccountWithdrawal.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialAccountWithdrawalPrismaMapper.toDomain(
      record satisfies FinancialAccountWithdrawalWithRelations,
    );
  }

  // ===========================================================================
  // Find By Account Public ID
  // ===========================================================================

  /**
   * Finds all withdrawals belonging to a Financial Account.
   */
  public async findByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountWithdrawalAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const records = await this.prisma.financialAccountWithdrawal.findMany({
      where: {
        accountId,
      },

      include: {
        account: true,
      },

      orderBy: {
        requestedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountWithdrawalPrismaMapper.toDomain(
        record satisfies FinancialAccountWithdrawalWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Find By Account Public ID + Status
  // ===========================================================================

  /**
   * Finds all withdrawals belonging to an account with the supplied lifecycle
   * status.
   */
  public async findByAccountPublicIdAndStatus(
    accountPublicId: FinancialAccountPublicId,
    status: FinancialAccountWithdrawalStatus,
  ): Promise<FinancialAccountWithdrawalAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const records = await this.prisma.financialAccountWithdrawal.findMany({
      where: {
        accountId,
        status: status.value,
      },

      include: {
        account: true,
      },

      orderBy: {
        requestedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountWithdrawalPrismaMapper.toDomain(
        record satisfies FinancialAccountWithdrawalWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Find By Status
  // ===========================================================================

  /**
   * Finds all withdrawals with the supplied lifecycle status.
   */
  public async findByStatus(
    status: FinancialAccountWithdrawalStatus,
  ): Promise<FinancialAccountWithdrawalAggregate[]> {
    const records = await this.prisma.financialAccountWithdrawal.findMany({
      where: {
        status: status.value,
      },

      include: {
        account: true,
      },

      orderBy: {
        requestedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountWithdrawalPrismaMapper.toDomain(
        record satisfies FinancialAccountWithdrawalWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Find By Disbursement Public ID
  // ===========================================================================

  /**
   * Finds the withdrawal associated with a Financial Disbursement public ID.
   *
   * The disbursement identifier is an opaque cross-aggregate reference.
   */
  public async findByDisbursementPublicId(
    disbursementPublicId: string,
  ): Promise<FinancialAccountWithdrawalAggregate | null> {
    const normalized = this.normalizeDisbursementPublicId(disbursementPublicId);

    const record = await this.prisma.financialAccountWithdrawal.findFirst({
      where: {
        disbursementPublicId: normalized,
      },

      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialAccountWithdrawalPrismaMapper.toDomain(
      record satisfies FinancialAccountWithdrawalWithRelations,
    );
  }

  // ===========================================================================
  // Find By Reference
  // ===========================================================================

  /**
   * Finds withdrawals associated with a business reference.
   */
  public async findByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<FinancialAccountWithdrawalAggregate[]> {
    const normalizedReferenceType = referenceType.value.trim();

    const normalizedReferencePublicId = referencePublicId.value.trim();

    if (normalizedReferenceType.length === 0) {
      throw new FinancialAccountWithdrawalException(
        'Financial reference type must not be empty.',
      );
    }

    if (normalizedReferencePublicId.length === 0) {
      throw new FinancialAccountWithdrawalException(
        'Financial reference public ID must not be empty.',
      );
    }

    const records = await this.prisma.financialAccountWithdrawal.findMany({
      where: {
        referenceType: normalizedReferenceType,

        referencePublicId: normalizedReferencePublicId,
      },

      include: {
        account: true,
      },

      orderBy: {
        requestedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountWithdrawalPrismaMapper.toDomain(
        record satisfies FinancialAccountWithdrawalWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Find Pending By Account Public ID
  // ===========================================================================

  public async findPendingByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountWithdrawalAggregate[]> {
    return this.findByAccountPublicIdAndStatus(
      accountPublicId,
      FinancialAccountWithdrawalStatusFactory.pending(),
    );
  }

  // ===========================================================================
  // Find Processing By Account Public ID
  // ===========================================================================

  public async findProcessingByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountWithdrawalAggregate[]> {
    return this.findByAccountPublicIdAndStatus(
      accountPublicId,
      FinancialAccountWithdrawalStatusFactory.processing(),
    );
  }

  // ===========================================================================
  // Find Entity By Public ID
  // ===========================================================================

  public async findEntityByPublicId(
    publicId: FinancialAccountWithdrawalPublicId,
  ): Promise<FinancialAccountWithdrawalEntity | null> {
    const record = await this.prisma.financialAccountWithdrawal.findUnique({
      where: {
        publicId: publicId.value,
      },

      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialAccountWithdrawalPrismaMapper.toEntity(
      record satisfies FinancialAccountWithdrawalWithRelations,
    );
  }

  // ===========================================================================
  // Find Entity By Disbursement Public ID
  // ===========================================================================

  public async findEntityByDisbursementPublicId(
    disbursementPublicId: string,
  ): Promise<FinancialAccountWithdrawalEntity | null> {
    const normalized = this.normalizeDisbursementPublicId(disbursementPublicId);

    const record = await this.prisma.financialAccountWithdrawal.findFirst({
      where: {
        disbursementPublicId: normalized,
      },

      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialAccountWithdrawalPrismaMapper.toEntity(
      record satisfies FinancialAccountWithdrawalWithRelations,
    );
  }

  // ===========================================================================
  // Find Entities By Account Public ID
  // ===========================================================================

  public async findEntitiesByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountWithdrawalEntity[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const records = await this.prisma.financialAccountWithdrawal.findMany({
      where: {
        accountId,
      },

      include: {
        account: true,
      },

      orderBy: {
        requestedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountWithdrawalPrismaMapper.toEntity(
        record satisfies FinancialAccountWithdrawalWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Exists By Public ID
  // ===========================================================================

  public async existsByPublicId(
    publicId: FinancialAccountWithdrawalPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.financialAccountWithdrawal.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists By Disbursement Public ID
  // ===========================================================================

  public async existsByDisbursementPublicId(
    disbursementPublicId: string,
  ): Promise<boolean> {
    const normalized = this.normalizeDisbursementPublicId(disbursementPublicId);

    const record = await this.prisma.financialAccountWithdrawal.findFirst({
      where: {
        disbursementPublicId: normalized,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists By Account Public ID
  // ===========================================================================

  public async existsByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<boolean> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const record = await this.prisma.financialAccountWithdrawal.findFirst({
      where: {
        accountId,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Resolve Financial Account
  // ===========================================================================

  private async resolveAccountId(
    prisma: PrismaClient | Prisma.TransactionClient,
    accountPublicId: FinancialAccountPublicId,
  ): Promise<string> {
    const normalized = accountPublicId.value.trim();

    if (normalized.length === 0) {
      throw new FinancialAccountWithdrawalException(
        'Financial Account public ID must not be empty.',
      );
    }

    const account = await prisma.financialAccount.findUnique({
      where: {
        publicId: normalized,
      },

      select: {
        id: true,
      },
    });

    if (account === null) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account "${normalized}" does not exist.`,
      );
    }

    return account.id;
  }

  // ===========================================================================
  // Destination Type Conversion
  // ===========================================================================

  /**
   * Converts the domain destination type into Prisma's generated enum.
   *
   * The domain intentionally keeps the withdrawal destination snapshot
   * independent from Prisma.
   */
  private toPrismaDestinationType(
    value: string,
  ): PrismaFinancialDisbursementDestinationType {
    switch (value) {
      case 'MOBILE_MONEY':
        return PrismaFinancialDisbursementDestinationType.MOBILE_MONEY;

      case 'BANK_ACCOUNT':
        return PrismaFinancialDisbursementDestinationType.BANK_ACCOUNT;

      case 'OTHER':
        return PrismaFinancialDisbursementDestinationType.OTHER;

      default:
        throw new FinancialAccountWithdrawalException(
          `Invalid Financial Account Withdrawal destination type "${value}".`,
        );
    }
  }

  // ===========================================================================
  // Disbursement Public ID Normalization
  // ===========================================================================

  private normalizeDisbursementPublicId(value: string): string {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new FinancialAccountWithdrawalException(
        'Financial Disbursement public ID must not be empty.',
      );
    }

    return normalized;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaFinancialAccountWithdrawalRepository;
