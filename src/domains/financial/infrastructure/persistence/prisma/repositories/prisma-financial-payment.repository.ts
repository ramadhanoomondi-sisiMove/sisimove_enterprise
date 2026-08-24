// -----------------------------------------------------------------------------
// Financial Payment Prisma Repository
// -----------------------------------------------------------------------------
//
// Persistence implementation for the Financial Payment aggregate.
//
// Aggregate:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Responsibilities:
//
// - Persist Financial Payment aggregates.
// - Rehydrate complete Financial Payment aggregates.
// - Resolve domain public identities into Prisma internal IDs.
// - Preserve aggregate ownership.
// - Persist Payment Attempts atomically with their parent Payment.
// - Preserve internal persistence identities.
// - Preserve public domain identities.
// - Preserve Payment Attempt execution history.
// - Enforce persistence-level relational consistency.
// - Execute multi-record persistence atomically.
//
// This repository does NOT:
//
// - Execute external payment providers.
// - Communicate with payment providers.
// - Move money.
// - Modify Financial Account balances.
// - Create or post Financial Transactions.
// - Perform settlement.
// - Perform accounting.
// - Emit domain events.
// - Enforce payment lifecycle business rules.
//
// Domain invariants belong to:
//
// - FinancialPaymentAggregate
// - FinancialPaymentEntity
// - FinancialPaymentAttemptEntity
//
// Mapping belongs to:
//
// - FinancialPaymentPrismaMapper
//
// Persistence belongs to:
//
// - PrismaFinancialPaymentRepository
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, PrismaClient } from '@prisma/client';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { FinancialPaymentRepository } from '../../../../domain/repositories/financial-payment.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialPaymentAggregate } from '../../../../domain/aggregates/financial-payment.aggregate';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  FinancialPaymentPrismaMapper,
  type FinancialPaymentWithRelations,
} from '../mappers/financial-payment-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialPaymentPublicId } from '../../../../domain/value-objects/financial-payment-public-id.vo';

import type { FinancialPaymentMethodPublicId } from '../../../../domain/value-objects/financial-payment-method-public-id.vo';

import type { FinancialAccountPublicId } from '../../../../domain/value-objects/financial-account-public-id.vo';

import type { FinancialTransactionPublicId } from '../../../../domain/value-objects/financial-transaction-public-id.vo';

import type { FinancialPaymentStatus } from '../../../../domain/value-objects/financial-payment-status.vo';

import type { FinancialReferenceType } from '../../../../domain/value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../../../../domain/value-objects/financial-reference-public-id.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialPaymentException } from '../../../../domain/exceptions/financial-payment.exception';

// =============================================================================
// Repository
// =============================================================================

