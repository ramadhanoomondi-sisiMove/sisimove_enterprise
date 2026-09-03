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
// - Persist aggregate-owned attempts atomically.
// - Synchronize attempt lifecycle state.
// - Support aggregate queries.
// - Support destination resolution.
// - Support source-account queries.
// - Support business-reference queries.
// - Support transaction-reference queries.
// - Support lifecycle-status queries.
// - Support existence queries.
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
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, PrismaClient } from '@prisma/client';

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

export class PrismaFinancialDisbursementRepository implements FinancialDisbursementRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaClient) {}

  // ===========================================================================
  // Create
  // ===========================================================================

  /**
   * Persists a brand-new Financial Disbursement aggregate.
   *
   * Persistence is atomic:
   *
   * FinancialDisbursement
   * └── FinancialDisbursementAttempt[]
   *
   * The selected Financial Disbursement Destination already exists.
   *
   * The destination is referenced but is never created or modified here.
   */
  public async create(
    aggregate: FinancialDisbursementAggregate,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Resolve Source Financial Account
      // -----------------------------------------------------------------------

      const accountId = await this.resolveAccountId(
        tx,
        aggregate.sourceAccountPublicId,
      );

      // -----------------------------------------------------------------------
      // Resolve Destination
      // -----------------------------------------------------------------------

      const destinationId = await this.resolveDestinationId(
        tx,
        aggregate.destinationPublicId,
        accountId,
      );

      // -----------------------------------------------------------------------
      // Map Aggregate
      // -----------------------------------------------------------------------

      const persistence =
        FinancialDisbursementPrismaMapper.aggregateToPersistence(aggregate);

      // -----------------------------------------------------------------------
      // Validate Source Account Consistency
      // -----------------------------------------------------------------------

      if (persistence.disbursement.sourceAccountId !== accountId) {
        throw new FinancialDisbursementException(
          `Financial Disbursement "${aggregate.publicId.value}" contains an inconsistent source Financial Account reference.`,
        );
      }

      // -----------------------------------------------------------------------
      // Validate Destination Consistency
      // -----------------------------------------------------------------------

      if (persistence.disbursement.destinationId !== destinationId) {
        throw new FinancialDisbursementException(
          `Financial Disbursement "${aggregate.publicId.value}" contains an inconsistent Financial Disbursement Destination reference.`,
        );
      }

      // -----------------------------------------------------------------------
      // Create Disbursement
      // -----------------------------------------------------------------------

      await tx.financialDisbursement.create({
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

      // -----------------------------------------------------------------------
      // Create Aggregate-Owned Attempts
      // -----------------------------------------------------------------------

      await this.createAttempts(tx, aggregate);
    });
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
   * All operations occur inside one database transaction.
   */
  public async save(aggregate: FinancialDisbursementAggregate): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Load Existing Disbursement
      // -----------------------------------------------------------------------

      const existing = await tx.financialDisbursement.findUnique({
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

      // -----------------------------------------------------------------------
      // Existence
      // -----------------------------------------------------------------------

      if (existing === null) {
        throw new FinancialDisbursementException(
          `Financial Disbursement "${aggregate.publicId.value}" does not exist and cannot be updated.`,
        );
      }

      // -----------------------------------------------------------------------
      // Public Identity Stability
      // -----------------------------------------------------------------------

      if (existing.publicId !== aggregate.publicId.value) {
        throw new FinancialDisbursementException(
          `Financial Disbursement internal identity "${aggregate.id.toString()}" is associated with a different public identity.`,
        );
      }

      // -----------------------------------------------------------------------
      // Resolve Source Financial Account
      // -----------------------------------------------------------------------

      const accountId = await this.resolveAccountId(
        tx,
        aggregate.sourceAccountPublicId,
      );

      // -----------------------------------------------------------------------
      // Source Account Ownership Stability
      // -----------------------------------------------------------------------

      if (existing.sourceAccountId !== accountId) {
        throw new FinancialDisbursementException(
          `Financial Disbursement "${aggregate.publicId.value}" cannot be moved to another Financial Account.`,
        );
      }

      // -----------------------------------------------------------------------
      // Resolve Destination
      // -----------------------------------------------------------------------

      const destinationId = await this.resolveDestinationId(
        tx,
        aggregate.destinationPublicId,
        accountId,
      );

      // -----------------------------------------------------------------------
      // Destination Association Stability
      // -----------------------------------------------------------------------

      if (existing.destinationId !== destinationId) {
        throw new FinancialDisbursementException(
          `Financial Disbursement "${aggregate.publicId.value}" cannot be moved to another Financial Disbursement Destination.`,
        );
      }

      // -----------------------------------------------------------------------
      // Map Aggregate
      // -----------------------------------------------------------------------

      const persistence =
        FinancialDisbursementPrismaMapper.aggregateToPersistence(aggregate);

      // -----------------------------------------------------------------------
      // Update Disbursement
      // -----------------------------------------------------------------------

      await tx.financialDisbursement.update({
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

      // -----------------------------------------------------------------------
      // Synchronize Aggregate-Owned Attempts
      // -----------------------------------------------------------------------

      await this.synchronizeAttempts(tx, aggregate);
    });
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
    const accountId = await this.resolveAccountId(
      this.prisma,
      sourceAccountPublicId,
    );

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
   */
  private async resolveAccountId(
    prisma: PrismaClient | Prisma.TransactionClient,
    accountPublicId: FinancialAccountPublicId,
  ): Promise<string> {
    const normalized = accountPublicId.value.trim();

    if (!normalized) {
      throw new FinancialDisbursementException(
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
   */
  private async resolveDestinationId(
    prisma: PrismaClient | Prisma.TransactionClient,
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
      await prisma.financialDisbursementDestination.findUnique({
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
   * The surrounding Prisma transaction guarantees atomicity.
   */
  private async createAttempts(
    prisma: PrismaClient | Prisma.TransactionClient,
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
      // Create
      // -----------------------------------------------------------------------

      await prisma.financialDisbursementAttempt.create({
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
   */
  private async synchronizeAttempts(
    prisma: PrismaClient | Prisma.TransactionClient,
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
      // Locate Existing Attempt
      // -----------------------------------------------------------------------

      const existing = await prisma.financialDisbursementAttempt.findUnique({
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
        await prisma.financialDisbursementAttempt.create({
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

      await prisma.financialDisbursementAttempt.update({
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
