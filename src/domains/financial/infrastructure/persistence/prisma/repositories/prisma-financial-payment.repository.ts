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
// - Persist Payment Attempts with their parent Payment.
// - Preserve internal persistence identities.
// - Preserve public domain identities.
// - Preserve Payment Attempt execution history.
// - Enforce persistence-level relational consistency.
// - Participate in an ambient application transaction.
//
// Transaction boundary:
//
// This repository does NOT create its own Prisma transaction.
//
// All Prisma access is resolved through PrismaTransactionContext.
//
// When a PrismaUnitOfWork is active:
//
//     Repository
//          ↓
//     PrismaTransactionContext
//          ↓
//     Prisma.TransactionClient
//
// When no UnitOfWork is active:
//
//     Repository
//          ↓
//     PrismaTransactionContext
//          ↓
//     PrismaService
//
// Therefore, multi-aggregate / multi-domain application workflows can execute
// this repository together with other repositories inside one atomic
// transaction.
//
// Atomicity belongs to the application UnitOfWork boundary rather than to
// individual repository methods.
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

import type { Prisma } from '@prisma/client';

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

@Injectable()
export class PrismaFinancialPaymentRepository implements FinancialPaymentRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  // ===========================================================================
  // Ambient Prisma Client
  // ===========================================================================

  /**
   * Returns the Prisma client associated with the current application
   * transaction context.
   *
   * The repository deliberately does not inject PrismaService directly.
   *
   * This keeps transaction ownership outside the repository and allows the
   * same repository implementation to participate in a surrounding
   * PrismaUnitOfWork.
   */
  private get prisma(): PrismaClientLike {
    return this.transactionContext.getClient();
  }

  // ===========================================================================
  // Create
  // ===========================================================================

  /**
   * Persists a brand-new Financial Payment aggregate.
   *
   * Persistence consists of:
   *
   * FinancialPayment
   * └── FinancialPaymentAttempt[]
   *
   * Public domain identities are translated into internal persistence IDs
   * before persistence.
   *
   * The repository itself does not create a transaction.
   *
   * When called inside PrismaUnitOfWork, the Payment and all of its Attempts
   * are persisted through the same transaction-scoped Prisma client.
   */
  public async create(aggregate: FinancialPaymentAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new FinancialPaymentException(
        'Financial Payment aggregate is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Resolve Owning Financial Account
    // -------------------------------------------------------------------------

    const accountId = await this.resolveAccountId(aggregate.accountId);

    // -------------------------------------------------------------------------
    // Resolve Payment Method
    // -------------------------------------------------------------------------

    const methodId = await this.resolveMethodId(aggregate.methodId, accountId);

    // -------------------------------------------------------------------------
    // Map Aggregate
    // -------------------------------------------------------------------------

    const persistence = FinancialPaymentPrismaMapper.aggregateToPersistence(
      aggregate,
      accountId,
      methodId,
    );

    // -------------------------------------------------------------------------
    // Validate Persistence References
    // -------------------------------------------------------------------------

    if (persistence.payment.accountId !== accountId) {
      throw new FinancialPaymentException(
        `Financial Payment "${aggregate.publicId.value}" contains an inconsistent Financial Account reference.`,
      );
    }

    if (persistence.payment.methodId !== methodId) {
      throw new FinancialPaymentException(
        `Financial Payment "${aggregate.publicId.value}" contains an inconsistent Financial Payment Method reference.`,
      );
    }

    // -------------------------------------------------------------------------
    // Create Payment
    // -------------------------------------------------------------------------

    await this.prisma.financialPayment.create({
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

    // -------------------------------------------------------------------------
    // Create Attempts
    // -------------------------------------------------------------------------

    await this.createAttempts(aggregate);
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
   * 5. Verify persistence references.
   * 6. Update Payment.
   * 7. Synchronize owned Attempts.
   *
   * Attempts are append-only:
   *
   * - Existing attempts may be updated.
   * - New attempts may be inserted.
   * - Missing attempts are never deleted.
   *
   * No repository-owned transaction is created.
   */
  public async save(aggregate: FinancialPaymentAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new FinancialPaymentException(
        'Financial Payment aggregate is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Verify Payment Exists
    // -------------------------------------------------------------------------

    const existingPayment = await this.prisma.financialPayment.findUnique({
      where: {
        id: aggregate.id.toString(),
      },

      select: {
        id: true,
        publicId: true,
        accountId: true,
        methodId: true,
      },
    });

    if (existingPayment === null) {
      throw new FinancialPaymentException(
        `Financial Payment "${aggregate.publicId.value}" does not exist and cannot be updated.`,
      );
    }

    // -------------------------------------------------------------------------
    // Validate Public Identity Stability
    // -------------------------------------------------------------------------

    if (existingPayment.publicId !== aggregate.publicId.value) {
      throw new FinancialPaymentException(
        `Financial Payment internal identity "${aggregate.id.toString()}" is associated with a different public identity.`,
      );
    }

    // -------------------------------------------------------------------------
    // Resolve Owning Financial Account
    // -------------------------------------------------------------------------

    const accountId = await this.resolveAccountId(aggregate.accountId);

    // -------------------------------------------------------------------------
    // Preserve Financial Account Ownership
    // -------------------------------------------------------------------------

    if (existingPayment.accountId !== accountId) {
      throw new FinancialPaymentException(
        `Financial Payment "${aggregate.publicId.value}" cannot be moved to another Financial Account.`,
      );
    }

    // -------------------------------------------------------------------------
    // Resolve Payment Method
    // -------------------------------------------------------------------------

    const methodId = await this.resolveMethodId(aggregate.methodId, accountId);

    // -------------------------------------------------------------------------
    // Preserve Payment Method Association
    // -------------------------------------------------------------------------

    if (existingPayment.methodId !== methodId) {
      throw new FinancialPaymentException(
        `Financial Payment "${aggregate.publicId.value}" cannot be moved to another Financial Payment Method.`,
      );
    }

    // -------------------------------------------------------------------------
    // Map Aggregate
    // -------------------------------------------------------------------------

    const persistence = FinancialPaymentPrismaMapper.aggregateToPersistence(
      aggregate,
      accountId,
      methodId,
    );

    // -------------------------------------------------------------------------
    // Validate Persistence References
    // -------------------------------------------------------------------------

    if (persistence.payment.accountId !== accountId) {
      throw new FinancialPaymentException(
        `Financial Payment "${aggregate.publicId.value}" contains an inconsistent Financial Account reference.`,
      );
    }

    if (persistence.payment.methodId !== methodId) {
      throw new FinancialPaymentException(
        `Financial Payment "${aggregate.publicId.value}" contains an inconsistent Financial Payment Method reference.`,
      );
    }

    // -------------------------------------------------------------------------
    // Update Payment
    // -------------------------------------------------------------------------

    await this.prisma.financialPayment.update({
      where: {
        id: aggregate.id.toString(),
      },

      data: {
        amount: persistence.payment.amount,

        currency: persistence.payment.currency,

        status: persistence.payment.status,

        transactionPublicId: persistence.payment.transactionPublicId,

        referenceType: persistence.payment.referenceType,

        referencePublicId: persistence.payment.referencePublicId,

        initiatedAt: persistence.payment.initiatedAt,

        completedAt: persistence.payment.completedAt,

        failedAt: persistence.payment.failedAt,

        cancelledAt: persistence.payment.cancelledAt,
      },
    });

    // -------------------------------------------------------------------------
    // Synchronize Attempts
    // -------------------------------------------------------------------------

    await this.synchronizeAttempts(aggregate);
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
    const normalized = publicId.value.trim();

    if (!normalized) {
      throw new FinancialPaymentException(
        'Financial Payment public ID must not be empty.',
      );
    }

    const record = await this.findPaymentRecordByUnique({
      publicId: normalized,
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
    const internalAccountId = await this.resolveAccountId(accountId);

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
    const normalized = methodId.value.trim();

    if (!normalized) {
      throw new FinancialPaymentException(
        'Financial Payment Method public ID must not be empty.',
      );
    }

    const method = await this.prisma.financialPaymentMethod.findUnique({
      where: {
        publicId: normalized,
      },

      select: {
        id: true,
      },
    });

    if (method === null) {
      throw new FinancialPaymentException(
        `Financial Payment Method "${normalized}" does not exist.`,
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
    const normalized = publicId.value.trim();

    if (!normalized) {
      throw new FinancialPaymentException(
        'Financial Payment public ID must not be empty.',
      );
    }

    const record = await this.prisma.financialPayment.findUnique({
      where: {
        publicId: normalized,
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
    return Promise.reject(
      new FinancialPaymentException(
        'Financial Payment aggregates cannot be physically deleted.',
      ),
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
   *
   * The lookup uses the ambient transaction context.
   */
  private async resolveAccountId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<string> {
    const normalized = accountPublicId.value.trim();

    if (!normalized) {
      throw new FinancialPaymentException(
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
      throw new FinancialPaymentException(
        `Financial Account "${normalized}" does not exist.`,
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
   *
   * An undefined method public ID represents a Payment without an associated
   * Payment Method and is therefore preserved as undefined.
   */
  private async resolveMethodId(
    methodPublicId: FinancialPaymentMethodPublicId | undefined,
    accountId: string,
  ): Promise<string | undefined> {
    if (methodPublicId === undefined) {
      return undefined;
    }

    const normalized = methodPublicId.value.trim();

    if (!normalized) {
      throw new FinancialPaymentException(
        'Financial Payment Method public ID must not be empty.',
      );
    }

    const method = await this.prisma.financialPaymentMethod.findUnique({
      where: {
        publicId: normalized,
      },

      select: {
        id: true,
        accountId: true,
      },
    });

    if (method === null) {
      throw new FinancialPaymentException(
        `Financial Payment Method "${normalized}" does not exist.`,
      );
    }

    if (method.accountId !== accountId) {
      throw new FinancialPaymentException(
        `Financial Payment Method "${normalized}" does not belong to the Financial Account associated with the Payment.`,
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
   * Attempts are aggregate-owned and are therefore persisted as part of the
   * aggregate persistence operation.
   *
   * Atomicity is supplied by the ambient PrismaTransactionContext when this
   * repository is executed inside PrismaUnitOfWork.
   */
  private async createAttempts(
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

      // -----------------------------------------------------------------------
      // Persistence Parent Consistency
      // -----------------------------------------------------------------------

      if (persistence.paymentId !== paymentId) {
        throw new FinancialPaymentException(
          `Financial Payment Attempt "${attempt.publicId.value}" contains an inconsistent Financial Payment reference.`,
        );
      }

      // -----------------------------------------------------------------------
      // Create Attempt
      // -----------------------------------------------------------------------

      await this.prisma.financialPaymentAttempt.create({
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
      // Persistence Parent Consistency
      // -----------------------------------------------------------------------

      if (persistence.paymentId !== paymentId) {
        throw new FinancialPaymentException(
          `Financial Payment Attempt "${attempt.publicId.value}" contains an inconsistent Financial Payment reference.`,
        );
      }

      // -----------------------------------------------------------------------
      // Locate Existing Attempt
      // -----------------------------------------------------------------------

      const existingAttempt =
        await this.prisma.financialPaymentAttempt.findUnique({
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
        await this.prisma.financialPaymentAttempt.create({
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

      await this.prisma.financialPaymentAttempt.update({
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
