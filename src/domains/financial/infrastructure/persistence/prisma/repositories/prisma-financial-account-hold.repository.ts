// -----------------------------------------------------------------------------
// Financial Account Hold Prisma Repository
// -----------------------------------------------------------------------------
//
// Persistence implementation for the Financial Account Hold aggregate.
//
// Aggregate:
//
// FinancialAccountHoldAggregate
// └── FinancialAccountHoldEntity
//
// Responsibilities:
//
// - Persist Financial Account Hold aggregates.
// - Rehydrate complete Financial Account Hold aggregates.
// - Resolve Financial Account public identities into internal Prisma IDs.
// - Preserve internal persistence identities.
// - Preserve public domain identities.
// - Preserve Financial Account ownership.
// - Preserve held amount and currency.
// - Preserve hold reference.
// - Preserve expiry.
// - Preserve hold lifecycle state.
// - Preserve transaction references.
// - Preserve lifecycle timestamps.
// - Support aggregate queries.
// - Support entity queries.
// - Support lifecycle queries.
// - Support ownership queries.
// - Support business-reference queries.
// - Support expiry queries.
// - Support transaction-reference queries.
// - Support existence queries.
// - Enforce persistence-level relational consistency.
//
// This repository does NOT:
//
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Execute Financial Transactions.
// - Move money.
// - Communicate with payment providers.
// - Coordinate other Financial Account Holds.
// - Execute release workflows.
// - Execute capture workflows.
// - Execute cancellation workflows.
// - Emit domain events.
// - Perform accounting.
// - Perform settlement.
//
// Domain behavior belongs to:
//
// - FinancialAccountHoldEntity
// - FinancialAccountHoldAggregate
//
// Mapping belongs to:
//
// - FinancialAccountHoldPrismaMapper
//
// Persistence belongs to:
//
// - PrismaFinancialAccountHoldRepository
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, PrismaClient } from '@prisma/client';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldRepository } from '../../../../domain/repositories/financial-account-hold.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldAggregate } from '../../../../domain/aggregates/financial-account-hold.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldEntity } from '../../../../domain/entities/financial-account-hold.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import {
  FinancialAccountHoldPrismaMapper,
  type FinancialAccountHoldWithAccount,
} from '../mappers/financial-account-hold-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

import type { FinancialAccountPublicId } from '../../../../domain/value-objects/financial-account-public-id.vo';

import type { FinancialAccountHoldPublicId } from '../../../../domain/value-objects/financial-account-hold-public-id.vo';

import type { FinancialAccountHoldStatus } from '../../../../domain/value-objects/financial-account-hold-status.vo';

import type { FinancialHoldReference } from '../../../../domain/value-objects/financial-hold-reference.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialAccountHoldException } from '../../../../domain/exceptions/financial-account-hold.exception';

// =============================================================================
// Repository
// =============================================================================

