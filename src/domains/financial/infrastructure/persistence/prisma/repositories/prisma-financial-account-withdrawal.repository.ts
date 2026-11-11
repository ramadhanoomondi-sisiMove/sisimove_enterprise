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

import {
  Prisma,
  FinancialAccountWithdrawalStatus as PrismaFinancialAccountWithdrawalStatus,
  FinancialDisbursementDestinationType as PrismaFinancialDisbursementDestinationType,
} from '@prisma/client';

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma Transaction Context
// -----------------------------------------------------------------------------

import {
  PrismaTransactionContext,
  type PrismaClientLike,
} from '../../../../../../infrastructure/database/prisma/prisma-transaction.context';

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

import { FinancialAccountWithdrawalIdempotencyConflictException } from '../../../../domain/exceptions/financial-account-withdrawal-idempotency-conflict.exception';

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
   * Creates or updates a Financial Account Withdrawal aggregate.
   *
   * New aggregates are inserted.
   * Existing aggregates are updated.
   *
   * Internal identity, public identity, and Financial Account ownership
   * remain immutable.
   *
   * The destination is persisted as an immutable snapshot.
   *
   * Transaction ownership remains with the ambient UnitOfWork.
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
    // Domain → Persistence
    // -------------------------------------------------------------------------

    const persistence =
      FinancialAccountWithdrawalPrismaMapper.aggregateToPersistence(aggregate);

    const withdrawal = persistence.withdrawal;

    // -------------------------------------------------------------------------
    // Resolve Financial Account
    // -------------------------------------------------------------------------

    const accountId = await this.resolveAccountId(aggregate.accountPublicId);

    // -------------------------------------------------------------------------
    // Account Consistency
    // -------------------------------------------------------------------------

    if (withdrawal.accountId !== accountId) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal "${withdrawal.publicId}" contains an inconsistent Financial Account reference.`,
      );
    }

    // -------------------------------------------------------------------------
    // Destination Type
    // -------------------------------------------------------------------------

    const destinationType = this.toPrismaDestinationType(
      withdrawal.destinationType,
    );

    // -------------------------------------------------------------------------
    // Check Existing Record
    // -------------------------------------------------------------------------

    const existing = await this.prisma.financialAccountWithdrawal.findUnique({
      where: {
        id: withdrawal.id,
      },

      select: {
        id: true,
        publicId: true,
        accountId: true,
        idempotencyKey: true,
      },
    });

    // -------------------------------------------------------------------------
    // Create New Withdrawal
    // -------------------------------------------------------------------------

    if (existing === null) {
      try {
        await this.prisma.financialAccountWithdrawal.create({
          data: {
            id: withdrawal.id,
            publicId: withdrawal.publicId,
            accountId,
            amount: withdrawal.amount,
            currency: withdrawal.currency,
            status: withdrawal.status,
            destinationType,
            destinationValue: withdrawal.destinationValue,
            referenceType: withdrawal.referenceType,
            referencePublicId: withdrawal.referencePublicId,
            disbursementPublicId: withdrawal.disbursementPublicId,
            idempotencyKey: withdrawal.idempotencyKey,
            requestedAt: withdrawal.requestedAt,
            completedAt: withdrawal.completedAt,
            failedAt: withdrawal.failedAt,
            cancelledAt: withdrawal.cancelledAt,
            createdAt: withdrawal.createdAt,
            updatedAt: withdrawal.updatedAt,
          },
        });
      } catch (error: unknown) {
        if (this.isIdempotencyConstraintViolation(error)) {
          throw new FinancialAccountWithdrawalIdempotencyConflictException();
        }

        throw error;
      }

      return;
    }

    // -------------------------------------------------------------------------
    // Validate Existing Identity
    // -------------------------------------------------------------------------

    if (existing.publicId !== withdrawal.publicId) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal internal identity "${withdrawal.id}" is associated with a different public identity.`,
      );
    }

    // -------------------------------------------------------------------------
    // Validate Account Ownership
    // -------------------------------------------------------------------------

    if (existing.accountId !== accountId) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal "${withdrawal.publicId}" cannot be moved to another Financial Account.`,
      );
    }

    // -------------------------------------------------------------------------
    // Validate Idempotency Key Immutability
    // -------------------------------------------------------------------------

    if (existing.idempotencyKey !== withdrawal.idempotencyKey) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal "${withdrawal.publicId}" cannot change its idempotency key.`,
      );
    }

    // -------------------------------------------------------------------------
    // Update Existing Withdrawal
    // -------------------------------------------------------------------------

    await this.prisma.financialAccountWithdrawal.update({
      where: {
        id: withdrawal.id,
      },

      data: {
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
  }

  // ===========================================================================
  // Conditional PENDING → PROCESSING Save
  // ===========================================================================

  /**
   * Atomically transitions a persisted withdrawal from PENDING to PROCESSING.
   *
   * The aggregate must already have performed the domain transition.
   * The database update succeeds only while the persisted record is still
   * PENDING. This prevents concurrent processing requests from both winning.
   *
   * Only lifecycle fields changed by the PENDING → PROCESSING transition are
   * updated. Immutable withdrawal data is deliberately left untouched.
   *
   * Returns false when the record no longer exists in PENDING status.
   * Transaction ownership remains with the ambient UnitOfWork.
   */
  public async saveIfPending(
    aggregate: FinancialAccountWithdrawalAggregate,
  ): Promise<boolean> {
    if (aggregate === undefined) {
      throw new FinancialAccountWithdrawalException(
        'Financial Account Withdrawal aggregate is required.',
      );
    }

    const persistence =
      FinancialAccountWithdrawalPrismaMapper.aggregateToPersistence(aggregate);

    const withdrawal = persistence.withdrawal;

    // Compare Prisma persistence status with the Prisma-generated enum.
    if (
      withdrawal.status !== PrismaFinancialAccountWithdrawalStatus.PROCESSING
    ) {
      throw new FinancialAccountWithdrawalException(
        'Only a PROCESSING Financial Account Withdrawal can be conditionally saved from PENDING.',
      );
    }

    const accountId = await this.resolveAccountId(aggregate.accountPublicId);

    if (withdrawal.accountId !== accountId) {
      throw new FinancialAccountWithdrawalException(
        `Financial Account Withdrawal "${withdrawal.publicId}" contains an inconsistent Financial Account reference.`,
      );
    }

    // Conditional update: only one concurrent request can change PENDING.
    const result = await this.prisma.financialAccountWithdrawal.updateMany({
      where: {
        id: withdrawal.id,
        publicId: withdrawal.publicId,
        accountId,
        status: PrismaFinancialAccountWithdrawalStatus.PENDING,
      },

      data: {
        status: withdrawal.status,
        updatedAt: withdrawal.updatedAt,
      },
    });

    return result.count === 1;
  }

  // ===========================================================================
  // Conditional Disbursement Link
  // ===========================================================================

  /**
   * Atomically links a Financial Disbursement to a withdrawal that is still
   * PROCESSING.
   *
   * The operation:
   * - Does not change the withdrawal lifecycle status.
   * - Does not overwrite a different existing disbursement link.
   * - Treats an existing link to the same disbursement as success.
   * - Updates only disbursementPublicId and updatedAt.
   *
   * Returns false when the withdrawal does not exist, is no longer PROCESSING,
   * or is already linked to a different disbursement.
   *
   * Transaction ownership remains with the ambient UnitOfWork.
   */
  public async linkDisbursementIfProcessing(
    withdrawalPublicId: FinancialAccountWithdrawalPublicId,
    disbursementPublicId: string,
  ): Promise<boolean> {
    // -------------------------------------------------------------------------
    // Validate Withdrawal Public ID
    // -------------------------------------------------------------------------

    if (withdrawalPublicId === undefined) {
      throw new FinancialAccountWithdrawalException(
        'Financial Account Withdrawal public ID is required.',
      );
    }

    const normalizedWithdrawalPublicId = withdrawalPublicId.value.trim();

    if (normalizedWithdrawalPublicId.length === 0) {
      throw new FinancialAccountWithdrawalException(
        'Financial Account Withdrawal public ID must not be empty.',
      );
    }

    // -------------------------------------------------------------------------
    // Validate Disbursement Public ID
    // -------------------------------------------------------------------------

    const normalizedDisbursementPublicId =
      this.normalizeDisbursementPublicId(disbursementPublicId);

    // -------------------------------------------------------------------------
    // Conditional Database Update
    // -------------------------------------------------------------------------
    //
    // The update succeeds only when:
    //
    // 1. The withdrawal exists.
    // 2. Its status is PROCESSING.
    // 3. Its disbursement link is empty OR already matches this disbursement.
    //
    // A different existing disbursement link is never overwritten.
    // -------------------------------------------------------------------------

    const result = await this.prisma.financialAccountWithdrawal.updateMany({
      where: {
        publicId: normalizedWithdrawalPublicId,

        status: PrismaFinancialAccountWithdrawalStatus.PROCESSING,

        OR: [
          {
            disbursementPublicId: null,
          },
          {
            disbursementPublicId: normalizedDisbursementPublicId,
          },
        ],
      },

      data: {
        disbursementPublicId: normalizedDisbursementPublicId,

        updatedAt: new Date(),
      },
    });

    // -------------------------------------------------------------------------
    // Return Result
    // -------------------------------------------------------------------------

    return result.count === 1;
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
  // Find All
  // ===========================================================================

  /**
   * Finds all Financial Account Withdrawal aggregates across the platform.
   *
   * This query is intended for platform-wide administrative oversight.
   *
   * Results include the owning Financial Account so the Prisma mapper can
   * reconstitute each complete withdrawal aggregate.
   *
   * Newest withdrawal requests are returned first.
   */
  public async findAll(): Promise<FinancialAccountWithdrawalAggregate[]> {
    const records = await this.prisma.financialAccountWithdrawal.findMany({
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
  // Find By Account Public ID + Idempotency Key
  // ===========================================================================

  /**
   * Finds a withdrawal using its owning account and idempotency key.
   *
   * Idempotency keys are unique within an account. The public account identity
   * is resolved to its internal Prisma foreign key inside infrastructure.
   */
  public async findByAccountPublicIdAndIdempotencyKey(
    accountPublicId: FinancialAccountPublicId,
    idempotencyKey: string,
  ): Promise<FinancialAccountWithdrawalAggregate | null> {
    const accountId = await this.resolveAccountId(accountPublicId);

    const normalizedKey = this.normalizeIdempotencyKey(idempotencyKey);

    const record = await this.prisma.financialAccountWithdrawal.findUnique({
      where: {
        accountId_idempotencyKey: {
          accountId,
          idempotencyKey: normalizedKey,
        },
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
  // Idempotency Constraint Detection
  // ===========================================================================

  /**
   * Identifies only the account-scoped idempotency unique constraint.
   *
   * Other Prisma unique-constraint violations must remain unchanged so that
   * unrelated identity or reference conflicts are not mistaken for retries.
   */
  private isIdempotencyConstraintViolation(error: unknown): boolean {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== 'P2002'
    ) {
      return false;
    }

    const target = error.meta?.target;

    if (Array.isArray(target)) {
      return target.includes('accountId') && target.includes('idempotencyKey');
    }

    if (typeof target === 'string') {
      return target.includes('accountId') && target.includes('idempotencyKey');
    }

    return false;
  }

  // ===========================================================================
  // Idempotency Key Normalization
  // ===========================================================================

  /**
   * Normalizes and validates an account-scoped idempotency key.
   */
  private normalizeIdempotencyKey(value: string): string {
    const normalized = value.trim();

    if (normalized.length === 0) {
      throw new FinancialAccountWithdrawalException(
        'Financial Account Withdrawal idempotency key must not be empty.',
      );
    }

    return normalized;
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
