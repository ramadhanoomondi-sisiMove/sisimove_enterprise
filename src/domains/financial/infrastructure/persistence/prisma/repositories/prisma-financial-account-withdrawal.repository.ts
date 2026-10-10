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
// Transaction boundary:
//
// This repository does NOT create its own Prisma transaction.
//
// The ambient PrismaTransactionContext determines whether persistence occurs
// through:
//
//     Prisma.TransactionClient
//
// or:
//
//     PrismaService
//
// Therefore, application workflows that require atomicity must execute inside
// a PrismaUnitOfWork.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma Transaction Context
// -----------------------------------------------------------------------------

import {
  PrismaTransactionContext,
  type PrismaClientLike,
} from '../../../../../../infrastructure/database/prisma/prisma-transaction.context';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import { FinancialDisbursementDestinationType as PrismaFinancialDisbursementDestinationType } from '@prisma/client';

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

@Injectable()
export class PrismaFinancialAccountWithdrawalRepository implements FinancialAccountWithdrawalRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Resolves the Prisma client through the ambient transaction context.
   *
   * Inside a UnitOfWork:
   *
   *     Prisma.TransactionClient
   *
   * Outside a UnitOfWork:
   *
   *     PrismaService
   *
   * The repository therefore never owns the transaction boundary.
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
   * Inside a UnitOfWork this is the transaction-scoped Prisma client.
   *
   * Outside a UnitOfWork it falls back to the application Prisma client.
   *
   * Every repository operation must use this client so that account lookups
   * and withdrawal persistence participate in the same ambient transaction.
   */
  private get prisma(): PrismaClientLike {
    return this.transactionContext.getClient();
  }

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
   *
   * No repository-owned Prisma transaction is created.
   *
   * When called inside a UnitOfWork, the update participates in the caller's
   * transaction.
   */
  public async save(
    aggregate: FinancialAccountWithdrawalAggregate,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // Validate Aggregate
    // -------------------------------------------------------------------------

    if (aggregate === undefined) {
      throw new FinancialAccountWithdrawalException(
        'Financial Account Withdrawal aggregate is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Existing Record
    // -------------------------------------------------------------------------

    const existing = await this.prisma.financialAccountWithdrawal.findUnique({
      where: {
        id: aggregate.id.toString(),
      },

      select: {
        id: true,
        publicId: true,
        accountId: true,
      },
    });

    // -------------------------------------------------------------------------
    // Existence
    // -------------------------------------------------------------------------

    if (existing === null) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal "${aggregate.publicId.value}" does not exist and cannot be updated.`,
      );
    }

    // -------------------------------------------------------------------------
    // Public Identity Stability
    // -------------------------------------------------------------------------

    if (existing.publicId !== aggregate.publicId.value) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal internal identity "${aggregate.id.toString()}" is associated with a different public identity.`,
      );
    }

    // -------------------------------------------------------------------------
    // Account Resolution
    // -------------------------------------------------------------------------

    const accountId = await this.resolveAccountId(aggregate.accountPublicId);

    // -------------------------------------------------------------------------
    // Account Ownership Stability
    // -------------------------------------------------------------------------

    if (existing.accountId !== accountId) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal "${aggregate.publicId.value}" cannot be moved to another Financial Account.`,
      );
    }

    // -------------------------------------------------------------------------
    // Domain → Persistence
    // -------------------------------------------------------------------------

    const persistence =
      FinancialAccountWithdrawalPrismaMapper.aggregateToPersistence(aggregate);

    const withdrawal = persistence.withdrawal;

    // -------------------------------------------------------------------------
    // Persistence Account Consistency
    // -------------------------------------------------------------------------

    if (withdrawal.accountId !== accountId) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal "${aggregate.publicId.value}" contains an inconsistent Financial Account reference.`,
      );
    }

    // -------------------------------------------------------------------------
    // Destination Type
    // -------------------------------------------------------------------------

    const destinationType = this.toPrismaDestinationType(
      withdrawal.destinationType,
    );

    // -------------------------------------------------------------------------
    // Update
    // -------------------------------------------------------------------------

    await this.prisma.financialAccountWithdrawal.update({
      where: {
        id: aggregate.id.toString(),
      },

      data: {
        // ---------------------------------------------------------------------
        // Owning Account
        // ---------------------------------------------------------------------

        accountId,

        // ---------------------------------------------------------------------
        // Financial Amount
        // ---------------------------------------------------------------------

        amount: withdrawal.amount,

        currency: withdrawal.currency,

        // ---------------------------------------------------------------------
        // Immutable Destination Snapshot
        // ---------------------------------------------------------------------

        destinationType,

        destinationValue: withdrawal.destinationValue,

        // ---------------------------------------------------------------------
        // Lifecycle
        // ---------------------------------------------------------------------

        status: withdrawal.status,

        // ---------------------------------------------------------------------
        // Business Reference
        // ---------------------------------------------------------------------

        referenceType: withdrawal.referenceType,

        referencePublicId: withdrawal.referencePublicId,

        // ---------------------------------------------------------------------
        // Cross-Aggregate Reference
        // ---------------------------------------------------------------------

        disbursementPublicId: withdrawal.disbursementPublicId,

        // ---------------------------------------------------------------------
        // Lifecycle Timestamps
        // ---------------------------------------------------------------------

        requestedAt: withdrawal.requestedAt,

        completedAt: withdrawal.completedAt,

        failedAt: withdrawal.failedAt,

        cancelledAt: withdrawal.cancelledAt,

        updatedAt: withdrawal.updatedAt,
      },
    });
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Physical deletion of Financial Account Withdrawals is unsupported.
   *
   * Financial withdrawal records must remain auditable.
   *
   * Lifecycle changes must be represented through the aggregate's domain
   * behavior and persisted with save().
   */
  public delete(aggregate: FinancialAccountWithdrawalAggregate): Promise<void> {
    if (aggregate === undefined) {
      return Promise.reject(
        new FinancialAccountWithdrawalException(
          'Financial Account Withdrawal aggregate is required.',
        ),
      );
    }

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
   *
   * The public Financial Account identity is resolved to the internal Prisma
   * foreign key entirely inside infrastructure.
   */
  public async findByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountWithdrawalAggregate[]> {
    const accountId = await this.resolveAccountId(accountPublicId);

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
    const accountId = await this.resolveAccountId(accountPublicId);

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
   *
   * No Financial Disbursement aggregate is loaded or resolved here.
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
    const accountId = await this.resolveAccountId(accountPublicId);

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
    const accountId = await this.resolveAccountId(accountPublicId);

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

  /**
   * Resolves:
   *
   * FinancialAccountPublicId
   *           ↓
   * FinancialAccount.id
   *
   * The public identity remains the domain-level reference.
   *
   * The internal database identity remains an infrastructure concern.
   *
   * The lookup uses the ambient Prisma client so that, inside a UnitOfWork,
   * the account resolution and withdrawal operation execute against the same
   * transaction-scoped Prisma client.
   */
  private async resolveAccountId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<string> {
    const normalized = accountPublicId.value.trim();

    if (normalized.length === 0) {
      throw new FinancialAccountWithdrawalException(
        'Financial Account public ID must not be empty.',
      );
    }

    const account = await this.prisma.financialAccount.findUnique({
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
   *
   * The repository owns the infrastructure mapping between the domain string
   * representation and the Prisma enum representation.
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

  /**
   * Normalizes and validates the opaque Financial Disbursement public ID.
   *
   * The repository does not resolve the Financial Disbursement aggregate.
   */
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
