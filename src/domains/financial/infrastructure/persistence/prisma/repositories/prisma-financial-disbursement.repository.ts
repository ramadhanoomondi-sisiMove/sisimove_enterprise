// -----------------------------------------------------------------------------
// Prisma Financial Disbursement Repository
// -----------------------------------------------------------------------------
//
// Persistence implementation for the Financial Disbursement aggregate.
//
// Aggregate:
//
// FinancialDisbursementAggregate
// ├── FinancialDisbursementEntity
// │   └── FinancialDisbursementAttemptEntity[]
// └── FinancialDisbursementDestinationEntity
//
// IMPORTANT:
//
// FinancialDisbursementDestinationEntity is an associated independently
// persisted Financial-domain entity. It is NOT owned by the
// FinancialDisbursementAggregate.
//
// FinancialDisbursementAttemptEntity[] IS aggregate-owned.
//
// Frozen persistence model:
//
// FinancialDisbursement
// ├── sourceAccountId
// ├── destinationId
// └── attempts[]
//
// FinancialDisbursementDestination
// └── accountId
//
// FinancialDisbursementAttempt
// └── disbursementId
//
// Responsibilities:
//
// - Persist Financial Disbursement aggregates.
// - Rehydrate complete Financial Disbursement aggregates.
// - Resolve Financial Account public identities.
// - Resolve Financial Disbursement Destination public identities.
// - Preserve internal persistence identities.
// - Preserve public domain identities.
// - Preserve source-account ownership.
// - Preserve destination association.
// - Persist aggregate-owned attempts.
// - Synchronize attempt lifecycle state.
// - Support aggregate queries.
// - Support destination resolution.
// - Support source-account queries.
// - Support business-reference queries.
// - Support transaction-reference queries.
// - Support lifecycle-status queries.
// - Support existence queries.
//
// Transaction boundary:
//
// This repository DOES NOT create its own Prisma transaction.
//
// All persistence operations use PrismaTransactionContext.
//
// When the repository is called inside a PrismaUnitOfWork, the transaction
// context resolves to the active Prisma.TransactionClient and therefore all
// operations performed by this repository participate in the ambient
// application transaction.
//
// When no UnitOfWork is active, the transaction context falls back to the
// application PrismaService.
//
// Therefore:
//
//     Application Workflow
//             │
//             ▼
//     PrismaUnitOfWork
//             │
//             ▼
//     PrismaTransactionContext
//             │
//       ┌─────┴─────┐
//       ▼           ▼
//   Transaction   PrismaService
//
// The repository is deliberately transaction-agnostic.
//
// Atomicity belongs to the application UnitOfWork boundary, not to an
// individual repository method.
//
// This is required so workflows spanning multiple Financial aggregates or
// multiple domains can participate in one database transaction.
//
// This repository does NOT:
//
// - Modify Financial Account balances.
// - Create or post Financial Transactions.
// - Execute providers.
// - Move money.
// - Select providers.
// - Select destinations.
// - Apply retry policy.
// - Emit domain events.
// - Perform accounting.
// - Perform settlement.
// - Perform application orchestration.
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

import type { FinancialDisbursementRepository } from '../../../../domain/repositories/financial-disbursement.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAggregate } from '../../../../domain/aggregates/financial-disbursement.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { FinancialDisbursementDestinationEntity } from '../../../../domain/entities/financial-disbursement-destination.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  FinancialDisbursementPrismaMapper,
  type FinancialDisbursementWithRelations,
} from '../mappers/financial-disbursement-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../../../../domain/value-objects/financial-account-public-id.vo';

import type { FinancialDisbursementDestinationPublicId } from '../../../../domain/value-objects/financial-disbursement-destination-public-id.vo';

import type { FinancialDisbursementPublicId } from '../../../../domain/value-objects/financial-disbursement-public-id.vo';

import type { FinancialDisbursementStatus } from '../../../../domain/value-objects/financial-disbursement-status.vo';