export class PrismaFinancialPaymentRepository implements FinancialPaymentRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaClient) {}

  // ===========================================================================
  // Create
  // ===========================================================================

  /**
   * Persists a brand-new Financial Payment aggregate.
   *
   * Persistence is atomic:
   *
   * FinancialPayment
   * └── FinancialPaymentAttempt[]
   *
   * Either the complete aggregate is persisted or the entire operation rolls
   * back.
   *
   * Public domain identities are translated into internal persistence IDs
   * before persistence.
   */
  public async create(aggregate: FinancialPaymentAggregate): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Resolve Owning Financial Account
      // -----------------------------------------------------------------------

      const accountId = await this.resolveAccountId(tx, aggregate.accountId);

      // -----------------------------------------------------------------------
      // Resolve Payment Method
      // -----------------------------------------------------------------------

      const methodId = await this.resolveMethodId(
        tx,
        aggregate.methodId,
        accountId,
      );

      // -----------------------------------------------------------------------
      // Map Aggregate
      // -----------------------------------------------------------------------

      const persistence = FinancialPaymentPrismaMapper.aggregateToPersistence(
        aggregate,
        accountId,
        methodId,
      );

      // -----------------------------------------------------------------------
      // Create Payment
      // -----------------------------------------------------------------------

      await tx.financialPayment.create({
        data: {
          id: persistence.payment.id,
          publicId: persistence.payment.publicId,

          accountId: persistence.payment.accountId,

          amount: persistence.payment.amount,
          currency: persistence.payment.currency,

          status: persistence.payment.status,

          methodId: persistence.payment.methodId,

          transactionPublicId: persistence.payment.transactionPublicId,

          referenceType: persistence.payment.referenceType,

          referencePublicId: persistence.payment.referencePublicId,

          initiatedAt: persistence.payment.initiatedAt,

          completedAt: persistence.payment.completedAt,

          failedAt: persistence.payment.failedAt,

          cancelledAt: persistence.payment.cancelledAt,
        },
      });

      // -----------------------------------------------------------------------
      // Create Attempts
      // -----------------------------------------------------------------------

      await this.createAttempts(tx, aggregate);
    });
  }

  // ===========================================================================
  // Save
  // ===========================================================================

  /**
   * Persists the current state of an existing Financial Payment aggregate.
   *
   * Persistence strategy:
   *
   * 1. Verify aggregate existence.
   * 2. Verify public identity stability.
   * 3. Resolve Financial Account public identity.
   * 4. Resolve Payment Method public identity.
   * 5. Update Payment.
   * 6. Synchronize owned Attempts.
   *
   * All operations occur inside a single database transaction.
   *
   * Attempts are append-only:
   *
   * - Existing attempts may be updated.
   * - New attempts may be inserted.
   * - Missing attempts are never deleted.
   */
  public async save(aggregate: FinancialPaymentAggregate): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Verify Payment Exists
      // -----------------------------------------------------------------------

      const existingPayment = await tx.financialPayment.findUnique({
        where: {
          id: aggregate.id.toString(),
        },

        select: {
          id: true,
          publicId: true,
        },
      });

      if (existingPayment === null) {
        throw new FinancialPaymentException(
          `Financial Payment "${aggregate.publicId.value}" does not exist and cannot be updated.`,
        );
      }

      // -----------------------------------------------------------------------
      // Validate Public Identity Stability
      // -----------------------------------------------------------------------

      if (existingPayment.publicId !== aggregate.publicId.value) {
        throw new FinancialPaymentException(
          `Financial Payment internal identity "${aggregate.id.toString()}" is associated with a different public identity.`,
        );
      }

      // -----------------------------------------------------------------------
      // Resolve Owning Financial Account
      // -----------------------------------------------------------------------

      const accountId = await this.resolveAccountId(tx, aggregate.accountId);

      // -----------------------------------------------------------------------
      // Resolve Payment Method
      // -----------------------------------------------------------------------

      const methodId = await this.resolveMethodId(
        tx,
        aggregate.methodId,
        accountId,
      );

      // -----------------------------------------------------------------------
      // Map Aggregate
      // -----------------------------------------------------------------------

      const persistence = FinancialPaymentPrismaMapper.aggregateToPersistence(
        aggregate,
        accountId,
        methodId,
      );

      // -----------------------------------------------------------------------
      // Update Payment
      // -----------------------------------------------------------------------

      await tx.financialPayment.update({
        where: {
          id: aggregate.id.toString(),
        },

        data: {
          accountId: persistence.payment.accountId,

          amount: persistence.payment.amount,

          currency: persistence.payment.currency,

          status: persistence.payment.status,

          methodId: persistence.payment.methodId,

          transactionPublicId: persistence.payment.transactionPublicId,

          referenceType: persistence.payment.referenceType,

          referencePublicId: persistence.payment.referencePublicId,

          initiatedAt: persistence.payment.initiatedAt,

          completedAt: persistence.payment.completedAt,

          failedAt: persistence.payment.failedAt,

          cancelledAt: persistence.payment.cancelledAt,
        },
      });

      // -----------------------------------------------------------------------
      // Synchronize Attempts
      // -----------------------------------------------------------------------

      await this.synchronizeAttempts(tx, aggregate);
    });
  }

  // ===========================================================================
  // Find By Internal ID
  // ===========================================================================

  /**
   * Rehydrates a complete Financial Payment aggregate by its internal
   * persistence identity.
   */
  public async findById(id: string): Promise<FinancialPaymentAggregate | null> {
    const normalizedId = id.trim();

    if (!normalizedId) {
      throw new FinancialPaymentException(
        'Financial Payment internal ID must not be empty.',
      );
    }

    const record = await this.findPaymentRecordByUnique({
      id: normalizedId,
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Public ID
  // ===========================================================================

  /**
   * Rehydrates a complete Financial Payment aggregate by public identity.
   */
  public async findByPublicId(
    publicId: FinancialPaymentPublicId,
  ): Promise<FinancialPaymentAggregate | null> {
    const record = await this.findPaymentRecordByUnique({
      publicId: publicId.value,
    });

    if (record === null) {
      return null;
    }

    return FinancialPaymentPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Account
  // ===========================================================================

  /**
   * Finds all Financial Payments associated with a Financial Account.
   *
   * Domain:
   *
   * FinancialAccountPublicId
   *
   * Persistence:
   *
   * FinancialAccount.id
   */
  public async findByAccountId(
    accountId: FinancialAccountPublicId,
  ): Promise<FinancialPaymentAggregate[]> {
    const internalAccountId = await this.resolveAccountId(
      this.prisma,
      accountId,
    );

    const records = await this.prisma.financialPayment.findMany({
      where: {
        accountId: internalAccountId,
      },

      include: {
        account: true,
        method: true,
        attempts: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentPrismaMapper.toDomain(
        record as FinancialPaymentWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Find By Payment Method
  // ===========================================================================

  /**
   * Finds all Financial Payments associated with a Financial Payment Method.
   */
  public async findByPaymentMethod(
    methodId: FinancialPaymentMethodPublicId,
  ): Promise<FinancialPaymentAggregate[]> {
    const method = await this.prisma.financialPaymentMethod.findUnique({
      where: {
        publicId: methodId.value,
      },

      select: {
        id: true,
      },
    });

    if (method === null) {
      throw new FinancialPaymentException(
        `Financial Payment Method "${methodId.value}" does not exist.`,
      );
    }

    const records = await this.prisma.financialPayment.findMany({
      where: {
        methodId: method.id,
      },

      include: {
        account: true,
        method: true,
        attempts: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentPrismaMapper.toDomain(
        record as FinancialPaymentWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Find By Status
  // ===========================================================================

  /**
   * Finds complete Financial Payment aggregates by lifecycle status.
   */
  public async findByStatus(
    status: FinancialPaymentStatus,
  ): Promise<FinancialPaymentAggregate[]> {
    const records = await this.prisma.financialPayment.findMany({
      where: {
        status: status.value,
      },

      include: {
        account: true,
        method: true,
        attempts: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialPaymentPrismaMapper.toDomain(
        record as FinancialPaymentWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Find Pending
  // ===========================================================================

  /**
   * Finds Financial Payments currently waiting for execution.
   */
  public async findPending(): Promise<FinancialPaymentAggregate[]> {
    const records = await this.prisma.financialPayment.findMany({
      where: {
        status: 'PENDING',
      },

      include: {
        account: true,
        method: true,
        attempts: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      FinancialPaymentPrismaMapper.toDomain(
        record as FinancialPaymentWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Find Processing
  // ===========================================================================

  /**
   * Finds Financial Payments currently being processed.
   */
  public async findProcessing(): Promise<FinancialPaymentAggregate[]> {
    const records = await this.prisma.financialPayment.findMany({
      where: {
        status: 'PROCESSING',
      },

      include: {
        account: true,
        method: true,
        attempts: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return records.map((record) =>
      FinancialPaymentPrismaMapper.toDomain(
        record as FinancialPaymentWithRelations,
      ),
    );
  }

  // ===========================================================================
  // Find By Transaction
  // ===========================================================================

  /**
   * Finds the Financial Payment associated with a Financial Transaction.
   *
   * FinancialTransaction is a separate aggregate.
   *
   * Only its public identity is stored by FinancialPayment.
   *
   * The domain receives a FinancialTransactionPublicId value object.
   *
   * Prisma stores the value as a scalar string and therefore receives:
   *
   * transactionPublicId.value
   */
  public async findByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<FinancialPaymentAggregate | null> {
    const normalized = transactionPublicId.value.trim();

    if (!normalized) {
      throw new FinancialPaymentException(
        'Financial Transaction public ID must not be empty.',
      );
    }

    const record =
      await this.findPaymentRecordByTransactionPublicId(normalized);

    if (record === null) {
      return null;
    }

    return FinancialPaymentPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Reference
  // ===========================================================================

  /**
   * Finds a Financial Payment using its originating business reference.
   */
  public async findByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<FinancialPaymentAggregate | null> {
    const normalizedType = referenceType.value.trim();

    const normalizedPublicId = referencePublicId.value.trim();

    if (!normalizedType || !normalizedPublicId) {
      throw new FinancialPaymentException(
        'Financial Payment reference type and public ID must not be empty.',
      );
    }

    const record = await this.findPaymentRecordByReference(
      normalizedType,
      normalizedPublicId,
    );

    if (record === null) {
      return null;
    }

    return FinancialPaymentPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Exists By Public ID
  // ===========================================================================

  /**
   * Determines whether a Financial Payment exists by public identity.
   */
  public async existsByPublicId(
    publicId: FinancialPaymentPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.financialPayment.findUnique({
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
  // Exists By Reference
  // ===========================================================================

  /**
   * Determines whether a Financial Payment exists for an originating
   * business reference.
   */
  public async existsByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<boolean> {
    const normalizedType = referenceType.value.trim();

    const normalizedPublicId = referencePublicId.value.trim();

    if (!normalizedType || !normalizedPublicId) {
      throw new FinancialPaymentException(
        'Financial Payment reference type and public ID must not be empty.',
      );
    }

    const record = await this.prisma.financialPayment.findFirst({
      where: {
        referenceType: normalizedType,
        referencePublicId: normalizedPublicId,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists By Transaction
  // ===========================================================================

  /**
   * Determines whether a Financial Payment exists for a Financial Transaction.
   *
   * transactionPublicId is not a Prisma unique field, therefore findFirst()
   * is intentionally used instead of findUnique().
   */
  public async existsByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<boolean> {
    const normalized = transactionPublicId.value.trim();

    if (!normalized) {
      throw new FinancialPaymentException(
        'Financial Transaction public ID must not be empty.',
      );
    }

    const record = await this.prisma.financialPayment.findFirst({
      where: {
        transactionPublicId: normalized,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Financial Payments are financial records.
   *
   * Physical deletion is intentionally unsupported.
   *
   * Payment lifecycle is represented through aggregate state rather than
   * physical database deletion.
   */
  public delete(): Promise<void> {
    throw new FinancialPaymentException(
      'Financial Payment aggregates cannot be physically deleted.',
    );
  }

  // ===========================================================================
  // Prisma Payment Graph — Unique Lookup
  // ===========================================================================

  /**
   * Loads the complete persistence graph using an actual Prisma unique key.
   *
   * Valid unique selectors are currently:
   *
   * - id
   * - publicId
   */
  private async findPaymentRecordByUnique(
    where: Prisma.FinancialPaymentWhereUniqueInput,
  ): Promise<FinancialPaymentWithRelations | null> {
    const record = await this.prisma.financialPayment.findUnique({
      where,

      include: {
        account: true,
        method: true,
        attempts: true,
      },
    });

    if (record === null) {
      return null;
    }

    return record;
  }

  // ===========================================================================
  // Prisma Payment Graph — Transaction Lookup
  // ===========================================================================

  /**
   * Loads the complete persistence graph using transactionPublicId.
   *
   * transactionPublicId is deliberately NOT represented as a
   * WhereUniqueInput because the Prisma schema does not declare it unique.
   */
  private async findPaymentRecordByTransactionPublicId(
    transactionPublicId: string,
  ): Promise<FinancialPaymentWithRelations | null> {
    const record = await this.prisma.financialPayment.findFirst({
      where: {
        transactionPublicId,
      },

      include: {
        account: true,
        method: true,
        attempts: true,
      },
    });

    if (record === null) {
      return null;
    }

    return record;
  }

  // ===========================================================================
  // Prisma Payment Graph — Reference Lookup
  // ===========================================================================

  /**
   * Loads the complete persistence graph using an originating business
   * reference.
   *
   * The reference pair is not currently a Prisma unique constraint, so
   * findFirst() is intentionally used.
   */
  private async findPaymentRecordByReference(
    referenceType: string,
    referencePublicId: string,
  ): Promise<FinancialPaymentWithRelations | null> {
    const record = await this.prisma.financialPayment.findFirst({
      where: {
        referenceType,
        referencePublicId,
      },

      include: {
        account: true,
        method: true,
        attempts: true,
      },
    });

    if (record === null) {
      return null;
    }

    return record;
  }

  // ===========================================================================
  // Resolve Financial Account
  // ===========================================================================

  /**
   * Resolves:
   *
   * FinancialAccountPublicId
   *          ↓
   * FinancialAccount.id
   *
   * The domain never receives the internal database identity.
   */
  private async resolveAccountId(
    prisma: PrismaClient | Prisma.TransactionClient,
    accountPublicId: FinancialAccountPublicId,
  ): Promise<string> {
    const account = await prisma.financialAccount.findUnique({
      where: {
        publicId: accountPublicId.value,
      },

      select: {
        id: true,
      },
    });

    if (account === null) {
      throw new FinancialPaymentException(
        `Financial Account "${accountPublicId.value}" does not exist.`,
      );
    }

    return account.id;
  }

  // ===========================================================================
  // Resolve Financial Payment Method
  // ===========================================================================

  /**
   * Resolves:
   *
   * FinancialPaymentMethodPublicId
   *             ↓
   * FinancialPaymentMethod.id
   *
   * Additionally verifies that the Payment Method belongs to the same
   * Financial Account as the Financial Payment.
   */
  private async resolveMethodId(
    prisma: PrismaClient | Prisma.TransactionClient,
    methodPublicId: FinancialPaymentMethodPublicId | undefined,
    accountId: string,
  ): Promise<string | undefined> {
    if (methodPublicId === undefined) {
      return undefined;
    }

    const method = await prisma.financialPaymentMethod.findUnique({
      where: {
        publicId: methodPublicId.value,
      },

      select: {
        id: true,
        accountId: true,
      },
    });

    if (method === null) {
      throw new FinancialPaymentException(
        `Financial Payment Method "${methodPublicId.value}" does not exist.`,
      );
    }

    if (method.accountId !== accountId) {
      throw new FinancialPaymentException(
        `Financial Payment Method "${methodPublicId.value}" does not belong to the Financial Account associated with the Payment.`,
      );
    }

    return method.id;
  }

  // ===========================================================================
  // Create Attempts
  // ===========================================================================

  /**
   * Creates all Payment Attempts belonging to a newly-created Payment.
   *
   * The surrounding Prisma transaction guarantees atomicity.
   */
  private async createAttempts(
    prisma: PrismaClient | Prisma.TransactionClient,
    aggregate: FinancialPaymentAggregate,
  ): Promise<void> {
    if (aggregate.attempts.length === 0) {
      return;
    }

    const paymentId = aggregate.id.toString();

    for (const attempt of aggregate.attempts) {
      // -----------------------------------------------------------------------
      // Aggregate Ownership
      // -----------------------------------------------------------------------

      if (attempt.paymentId.toString() !== paymentId) {
        throw new FinancialPaymentException(
          `Financial Payment Attempt "${attempt.publicId.value}" does not belong to Financial Payment "${aggregate.publicId.value}".`,
        );
      }

      const persistence =
        FinancialPaymentPrismaMapper.attemptToPersistence(attempt);

      await prisma.financialPaymentAttempt.create({
        data: {
          id: persistence.id,

          publicId: persistence.publicId,

          paymentId: persistence.paymentId,

          status: persistence.status,

          provider: persistence.provider,

          providerReference: persistence.providerReference,

          amount: persistence.amount,

          currency: persistence.currency,

          failureCode: persistence.failureCode,

          failureMessage: persistence.failureMessage,

          startedAt: persistence.startedAt,

          completedAt: persistence.completedAt,

          failedAt: persistence.failedAt,
        },
      });
    }
  }

  // ===========================================================================
  // Synchronize Attempts
  // ===========================================================================

  /**
   * Synchronizes Payment Attempts owned by the aggregate.
   *
   * Policy:
   *
   * - Existing attempt -> update.
   * - New attempt -> create.
   * - Missing persisted attempt -> preserve.
   *
   * Attempts are intentionally never deleted.
   */
  private async synchronizeAttempts(
    prisma: PrismaClient | Prisma.TransactionClient,
    aggregate: FinancialPaymentAggregate,
  ): Promise<void> {
    const paymentId = aggregate.id.toString();

    for (const attempt of aggregate.attempts) {
      // -----------------------------------------------------------------------
      // Aggregate Ownership
      // -----------------------------------------------------------------------

      if (attempt.paymentId.toString() !== paymentId) {
        throw new FinancialPaymentException(
          `Financial Payment Attempt "${attempt.publicId.value}" does not belong to Financial Payment "${aggregate.publicId.value}".`,
        );
      }

      const persistence =
        FinancialPaymentPrismaMapper.attemptToPersistence(attempt);

      // -----------------------------------------------------------------------
      // Locate Existing Attempt
      // -----------------------------------------------------------------------

      const existingAttempt = await prisma.financialPaymentAttempt.findUnique({
        where: {
          id: persistence.id,
        },

        select: {
          id: true,
          publicId: true,
          paymentId: true,
        },
      });

      // -----------------------------------------------------------------------
      // New Attempt
      // -----------------------------------------------------------------------

      if (existingAttempt === null) {
        await prisma.financialPaymentAttempt.create({
          data: {
            id: persistence.id,

            publicId: persistence.publicId,

            paymentId: persistence.paymentId,

            status: persistence.status,

            provider: persistence.provider,

            providerReference: persistence.providerReference,

            amount: persistence.amount,

            currency: persistence.currency,

            failureCode: persistence.failureCode,

            failureMessage: persistence.failureMessage,

            startedAt: persistence.startedAt,

            completedAt: persistence.completedAt,

            failedAt: persistence.failedAt,
          },
        });

        continue;
      }

      // -----------------------------------------------------------------------
      // Public Identity Consistency
      // -----------------------------------------------------------------------

      if (existingAttempt.publicId !== persistence.publicId) {
        throw new FinancialPaymentException(
          `Financial Payment Attempt internal identity "${persistence.id}" is associated with a different public identity.`,
        );
      }

      // -----------------------------------------------------------------------
      // Aggregate Ownership
      // -----------------------------------------------------------------------

      if (existingAttempt.paymentId !== paymentId) {
        throw new FinancialPaymentException(
          `Financial Payment Attempt "${attempt.publicId.value}" belongs to another Financial Payment.`,
        );
      }

      // -----------------------------------------------------------------------
      // Update Existing Attempt
      // -----------------------------------------------------------------------

      await prisma.financialPaymentAttempt.update({
        where: {
          id: persistence.id,
        },

        data: {
          status: persistence.status,

          provider: persistence.provider,

          providerReference: persistence.providerReference,

          amount: persistence.amount,

          currency: persistence.currency,

          failureCode: persistence.failureCode,

          failureMessage: persistence.failureMessage,

          startedAt: persistence.startedAt,

          completedAt: persistence.completedAt,

          failedAt: persistence.failedAt,
        },
      });
    }
  }
}