export class PrismaFinancialAccountHoldRepository implements FinancialAccountHoldRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaClient) {}

  // ===========================================================================
  // Create
  // ===========================================================================

  /**
   * Persists a brand-new Financial Account Hold aggregate.
   *
   * The owning Financial Account is resolved from its public identity.
   *
   * The Financial Account Hold aggregate contains one root entity, therefore
   * creation consists of one FinancialAccountHold persistence record.
   *
   * The repository does not create or execute the transaction establishing
   * the financial reservation.
   */
  public async create(aggregate: FinancialAccountHoldAggregate): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Resolve Owning Financial Account
      // -----------------------------------------------------------------------

      const accountId = await this.resolveAccountId(
        tx,
        aggregate.accountPublicId,
      );

      // -----------------------------------------------------------------------
      // Map Aggregate
      // -----------------------------------------------------------------------

      const persistence =
        FinancialAccountHoldPrismaMapper.aggregateToPersistence(aggregate);

      // -----------------------------------------------------------------------
      // Validate Account Consistency
      // -----------------------------------------------------------------------

      if (persistence.hold.accountId !== accountId) {
        throw new FinancialAccountHoldException(
          `Financial Account Hold "${aggregate.publicId.value}" contains an inconsistent Financial Account reference.`,
        );
      }

      // -----------------------------------------------------------------------
      // Create Hold
      // -----------------------------------------------------------------------

      await tx.financialAccountHold.create({
        data: {
          id: persistence.hold.id,

          publicId: persistence.hold.publicId,

          accountId,

          amount: persistence.hold.amount,

          currency: persistence.hold.currency,

          status: persistence.hold.status,

          referenceType: persistence.hold.referenceType,

          referencePublicId: persistence.hold.referencePublicId,

          expiresAt: persistence.hold.expiresAt,

          holdTransactionPublicId: persistence.hold.holdTransactionPublicId,

          releaseTransactionPublicId:
            persistence.hold.releaseTransactionPublicId,

          captureTransactionPublicId:
            persistence.hold.captureTransactionPublicId,

          releasedAt: persistence.hold.releasedAt,

          capturedAt: persistence.hold.capturedAt,

          cancelledAt: persistence.hold.cancelledAt,

          createdAt: persistence.hold.createdAt,

          updatedAt: persistence.hold.updatedAt,
        },
      });
    });
  }

  // ===========================================================================
  // Save
  // ===========================================================================

  /**
   * Persists the current state of an existing Financial Account Hold
   * aggregate.
   *
   * Internal identity, public identity, and owning Financial Account identity
   * are immutable.
   *
   * A Financial Account Hold cannot be moved between Financial Accounts.
   */
  public async save(aggregate: FinancialAccountHoldAggregate): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Load Existing Record
      // -----------------------------------------------------------------------

      const existing = await tx.financialAccountHold.findUnique({
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
        throw new FinancialAccountHoldException(
          `Financial Account Hold "${aggregate.publicId.value}" does not exist and cannot be updated.`,
        );
      }

      // -----------------------------------------------------------------------
      // Public Identity Stability
      // -----------------------------------------------------------------------

      if (existing.publicId !== aggregate.publicId.value) {
        throw new FinancialAccountHoldException(
          `Financial Account Hold internal identity "${aggregate.id.toString()}" is associated with a different public identity.`,
        );
      }

      // -----------------------------------------------------------------------
      // Resolve Account
      // -----------------------------------------------------------------------

      const accountId = await this.resolveAccountId(
        tx,
        aggregate.accountPublicId,
      );

      // -----------------------------------------------------------------------
      // Account Ownership Stability
      // -----------------------------------------------------------------------

      if (existing.accountId !== accountId) {
        throw new FinancialAccountHoldException(
          `Financial Account Hold "${aggregate.publicId.value}" cannot be moved to another Financial Account.`,
        );
      }

      // -----------------------------------------------------------------------
      // Map Aggregate
      // -----------------------------------------------------------------------

      const persistence =
        FinancialAccountHoldPrismaMapper.aggregateToPersistence(aggregate);

      // -----------------------------------------------------------------------
      // Update
      // -----------------------------------------------------------------------

      await tx.financialAccountHold.update({
        where: {
          id: aggregate.id.toString(),
        },

        data: {
          amount: persistence.hold.amount,

          currency: persistence.hold.currency,

          status: persistence.hold.status,

          referenceType: persistence.hold.referenceType,

          referencePublicId: persistence.hold.referencePublicId,

          expiresAt: persistence.hold.expiresAt,

          holdTransactionPublicId: persistence.hold.holdTransactionPublicId,

          releaseTransactionPublicId:
            persistence.hold.releaseTransactionPublicId,

          captureTransactionPublicId:
            persistence.hold.captureTransactionPublicId,

          releasedAt: persistence.hold.releasedAt,

          capturedAt: persistence.hold.capturedAt,

          cancelledAt: persistence.hold.cancelledAt,

          updatedAt: persistence.hold.updatedAt,
        },
      });
    });
  }

  // ===========================================================================
  // Delete
  // ===========================================================================

  /**
   * Physical deletion of Financial Account Holds is intentionally unsupported.
   *
   * Financial Account Holds represent financial reservation history and must
   * remain auditable.
   *
   * Lifecycle resolution is represented through:
   *
   * ACTIVE
   *   -> RELEASED
   *   -> CAPTURED
   *   -> CANCELLED
   */
  public delete(aggregate: FinancialAccountHoldAggregate): Promise<void> {
    return Promise.reject(
      new FinancialAccountHoldException(
        `Financial Account Hold "${aggregate.publicId.value}" cannot be physically deleted.`,
      ),
    );
  }

  // ===========================================================================
  // Find By Public ID
  // ===========================================================================

  public async findByPublicId(
    publicId: FinancialAccountHoldPublicId,
  ): Promise<FinancialAccountHoldAggregate | null> {
    const record = await this.prisma.financialAccountHold.findUnique({
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

    return FinancialAccountHoldPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Account Public ID
  // ===========================================================================

  public async findByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountHoldAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        accountId,
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Active By Account Public ID
  // ===========================================================================

  public async findActiveByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountHoldAggregate[]> {
    return this.findByAccountPublicIdAndStatus(
      accountPublicId,
      this.activeStatus(),
    );
  }

  // ===========================================================================
  // Find Terminal By Account Public ID
  // ===========================================================================

  public async findTerminalByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountHoldAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        accountId,

        status: {
          in: ['RELEASED', 'CAPTURED', 'CANCELLED'],
        },
      },

      include: {
        account: true,
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find By Account + Status
  // ===========================================================================

  public async findByAccountPublicIdAndStatus(
    accountPublicId: FinancialAccountPublicId,
    status: FinancialAccountHoldStatus,
  ): Promise<FinancialAccountHoldAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        accountId,

        status: status.value,
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find By Status
  // ===========================================================================

  public async findByStatus(
    status: FinancialAccountHoldStatus,
  ): Promise<FinancialAccountHoldAggregate[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        status: status.value,
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find By Reference
  // ===========================================================================

  public async findByReference(
    reference: FinancialHoldReference,
  ): Promise<FinancialAccountHoldAggregate[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        referenceType: reference.type,

        referencePublicId: reference.publicId,
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find By Reference Type + Public ID
  // ===========================================================================

  public async findByReferenceTypeAndPublicId(
    type: string,
    publicId: string,
  ): Promise<FinancialAccountHoldAggregate[]> {
    const normalizedType = type.trim();
    const normalizedPublicId = publicId.trim();

    if (!normalizedType) {
      throw new FinancialAccountHoldException(
        'Financial Hold reference type must not be empty.',
      );
    }

    if (!normalizedPublicId) {
      throw new FinancialAccountHoldException(
        'Financial Hold reference public ID must not be empty.',
      );
    }

    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        referenceType: normalizedType,

        referencePublicId: normalizedPublicId,
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Active By Reference
  // ===========================================================================

  public async findActiveByReference(
    reference: FinancialHoldReference,
  ): Promise<FinancialAccountHoldAggregate[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        referenceType: reference.type,

        referencePublicId: reference.publicId,

        status: 'ACTIVE',
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Active By Reference Type + Public ID
  // ===========================================================================

  public async findActiveByReferenceTypeAndPublicId(
    type: string,
    publicId: string,
  ): Promise<FinancialAccountHoldAggregate[]> {
    const normalizedType = type.trim();
    const normalizedPublicId = publicId.trim();

    if (!normalizedType) {
      throw new FinancialAccountHoldException(
        'Financial Hold reference type must not be empty.',
      );
    }

    if (!normalizedPublicId) {
      throw new FinancialAccountHoldException(
        'Financial Hold reference public ID must not be empty.',
      );
    }

    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        referenceType: normalizedType,

        referencePublicId: normalizedPublicId,

        status: 'ACTIVE',
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Active With Expiry
  // ===========================================================================

  public async findActiveWithExpiry(): Promise<
    FinancialAccountHoldAggregate[]
  > {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        status: 'ACTIVE',

        expiresAt: {
          not: null,
        },
      },

      include: {
        account: true,
      },

      orderBy: {
        expiresAt: 'asc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Expired Active
  // ===========================================================================

  public async findExpiredActive(
    at: Date,
  ): Promise<FinancialAccountHoldAggregate[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        status: 'ACTIVE',

        expiresAt: {
          not: null,

          lte: at,
        },
      },

      include: {
        account: true,
      },

      orderBy: {
        expiresAt: 'asc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Currently Active
  // ===========================================================================

  public async findCurrentlyActive(
    at: Date = new Date(),
  ): Promise<FinancialAccountHoldAggregate[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        status: 'ACTIVE',

        OR: [
          {
            expiresAt: null,
          },

          {
            expiresAt: {
              gt: at,
            },
          },
        ],
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find By Hold Transaction Public ID
  // ===========================================================================

  public async findByHoldTransactionPublicId(
    transactionPublicId: string,
  ): Promise<FinancialAccountHoldAggregate | null> {
    const normalized = this.normalizeTransactionPublicId(
      transactionPublicId,
      'Hold',
    );

    const record = await this.prisma.financialAccountHold.findFirst({
      where: {
        holdTransactionPublicId: normalized,
      },

      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialAccountHoldPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Release Transaction Public ID
  // ===========================================================================

  public async findByReleaseTransactionPublicId(
    transactionPublicId: string,
  ): Promise<FinancialAccountHoldAggregate | null> {
    const normalized = this.normalizeTransactionPublicId(
      transactionPublicId,
      'Release',
    );

    const record = await this.prisma.financialAccountHold.findFirst({
      where: {
        releaseTransactionPublicId: normalized,
      },

      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialAccountHoldPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Capture Transaction Public ID
  // ===========================================================================

  public async findByCaptureTransactionPublicId(
    transactionPublicId: string,
  ): Promise<FinancialAccountHoldAggregate | null> {
    const normalized = this.normalizeTransactionPublicId(
      transactionPublicId,
      'Capture',
    );

    const record = await this.prisma.financialAccountHold.findFirst({
      where: {
        captureTransactionPublicId: normalized,
      },

      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialAccountHoldPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Account + Hold Transaction
  // ===========================================================================

  public async findByAccountPublicIdAndHoldTransactionPublicId(
    accountPublicId: FinancialAccountPublicId,
    transactionPublicId: string,
  ): Promise<FinancialAccountHoldAggregate | null> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const normalized = this.normalizeTransactionPublicId(
      transactionPublicId,
      'Hold',
    );

    const record = await this.prisma.financialAccountHold.findFirst({
      where: {
        accountId,

        holdTransactionPublicId: normalized,
      },

      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialAccountHoldPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Account + Release Transaction
  // ===========================================================================

  public async findByAccountPublicIdAndReleaseTransactionPublicId(
    accountPublicId: FinancialAccountPublicId,
    transactionPublicId: string,
  ): Promise<FinancialAccountHoldAggregate | null> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const normalized = this.normalizeTransactionPublicId(
      transactionPublicId,
      'Release',
    );

    const record = await this.prisma.financialAccountHold.findFirst({
      where: {
        accountId,

        releaseTransactionPublicId: normalized,
      },

      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialAccountHoldPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find By Account + Capture Transaction
  // ===========================================================================

  public async findByAccountPublicIdAndCaptureTransactionPublicId(
    accountPublicId: FinancialAccountPublicId,
    transactionPublicId: string,
  ): Promise<FinancialAccountHoldAggregate | null> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const normalized = this.normalizeTransactionPublicId(
      transactionPublicId,
      'Capture',
    );

    const record = await this.prisma.financialAccountHold.findFirst({
      where: {
        accountId,

        captureTransactionPublicId: normalized,
      },

      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialAccountHoldPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Find Entity By Public ID
  // ===========================================================================

  public async findEntityByPublicId(
    publicId: FinancialAccountHoldPublicId,
  ): Promise<FinancialAccountHoldEntity | null> {
    const record = await this.prisma.financialAccountHold.findUnique({
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

    return FinancialAccountHoldPrismaMapper.toEntity(record);
  }

  // ===========================================================================
  // Find Entity By Internal ID
  // ===========================================================================

  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<FinancialAccountHoldEntity | null> {
    const record = await this.prisma.financialAccountHold.findUnique({
      where: {
        id: id.toString(),
      },

      include: {
        account: true,
      },
    });

    if (record === null) {
      return null;
    }

    return FinancialAccountHoldPrismaMapper.toEntity(record);
  }

  // ===========================================================================
  // Find Entities By Account Internal ID
  // ===========================================================================

  public async findEntityByAccountId(
    accountId: UniqueEntityId,
  ): Promise<FinancialAccountHoldEntity[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        accountId: accountId.toString(),
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toEntity(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Entities By Status
  // ===========================================================================

  public async findEntitiesByStatus(
    status: FinancialAccountHoldStatus,
  ): Promise<FinancialAccountHoldEntity[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        status: status.value,
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toEntity(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Entities By Account + Status
  // ===========================================================================

  public async findEntitiesByAccountIdAndStatus(
    accountId: UniqueEntityId,
    status: FinancialAccountHoldStatus,
  ): Promise<FinancialAccountHoldEntity[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        accountId: accountId.toString(),

        status: status.value,
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toEntity(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Active
  // ===========================================================================

  public async findActive(): Promise<FinancialAccountHoldAggregate[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        status: 'ACTIVE',
      },

      include: {
        account: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Released
  // ===========================================================================

  public async findReleased(): Promise<FinancialAccountHoldAggregate[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        status: 'RELEASED',
      },

      include: {
        account: true,
      },

      orderBy: {
        releasedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Captured
  // ===========================================================================

  public async findCaptured(): Promise<FinancialAccountHoldAggregate[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        status: 'CAPTURED',
      },

      include: {
        account: true,
      },

      orderBy: {
        capturedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Cancelled
  // ===========================================================================

  public async findCancelled(): Promise<FinancialAccountHoldAggregate[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        status: 'CANCELLED',
      },

      include: {
        account: true,
      },

      orderBy: {
        cancelledAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Find Terminal
  // ===========================================================================

  public async findTerminal(): Promise<FinancialAccountHoldAggregate[]> {
    const records = await this.prisma.financialAccountHold.findMany({
      where: {
        status: {
          in: ['RELEASED', 'CAPTURED', 'CANCELLED'],
        },
      },

      include: {
        account: true,
      },

      orderBy: {
        updatedAt: 'desc',
      },
    });

    return records.map((record) =>
      FinancialAccountHoldPrismaMapper.toDomain(
        record as FinancialAccountHoldWithAccount,
      ),
    );
  }

  // ===========================================================================
  // Exists By Public ID
  // ===========================================================================

  public async existsByPublicId(
    publicId: FinancialAccountHoldPublicId,
  ): Promise<boolean> {
    const record = await this.prisma.financialAccountHold.findUnique({
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
  // Exists By Internal ID
  // ===========================================================================

  public async existsById(id: UniqueEntityId): Promise<boolean> {
    const record = await this.prisma.financialAccountHold.findUnique({
      where: {
        id: id.toString(),
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

    const record = await this.prisma.financialAccountHold.findFirst({
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
  // Exists Active By Account Public ID
  // ===========================================================================

  public async existsActiveByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<boolean> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const record = await this.prisma.financialAccountHold.findFirst({
      where: {
        accountId,

        status: 'ACTIVE',
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists By Hold Transaction Public ID
  // ===========================================================================

  public async existsByHoldTransactionPublicId(
    transactionPublicId: string,
  ): Promise<boolean> {
    const normalized = this.normalizeTransactionPublicId(
      transactionPublicId,
      'Hold',
    );

    const record = await this.prisma.financialAccountHold.findFirst({
      where: {
        holdTransactionPublicId: normalized,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists By Release Transaction Public ID
  // ===========================================================================

  public async existsByReleaseTransactionPublicId(
    transactionPublicId: string,
  ): Promise<boolean> {
    const normalized = this.normalizeTransactionPublicId(
      transactionPublicId,
      'Release',
    );

    const record = await this.prisma.financialAccountHold.findFirst({
      where: {
        releaseTransactionPublicId: normalized,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists By Capture Transaction Public ID
  // ===========================================================================

  public async existsByCaptureTransactionPublicId(
    transactionPublicId: string,
  ): Promise<boolean> {
    const normalized = this.normalizeTransactionPublicId(
      transactionPublicId,
      'Capture',
    );

    const record = await this.prisma.financialAccountHold.findFirst({
      where: {
        captureTransactionPublicId: normalized,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists Active By Reference
  // ===========================================================================

  public async existsActiveByReference(
    reference: FinancialHoldReference,
  ): Promise<boolean> {
    const record = await this.prisma.financialAccountHold.findFirst({
      where: {
        referenceType: reference.type,

        referencePublicId: reference.publicId,

        status: 'ACTIVE',
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists Active By Reference Type + Public ID
  // ===========================================================================

  public async existsActiveByReferenceTypeAndPublicId(
    type: string,
    publicId: string,
  ): Promise<boolean> {
    const normalizedType = type.trim();
    const normalizedPublicId = publicId.trim();

    if (!normalizedType) {
      throw new FinancialAccountHoldException(
        'Financial Hold reference type must not be empty.',
      );
    }

    if (!normalizedPublicId) {
      throw new FinancialAccountHoldException(
        'Financial Hold reference public ID must not be empty.',
      );
    }

    const record = await this.prisma.financialAccountHold.findFirst({
      where: {
        referenceType: normalizedType,

        referencePublicId: normalizedPublicId,

        status: 'ACTIVE',
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
   *          ↓
   * FinancialAccount.id
   *
   * The internal database identity remains an infrastructure concern.
   */
  private async resolveAccountId(
    prisma: PrismaClient | Prisma.TransactionClient,
    accountPublicId: FinancialAccountPublicId,
  ): Promise<string> {
    const normalized = accountPublicId.value.trim();

    if (!normalized) {
      throw new FinancialAccountHoldException(
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
      throw new FinancialAccountHoldException(
        `Financial Account "${normalized}" does not exist.`,
      );
    }

    return account.id;
  }

  // ===========================================================================
  // Internal Helpers
  // ===========================================================================

  /**
   * Creates the domain ACTIVE status value used by repository queries.
   *
   * Keeping this in one place prevents infrastructure code from constructing
   * domain status values incorrectly.
   */
  private activeStatus(): FinancialAccountHoldStatus {
    return {
      value: 'ACTIVE',
    } as FinancialAccountHoldStatus;
  }

  /**
   * Normalizes and validates transaction public identifiers.
   */
  private normalizeTransactionPublicId(
    transactionPublicId: string,
    transactionType: string,
  ): string {
    const normalized = transactionPublicId.trim();

    if (!normalized) {
      throw new FinancialAccountHoldException(
        `${transactionType} transaction public ID must not be empty.`,
      );
    }

    return normalized;
  }
}