import type { FinancialReferenceType } from '../../../../domain/value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../../../../domain/value-objects/financial-reference-public-id.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialDisbursementException } from '../../../../domain/exceptions/financial-disbursement.exception';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaFinancialDisbursementRepository implements FinancialDisbursementRepository {
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
   * IMPORTANT:
   *
   * This is intentionally not a PrismaService property.
   *
   * PrismaTransactionContext resolves to:
   *
   * - Prisma.TransactionClient when a PrismaUnitOfWork is active;
   * - PrismaService when no UnitOfWork is active.
   *
   * Consequently, every repository operation participates automatically in
   * the surrounding application transaction when one exists.
   */
  private get prisma(): PrismaClientLike {
    return this.transactionContext.getClient();
  }

  // ===========================================================================
  // Create
  // ===========================================================================

  /**
   * Persists a brand-new Financial Disbursement aggregate.
   *
   * Persistence consists of:
   *
   * FinancialDisbursement
   * └── FinancialDisbursementAttempt[]
   *
   * The selected Financial Disbursement Destination already exists.
   *
   * The destination is referenced but is never created or modified here.
   *
   * IMPORTANT:
   *
   * This method does not create its own transaction.
   *
   * If atomicity is required, the application command handler/use-case must
   * execute this method inside PrismaUnitOfWork.
   */
  public async create(
    aggregate: FinancialDisbursementAggregate,
  ): Promise<void> {
    if (aggregate === undefined) {
      throw new FinancialDisbursementException(
        'Financial Disbursement aggregate is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Resolve Source Financial Account
    // -------------------------------------------------------------------------

    const accountId = await this.resolveAccountId(
      aggregate.sourceAccountPublicId,
    );

    // -------------------------------------------------------------------------
    // Resolve Destination
    // -------------------------------------------------------------------------

    const destinationId = await this.resolveDestinationId(
      aggregate.destinationPublicId,
      accountId,
    );

    // -------------------------------------------------------------------------
    // Map Aggregate
    // -------------------------------------------------------------------------

    const persistence =
      FinancialDisbursementPrismaMapper.aggregateToPersistence(aggregate);

    // -------------------------------------------------------------------------
    // Validate Source Account Consistency
    // -------------------------------------------------------------------------

    if (persistence.disbursement.sourceAccountId !== accountId) {
      throw new FinancialDisbursementException(
        `Financial Disbursement "${aggregate.publicId.value}" contains an inconsistent source Financial Account reference.`,
      );
    }

    // -------------------------------------------------------------------------
    // Validate Destination Consistency
    // -------------------------------------------------------------------------

    if (persistence.disbursement.destinationId !== destinationId) {
      throw new FinancialDisbursementException(
        `Financial Disbursement "${aggregate.publicId.value}" contains an inconsistent Financial Disbursement Destination reference.`,
      );
    }

    // -------------------------------------------------------------------------
    // Create Disbursement
    // -------------------------------------------------------------------------

    await this.prisma.financialDisbursement.create({
      data: {
        id: persistence.disbursement.id,

        publicId: persistence.disbursement.publicId,

        sourceAccountId: accountId,

        destinationId,

        amount: persistence.disbursement.amount,

        currency: persistence.disbursement.currency,

        status: persistence.disbursement.status,

        referenceType: persistence.disbursement.referenceType,

        referencePublicId: persistence.disbursement.referencePublicId,

        transactionPublicId: persistence.disbursement.transactionPublicId,

        requestedAt: persistence.disbursement.requestedAt,

        completedAt: persistence.disbursement.completedAt,

        failedAt: persistence.disbursement.failedAt,

        cancelledAt: persistence.disbursement.cancelledAt,

        createdAt: persistence.disbursement.createdAt,

        updatedAt: persistence.disbursement.updatedAt,
      },
    });

    // -------------------------------------------------------------------------
    // Create Aggregate-Owned Attempts
    // -------------------------------------------------------------------------

    await this.createAttempts(aggregate);
  }

  // ===========================================================================
  // Save
  // ===========================================================================

  /**
   * Persists the current state of an existing Financial Disbursement
   * aggregate.
   *
   * Persistence strategy:
   *
   * 1. Verify aggregate existence.
   * 2. Verify public identity stability.
   * 3. Resolve source Financial Account.
   * 4. Verify source-account ownership stability.
   * 5. Resolve destination.
   * 6. Verify destination association stability.
   * 7. Update the Financial Disbursement.
   * 8. Synchronize aggregate-owned attempts.
   *
   * IMPORTANT:
   *
   * No repository-owned transaction is created here.
   *
   * When called from a PrismaUnitOfWork, all operations below use the same
   * transaction-scoped Prisma client and therefore remain atomic.
   */
  public async save(aggregate: FinancialDisbursementAggregate): Promise<void> {
    if (aggregate === undefined) {
      throw new FinancialDisbursementException(
        'Financial Disbursement aggregate is required.',
      );
    }

    // -------------------------------------------------------------------------
    // Load Existing Disbursement
    // -------------------------------------------------------------------------

    const existing = await this.prisma.financialDisbursement.findUnique({
      where: {
        id: aggregate.id.toString(),
      },

      select: {
        id: true,
        publicId: true,
        sourceAccountId: true,
        destinationId: true,
      },
    });

    // -------------------------------------------------------------------------
    // Existence
    // -------------------------------------------------------------------------

    if (existing === null) {
      throw new FinancialDisbursementException(
        `Financial Disbursement "${aggregate.publicId.value}" does not exist and cannot be updated.`,
      );
    }

    // -------------------------------------------------------------------------
    // Public Identity Stability
    // -------------------------------------------------------------------------

    if (existing.publicId !== aggregate.publicId.value) {
      throw new FinancialDisbursementException(
        `Financial Disbursement internal identity "${aggregate.id.toString()}" is associated with a different public identity.`,
      );
    }

    // -------------------------------------------------------------------------
    // Resolve Source Financial Account
    // -------------------------------------------------------------------------

    const accountId = await this.resolveAccountId(
      aggregate.sourceAccountPublicId,
    );

    // -------------------------------------------------------------------------
    // Source Account Ownership Stability
    // -------------------------------------------------------------------------

    if (existing.sourceAccountId !== accountId) {
      throw new FinancialDisbursementException(
        `Financial Disbursement "${aggregate.publicId.value}" cannot be moved to another Financial Account.`,
      );
    }

    // -------------------------------------------------------------------------
    // Resolve Destination
    // -------------------------------------------------------------------------

    const destinationId = await this.resolveDestinationId(
      aggregate.destinationPublicId,
      accountId,
    );

    // -------------------------------------------------------------------------
    // Destination Association Stability
    // -------------------------------------------------------------------------

    if (existing.destinationId !== destinationId) {
      throw new FinancialDisbursementException(
        `Financial Disbursement "${aggregate.publicId.value}" cannot be moved to another Financial Disbursement Destination.`,
      );
    }

    // -------------------------------------------------------------------------
    // Map Aggregate
    // -------------------------------------------------------------------------

    const persistence =
      FinancialDisbursementPrismaMapper.aggregateToPersistence(aggregate);

    // -------------------------------------------------------------------------
    // Validate Persistence References
    // -------------------------------------------------------------------------

    if (persistence.disbursement.sourceAccountId !== accountId) {
      throw new FinancialDisbursementException(
        `Financial Disbursement "${aggregate.publicId.value}" contains an inconsistent source Financial Account reference.`,
      );
    }

    if (persistence.disbursement.destinationId !== destinationId) {
      throw new FinancialDisbursementException(
        `Financial Disbursement "${aggregate.publicId.value}" contains an inconsistent Financial Disbursement Destination reference.`,
      );
    }

    // -------------------------------------------------------------------------
    // Update Disbursement
    // -------------------------------------------------------------------------

    await this.prisma.financialDisbursement.update({
      where: {
        id: aggregate.id.toString(),
      },

      data: {
        amount: persistence.disbursement.amount,

        currency: persistence.disbursement.currency,

        status: persistence.disbursement.status,

        referenceType: persistence.disbursement.referenceType,

        referencePublicId: persistence.disbursement.referencePublicId,

        transactionPublicId: persistence.disbursement.transactionPublicId,

        requestedAt: persistence.disbursement.requestedAt,

        completedAt: persistence.disbursement.completedAt,

        failedAt: persistence.disbursement.failedAt,

        cancelledAt: persistence.disbursement.cancelledAt,

        updatedAt: persistence.disbursement.updatedAt,
      },
    });

    // -------------------------------------------------------------------------
    // Synchronize Aggregate-Owned Attempts
    // -------------------------------------------------------------------------

    await this.synchronizeAttempts(aggregate);
  }

  // ===========================================================================
  // Find Destination by Public ID
  // ===========================================================================

  /**
   * Resolves an independently persisted Financial Disbursement Destination.
   *
   * The destination remains outside the ownership boundary of the
   * FinancialDisbursementAggregate.
   *
   * Returns null when the destination does not exist.
   */
  public async findDestinationByPublicId(
    publicId: FinancialDisbursementDestinationPublicId,
  ): Promise<FinancialDisbursementDestinationEntity | null> {
    const normalized = publicId.value.trim();

    if (!normalized) {
      throw new FinancialDisbursementException(
        'Financial Disbursement Destination public ID must not be empty.',
      );
    }

    const record =
      await this.prisma.financialDisbursementDestination.findUnique({
        where: {
          publicId: normalized,
        },
      });

    if (record === null) {
      return null;
    }

    return FinancialDisbursementPrismaMapper.destinationToEntity(record);
  }

  // ===========================================================================
  // Find by Public ID
  // ===========================================================================

  public async findByPublicId(
    publicId: FinancialDisbursementPublicId,
  ): Promise<FinancialDisbursementAggregate | null> {
    const normalized = publicId.value.trim();

    if (!normalized) {
      throw new FinancialDisbursementException(
        'Financial Disbursement public ID must not be empty.',
      );
    }

    const record = await this.findDisbursementRecordByUnique({
      publicId: normalized,
    });

    if (record === null) {
      return null;
    }

    return FinancialDisbursementPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find by Internal ID
  // ===========================================================================

  public async findById(
    id: string,
  ): Promise<FinancialDisbursementAggregate | null> {
    const normalized = id.trim();

    if (!normalized) {
      throw new FinancialDisbursementException(
        'Financial Disbursement internal ID must not be empty.',
      );
    }

    const record = await this.findDisbursementRecordByUnique({
      id: normalized,
    });

    if (record === null) {
      return null;
    }

    return FinancialDisbursementPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find by Source Financial Account
  // ===========================================================================

  public async findBySourceAccountPublicId(
    sourceAccountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialDisbursementAggregate[]> {
    const accountId = await this.resolveAccountId(sourceAccountPublicId);

    const records = await this.prisma.financialDisbursement.findMany({
      where: {
        sourceAccountId: accountId,
      },

      include: {
        sourceAccount: true,
        destination: true,
        attempts: true,
      },

      orderBy: {
        requestedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialDisbursementPrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Find by Business Reference
  // ===========================================================================

  public async findByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<FinancialDisbursementAggregate[]> {
    const normalizedType = referenceType.value.trim();

    const normalizedPublicId = referencePublicId.value.trim();

    if (!normalizedType || !normalizedPublicId) {
      throw new FinancialDisbursementException(
        'Financial Disbursement reference type and public ID must not be empty.',
      );
    }

    const records = await this.prisma.financialDisbursement.findMany({
      where: {
        referenceType: normalizedType,
        referencePublicId: normalizedPublicId,
      },

      include: {
        sourceAccount: true,
        destination: true,
        attempts: true,
      },

      orderBy: {
        requestedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialDisbursementPrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Find by Transaction
  // ===========================================================================

  public async findByTransactionPublicId(
    transactionPublicId: FinancialReferencePublicId,
  ): Promise<FinancialDisbursementAggregate | null> {
    const normalized = transactionPublicId.value.trim();

    if (!normalized) {
      throw new FinancialDisbursementException(
        'Financial Transaction public ID must not be empty.',
      );
    }

    const record = await this.prisma.financialDisbursement.findFirst({
      where: {
        transactionPublicId: normalized,
      },

      include: {
        sourceAccount: true,
        destination: true,
        attempts: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialDisbursementPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find by Status
  // ===========================================================================

  public async findByStatus(
    status: FinancialDisbursementStatus,
  ): Promise<FinancialDisbursementAggregate[]> {
    const records = await this.prisma.financialDisbursement.findMany({
      where: {
        status: status.value,
      },

      include: {
        sourceAccount: true,
        destination: true,
        attempts: true,
      },

      orderBy: {
        requestedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialDisbursementPrismaMapper.toDomain(record),
    );
  }

  // ===========================================================================
  // Exists by Public ID
  // ===========================================================================

  public async existsByPublicId(
    publicId: FinancialDisbursementPublicId,
  ): Promise<boolean> {
    const normalized = publicId.value.trim();

    if (!normalized) {
      throw new FinancialDisbursementException(
        'Financial Disbursement public ID must not be empty.',
      );
    }

    const record = await this.prisma.financialDisbursement.findUnique({
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
  // Prisma Graph — Unique Lookup
  // ===========================================================================

  /**
   * Loads the complete persistence graph through a Prisma unique selector.
   *
   * Valid selectors:
   *
   * - id
   * - publicId
   */
  private async findDisbursementRecordByUnique(
    where: Prisma.FinancialDisbursementWhereUniqueInput,
  ): Promise<FinancialDisbursementWithRelations | null> {
    const record = await this.prisma.financialDisbursement.findUnique({
      where,

      include: {
        sourceAccount: true,
        destination: true,
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
   * The public ID remains the domain-level identity.
   *
   * The internal Prisma ID is resolved only at the persistence boundary.
   *
   * IMPORTANT:
   *
   * This method intentionally uses the ambient Prisma client. It does not
   * accept a Prisma client argument because transaction scope is owned by
   * PrismaTransactionContext.
   */
  private async resolveAccountId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<string> {
    const normalized = accountPublicId.value.trim();

    if (!normalized) {
      throw new FinancialDisbursementException(
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
      throw new FinancialDisbursementException(
        `Financial Account "${normalized}" does not exist.`,
      );
    }

    return account.id;
  }

  // ===========================================================================
  // Resolve Destination
  // ===========================================================================

  /**
   * Resolves:
   *
   * FinancialDisbursementDestinationPublicId
   *                 ↓
   * FinancialDisbursementDestination.id
   *
   * Additionally verifies that the destination belongs to the source
   * Financial Account.
   *
   * IMPORTANT:
   *
   * Destination ownership is a persistence invariant:
   *
   * FinancialAccount
   *      │
   *      └── FinancialDisbursementDestination
   *
   * A destination belonging to another Financial Account cannot be attached
   * to this Financial Disbursement.
   */
  private async resolveDestinationId(
    destinationPublicId: FinancialDisbursementDestinationPublicId,
    accountId: string,
  ): Promise<string> {
    const normalized = destinationPublicId.value.trim();

    if (!normalized) {
      throw new FinancialDisbursementException(
        'Financial Disbursement Destination public ID must not be empty.',
      );
    }

    const destination =
      await this.prisma.financialDisbursementDestination.findUnique({
        where: {
          publicId: normalized,
        },

        select: {
          id: true,
          accountId: true,
        },
      });

    if (destination === null) {
      throw new FinancialDisbursementException(
        `Financial Disbursement Destination "${normalized}" does not exist.`,
      );
    }

    if (destination.accountId !== accountId) {
      throw new FinancialDisbursementException(
        `Financial Disbursement Destination "${normalized}" does not belong to the source Financial Account.`,
      );
    }

    return destination.id;
  }

  // ===========================================================================
  // Create Attempts
  // ===========================================================================

  /**
   * Creates all attempts belonging to a newly-created Financial Disbursement.
   *
   * Attempts are aggregate-owned and therefore persisted as part of the
   * aggregate persistence operation.
   *
   * Atomicity is supplied by the ambient PrismaTransactionContext when the
   * caller is executing inside a PrismaUnitOfWork.
   */
  private async createAttempts(
    aggregate: FinancialDisbursementAggregate,
  ): Promise<void> {
    if (aggregate.attempts.length === 0) {
      return;
    }

    const disbursementId = aggregate.id.toString();

    for (const attempt of aggregate.attempts) {
      // -----------------------------------------------------------------------
      // Aggregate Ownership
      // -----------------------------------------------------------------------

      if (attempt.disbursementId.toString() !== disbursementId) {
        throw new FinancialDisbursementException(
          `Financial Disbursement Attempt "${attempt.publicId.value}" does not belong to Financial Disbursement "${aggregate.publicId.value}".`,
        );
      }

      const persistence =
        FinancialDisbursementPrismaMapper.attemptToPersistence(attempt);

      // -----------------------------------------------------------------------
      // Persistence Parent Consistency
      // -----------------------------------------------------------------------

      if (persistence.disbursementId !== disbursementId) {
        throw new FinancialDisbursementException(
          `Financial Disbursement Attempt "${attempt.publicId.value}" contains an inconsistent Financial Disbursement reference.`,
        );
      }

      // -----------------------------------------------------------------------
      // Create
      // -----------------------------------------------------------------------

      await this.prisma.financialDisbursementAttempt.create({
        data: {
          id: persistence.id,

          publicId: persistence.publicId,

          disbursementId: persistence.disbursementId,

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

          createdAt: persistence.createdAt,

          updatedAt: persistence.updatedAt,
        },
      });
    }
  }

  // ===========================================================================
  // Synchronize Attempts
  // ===========================================================================

  /**
   * Synchronizes aggregate-owned attempts.
   *
   * Policy:
   *
   * - Existing attempt -> update.
   * - New attempt -> create.
   * - Missing persisted attempt -> preserve.
   *
   * Attempts are never deleted.
   *
   * The aggregate owns the lifecycle of its attempts, but this repository
   * intentionally does not interpret retry policy or provider semantics.
   *
   * It only persists the state supplied by the aggregate.
   */
  private async synchronizeAttempts(
    aggregate: FinancialDisbursementAggregate,
  ): Promise<void> {
    const disbursementId = aggregate.id.toString();

    for (const attempt of aggregate.attempts) {
      // -----------------------------------------------------------------------
      // Aggregate Ownership
      // -----------------------------------------------------------------------

      if (attempt.disbursementId.toString() !== disbursementId) {
        throw new FinancialDisbursementException(
          `Financial Disbursement Attempt "${attempt.publicId.value}" does not belong to Financial Disbursement "${aggregate.publicId.value}".`,
        );
      }

      const persistence =
        FinancialDisbursementPrismaMapper.attemptToPersistence(attempt);

      // -----------------------------------------------------------------------
      // Persistence Parent Consistency
      // -----------------------------------------------------------------------

      if (persistence.disbursementId !== disbursementId) {
        throw new FinancialDisbursementException(
          `Financial Disbursement Attempt "${attempt.publicId.value}" contains an inconsistent Financial Disbursement reference.`,
        );
      }

      // -----------------------------------------------------------------------
      // Locate Existing Attempt
      // -----------------------------------------------------------------------

      const existing =
        await this.prisma.financialDisbursementAttempt.findUnique({
          where: {
            id: persistence.id,
          },

          select: {
            id: true,
            publicId: true,
            disbursementId: true,
          },
        });

      // -----------------------------------------------------------------------
      // Insert New Attempt
      // -----------------------------------------------------------------------

      if (existing === null) {
        await this.prisma.financialDisbursementAttempt.create({
          data: {
            id: persistence.id,

            publicId: persistence.publicId,

            disbursementId: persistence.disbursementId,

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

            createdAt: persistence.createdAt,

            updatedAt: persistence.updatedAt,
          },
        });

        continue;
      }

      // -----------------------------------------------------------------------
      // Public Identity Stability
      // -----------------------------------------------------------------------

      if (existing.publicId !== persistence.publicId) {
        throw new FinancialDisbursementException(
          `Financial Disbursement Attempt internal identity "${persistence.id}" is associated with a different public identity.`,
        );
      }

      // -----------------------------------------------------------------------
      // Parent Ownership Stability
      // -----------------------------------------------------------------------

      if (existing.disbursementId !== disbursementId) {
        throw new FinancialDisbursementException(
          `Financial Disbursement Attempt "${attempt.publicId.value}" belongs to another Financial Disbursement.`,
        );
      }

      // -----------------------------------------------------------------------
      // Update Existing Attempt
      // -----------------------------------------------------------------------

      await this.prisma.financialDisbursementAttempt.update({
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

          updatedAt: persistence.updatedAt,
        },
      });
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default PrismaFinancialDisbursementRepository;
