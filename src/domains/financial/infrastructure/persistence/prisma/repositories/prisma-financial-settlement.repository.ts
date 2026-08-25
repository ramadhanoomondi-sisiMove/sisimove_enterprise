// -----------------------------------------------------------------------------
// Financial Settlement Prisma Repository
// -----------------------------------------------------------------------------
//
// Persistence implementation for the Financial Settlement aggregate.
//
// Aggregate:
//
// FinancialSettlementAggregate
// └── FinancialSettlementEntity
//     └── FinancialSettlementItemEntity[]
//         └── FinancialSettlementAllocationEntity[]
//
// Responsibilities:
//
// - Persist complete Financial Settlement aggregates.
// - Rehydrate complete Financial Settlement aggregates.
// - Preserve aggregate identity.
// - Preserve settlement lifecycle.
// - Preserve settlement currency.
// - Preserve settlement items.
// - Preserve settlement allocations.
// - Preserve Financial Account internal identities.
// - Preserve Financial Transaction references.
// - Support settlement lifecycle queries.
// - Support settlement processing queries.
// - Support business-reference queries.
// - Support account traceability queries.
// - Support transaction traceability queries.
// - Support allocation/completion queries.
// - Support operational reconciliation queries.
// - Support existence checks.
//
// This repository does NOT:
//
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Execute Financial Transactions.
// - Move money.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external providers.
// - Perform settlement orchestration.
// - Emit domain events.
//
// Domain behavior belongs to:
//
// - FinancialSettlementAggregate
// - FinancialSettlementEntity
// - FinancialSettlementItemEntity
// - FinancialSettlementAllocationEntity
//
// Mapping belongs to:
//
// - FinancialSettlementPrismaMapper
//
// Persistence belongs to:
//
// - PrismaFinancialSettlementRepository
//
// Important persistence rules:
//
// - Settlement allocations are persisted as child Allocation records.
// - The Settlement root does not persist an allocatedAmount column.
// - Allocated totals are derived from Settlement Allocations.
// - FinancialSettlementAllocationEntity stores the internal Financial Account
//   identity, therefore accountId is persisted directly.
// - Financial Account public-ID resolution does NOT belong to save().
// - The complete Settlement aggregate is persisted atomically.
// - Child allocations are deleted before child items.
// - Child items are recreated from the mapper's persistence structures.
// - Child allocations are recreated after their owning items exist.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { Prisma, PrismaClient } from '@prisma/client';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { FinancialSettlementRepository } from '../../../../domain/repositories/financial-settlement.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialSettlementAggregate } from '../../../../domain/aggregates/financial-settlement.aggregate';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { FinancialSettlementPrismaMapper } from '../mappers/financial-settlement-prisma.mapper';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialSettlementPublicId } from '../../../../domain/value-objects/financial-settlement-public-id.vo';

import type { FinancialSettlementStatus } from '../../../../domain/value-objects/financial-settlement-status.vo';

import type { FinancialSettlementItemPublicId } from '../../../../domain/value-objects/financial-settlement-item-public-id.vo';

import type { Currency } from '../../../../domain/value-objects/currency.vo';

import type { FinancialReferenceType } from '../../../../domain/value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../../../../domain/value-objects/financial-reference-public-id.vo';

import type { FinancialTransactionPublicId } from '../../../../domain/value-objects/financial-transaction-public-id.vo';

import type { FinancialAccountPublicId } from '../../../../domain/value-objects/financial-account-public-id.vo';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialSettlementException } from '../../../../domain/exceptions/financial-settlement.exception';

// =============================================================================
// Prisma Payload Types
// =============================================================================

/**
 * Complete Financial Settlement persistence graph.
 *
 * IMPORTANT:
 *
 * Do not replace this with:
 *
 * Prisma.FinancialSettlementInclude
 *
 * because that broad type loses the concrete nested payload information that
 * FinancialSettlementPrismaMapper.toDomain() requires.
 */
type FinancialSettlementWithItems = Prisma.FinancialSettlementGetPayload<{
  include: {
    items: {
      include: {
        allocations: true;
      };
    };
  };
}>;

// =============================================================================
// Repository
// =============================================================================

export class PrismaFinancialSettlementRepository implements FinancialSettlementRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(private readonly prisma: PrismaClient) {}

  // ===========================================================================
  // Save
  // ===========================================================================

  /**
   * Persists the complete Financial Settlement aggregate atomically.
   *
   * Existing child items and allocations are replaced by the aggregate's
   * current state.
   *
   * Persistence flow:
   *
   * 1. Validate aggregate identity.
   * 2. Load the existing Settlement root.
   * 3. Verify internal identity.
   * 4. Verify public identity.
   * 5. Verify currency immutability.
   * 6. Convert aggregate into persistence structures.
   * 7. Verify persistence identity.
   * 8. Update Settlement root.
   * 9. Delete existing allocations.
   * 10. Delete existing items.
   * 11. Recreate items.
   * 12. Recreate allocations.
   *
   * No financial behavior is executed here.
   */
  public async save(aggregate: FinancialSettlementAggregate): Promise<void> {
    const settlementId = this.normalize(
      aggregate.id.toString(),
      'Financial Settlement internal ID',
    );

    const settlementPublicId = this.normalize(
      aggregate.publicId.value,
      'Financial Settlement public ID',
    );

    await this.prisma.$transaction(async (tx) => {
      // -----------------------------------------------------------------------
      // Load Existing Settlement
      // -----------------------------------------------------------------------

      const existing = await tx.financialSettlement.findUnique({
        where: {
          id: settlementId,
        },

        select: {
          id: true,
          publicId: true,
          currency: true,
        },
      });

      // -----------------------------------------------------------------------
      // Existence
      // -----------------------------------------------------------------------

      if (existing === null) {
        throw new FinancialSettlementException(
          `Financial Settlement "${settlementPublicId}" does not exist and cannot be updated.`,
        );
      }

      // -----------------------------------------------------------------------
      // Internal Identity Stability
      // -----------------------------------------------------------------------

      if (existing.id !== settlementId) {
        throw new FinancialSettlementException(
          `Financial Settlement internal identity "${settlementId}" is inconsistent.`,
        );
      }

      // -----------------------------------------------------------------------
      // Public Identity Stability
      // -----------------------------------------------------------------------

      if (existing.publicId !== settlementPublicId) {
        throw new FinancialSettlementException(
          `Financial Settlement internal identity "${settlementId}" is associated with a different public identity.`,
        );
      }

      // -----------------------------------------------------------------------
      // Currency Stability
      // -----------------------------------------------------------------------

      if (existing.currency !== aggregate.currency.value) {
        throw new FinancialSettlementException(
          `Financial Settlement "${settlementPublicId}" cannot change currency from "${existing.currency}" to "${aggregate.currency.value}".`,
        );
      }

      // -----------------------------------------------------------------------
      // Aggregate → Persistence
      // -----------------------------------------------------------------------

      const persistence =
        FinancialSettlementPrismaMapper.toPersistence(aggregate);

      // -----------------------------------------------------------------------
      // Root Identity Consistency
      // -----------------------------------------------------------------------

      if (persistence.settlement.id !== settlementId) {
        throw new FinancialSettlementException(
          'Financial Settlement persistence identity does not match the aggregate identity.',
        );
      }

      if (persistence.settlement.publicId !== settlementPublicId) {
        throw new FinancialSettlementException(
          'Financial Settlement persistence public identity does not match the aggregate public identity.',
        );
      }

      // -----------------------------------------------------------------------
      // Currency Consistency
      // -----------------------------------------------------------------------

      if (persistence.settlement.currency !== existing.currency) {
        throw new FinancialSettlementException(
          `Financial Settlement "${settlementPublicId}" persistence currency cannot change from "${existing.currency}" to "${persistence.settlement.currency}".`,
        );
      }

      // -----------------------------------------------------------------------
      // Update Settlement Root
      // -----------------------------------------------------------------------

      await tx.financialSettlement.update({
        where: {
          id: settlementId,
        },

        data: {
          status: persistence.settlement.status,

          currency: persistence.settlement.currency,

          totalAmount: persistence.settlement.totalAmount,

          startedAt: persistence.settlement.startedAt,

          completedAt: persistence.settlement.completedAt,

          failedAt: persistence.settlement.failedAt,

          cancelledAt: persistence.settlement.cancelledAt,

          updatedAt: persistence.settlement.updatedAt,
        },
      });

      // -----------------------------------------------------------------------
      // Delete Existing Allocations
      // -----------------------------------------------------------------------
      //
      // FinancialSettlement
      // └── FinancialSettlementItem
      //     └── FinancialSettlementAllocation
      //
      // Allocation children must be deleted before their owning items.
      //

      await tx.financialSettlementAllocation.deleteMany({
        where: {
          settlementItem: {
            settlementId,
          },
        },
      });

      // -----------------------------------------------------------------------
      // Delete Existing Items
      // -----------------------------------------------------------------------

      await tx.financialSettlementItem.deleteMany({
        where: {
          settlementId,
        },
      });

      // -----------------------------------------------------------------------
      // Recreate Settlement Items
      // -----------------------------------------------------------------------

      if (persistence.items.length > 0) {
        await tx.financialSettlementItem.createMany({
          data: persistence.items.map((item) => ({
            id: item.id,

            publicId: item.publicId,

            settlementId: item.settlementId,

            referenceType: item.referenceType,

            referencePublicId: item.referencePublicId,

            amount: item.amount,

            currency: item.currency,

            status: item.status,

            createdAt: item.createdAt,

            updatedAt: item.updatedAt,
          })),
        });
      }

      // -----------------------------------------------------------------------
      // Recreate Settlement Allocations
      // -----------------------------------------------------------------------
      //
      // accountId is already the Financial Account's internal persistence ID.
      //
      // No FinancialAccount lookup is performed here.
      //

      if (persistence.allocations.length > 0) {
        await tx.financialSettlementAllocation.createMany({
          data: persistence.allocations.map((allocation) => ({
            id: allocation.id,

            publicId: allocation.publicId,

            settlementItemId: allocation.settlementItemId,

            accountId: allocation.accountId,

            type: allocation.type,

            amount: allocation.amount,

            currency: allocation.currency,

            transactionPublicId: allocation.transactionPublicId,

            createdAt: allocation.createdAt,

            updatedAt: allocation.updatedAt,
          })),
        });
      }
    });
  }

  // ===========================================================================
  // Find By Public ID
  // ===========================================================================

  public async findByPublicId(
    publicId: FinancialSettlementPublicId,
  ): Promise<FinancialSettlementAggregate | null> {
    const normalized = this.normalize(
      publicId.value,
      'Financial Settlement public ID',
    );

    const record = await this.prisma.financialSettlement.findUnique({
      where: {
        publicId: normalized,
      },

      include: this.aggregateInclude(),
    });

    if (record === null) {
      return null;
    }

    return this.toDomain(record);
  }

  // ===========================================================================
  // Find By Internal ID
  // ===========================================================================

  public async findById(
    id: UniqueEntityId,
  ): Promise<FinancialSettlementAggregate | null> {
    const normalized = this.normalize(
      id.toString(),
      'Financial Settlement internal ID',
    );

    const record = await this.prisma.financialSettlement.findUnique({
      where: {
        id: normalized,
      },

      include: this.aggregateInclude(),
    });

    if (record === null) {
      return null;
    }

    return this.toDomain(record);
  }

  // ===========================================================================
  // Find By Status
  // ===========================================================================

  public async findByStatus(
    status: FinancialSettlementStatus,
  ): Promise<FinancialSettlementAggregate[]> {
    return this.findMany({
      status: status.value,
    });
  }

  // ===========================================================================
  // Find By Currency
  // ===========================================================================

  public async findByCurrency(
    currency: Currency,
  ): Promise<FinancialSettlementAggregate[]> {
    const normalized = this.normalize(
      currency.value,
      'Financial Settlement currency',
    );

    return this.findMany({
      currency: normalized,
    });
  }

  // ===========================================================================
  // Find Pending
  // ===========================================================================

  public async findPending(): Promise<FinancialSettlementAggregate[]> {
    return this.findMany({
      status: 'PENDING',
    });
  }

  // ===========================================================================
  // Find Processing
  // ===========================================================================

  public async findProcessing(): Promise<FinancialSettlementAggregate[]> {
    return this.findMany({
      status: 'PROCESSING',
    });
  }

  // ===========================================================================
  // Find Completed
  // ===========================================================================

  public async findCompleted(): Promise<FinancialSettlementAggregate[]> {
    return this.findMany({
      status: 'COMPLETED',
    });
  }

  // ===========================================================================
  // Find Failed
  // ===========================================================================

  public async findFailed(): Promise<FinancialSettlementAggregate[]> {
    return this.findMany({
      status: 'FAILED',
    });
  }

  // ===========================================================================
  // Find Cancelled
  // ===========================================================================

  public async findCancelled(): Promise<FinancialSettlementAggregate[]> {
    return this.findMany({
      status: 'CANCELLED',
    });
  }

  // ===========================================================================
  // Find Terminal
  // ===========================================================================

  public async findTerminal(): Promise<FinancialSettlementAggregate[]> {
    return this.findMany({
      status: {
        in: ['COMPLETED', 'FAILED', 'CANCELLED'],
      },
    });
  }

  // ===========================================================================
  // Find Non-Terminal
  // ===========================================================================

  public async findNonTerminal(): Promise<FinancialSettlementAggregate[]> {
    return this.findMany({
      status: {
        in: ['PENDING', 'PROCESSING'],
      },
    });
  }

  // ===========================================================================
  // Find Ready For Processing
  // ===========================================================================

  public async findReadyForProcessing(): Promise<
    FinancialSettlementAggregate[]
  > {
    return this.findMany({
      status: 'PENDING',
    });
  }

  // ===========================================================================
  // Find In Progress
  // ===========================================================================

  public async findInProgress(): Promise<FinancialSettlementAggregate[]> {
    return this.findProcessing();
  }

  // ===========================================================================
  // Find Processing With Unsettled Items
  // ===========================================================================

  public async findProcessingWithUnsettledItems(): Promise<
    FinancialSettlementAggregate[]
  > {
    return this.findMany({
      status: 'PROCESSING',

      items: {
        some: {
          status: {
            not: 'SETTLED',
          },
        },
      },
    });
  }

  // ===========================================================================
  // Find Processing With Allocated Items
  // ===========================================================================

  public async findProcessingWithAllocatedItems(): Promise<
    FinancialSettlementAggregate[]
  > {
    return this.findMany({
      status: 'PROCESSING',

      items: {
        some: {
          status: 'ALLOCATED',
        },
      },
    });
  }

  // ===========================================================================
  // Find Ready For Completion
  // ===========================================================================

  public async findReadyForCompletion(): Promise<
    FinancialSettlementAggregate[]
  > {
    return this.findMany({
      status: 'PROCESSING',

      items: {
        some: {},

        every: {
          status: 'SETTLED',
        },
      },
    });
  }

  // ===========================================================================
  // Find By Reference
  // ===========================================================================

  public async findByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<FinancialSettlementAggregate[]> {
    const normalizedType = this.normalize(
      referenceType.value,
      'Financial Settlement reference type',
    );

    const normalizedPublicId = this.normalize(
      referencePublicId.value,
      'Financial Settlement reference public ID',
    );

    return this.findMany({
      items: {
        some: {
          referenceType: normalizedType,
          referencePublicId: normalizedPublicId,
        },
      },
    });
  }

  // ===========================================================================
  // Find Active By Reference
  // ===========================================================================

  public async findActiveByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<FinancialSettlementAggregate[]> {
    const normalizedType = this.normalize(
      referenceType.value,
      'Financial Settlement reference type',
    );

    const normalizedPublicId = this.normalize(
      referencePublicId.value,
      'Financial Settlement reference public ID',
    );

    return this.findMany({
      status: {
        in: ['PENDING', 'PROCESSING'],
      },

      items: {
        some: {
          referenceType: normalizedType,
          referencePublicId: normalizedPublicId,
        },
      },
    });
  }

  // ===========================================================================
  // Find Terminal By Reference
  // ===========================================================================

  public async findTerminalByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<FinancialSettlementAggregate[]> {
    const normalizedType = this.normalize(
      referenceType.value,
      'Financial Settlement reference type',
    );

    const normalizedPublicId = this.normalize(
      referencePublicId.value,
      'Financial Settlement reference public ID',
    );

    return this.findMany({
      status: {
        in: ['COMPLETED', 'FAILED', 'CANCELLED'],
      },

      items: {
        some: {
          referenceType: normalizedType,
          referencePublicId: normalizedPublicId,
        },
      },
    });
  }

  // ===========================================================================
  // Find By Item Public ID
  // ===========================================================================

  public async findByItemPublicId(
    itemPublicId: FinancialSettlementItemPublicId,
  ): Promise<FinancialSettlementAggregate | null> {
    const normalized = this.normalize(
      itemPublicId.value,
      'Financial Settlement Item public ID',
    );

    const record = await this.prisma.financialSettlement.findFirst({
      where: {
        items: {
          some: {
            publicId: normalized,
          },
        },
      },

      include: this.aggregateInclude(),
    });

    if (record === null) {
      return null;
    }

    return this.toDomain(record);
  }

  // ===========================================================================
  // Find By Account Public ID
  // ===========================================================================

  public async findByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialSettlementAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    return this.findMany({
      items: {
        some: {
          allocations: {
            some: {
              accountId,
            },
          },
        },
      },
    });
  }

  // ===========================================================================
  // Find Active By Account Public ID
  // ===========================================================================

  public async findActiveByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialSettlementAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    return this.findMany({
      status: {
        in: ['PENDING', 'PROCESSING'],
      },

      items: {
        some: {
          allocations: {
            some: {
              accountId,
            },
          },
        },
      },
    });
  }

  // ===========================================================================
  // Find By Account + Status
  // ===========================================================================

  public async findByAccountPublicIdAndStatus(
    accountPublicId: FinancialAccountPublicId,
    status: FinancialSettlementStatus,
  ): Promise<FinancialSettlementAggregate[]> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    return this.findMany({
      status: status.value,

      items: {
        some: {
          allocations: {
            some: {
              accountId,
            },
          },
        },
      },
    });
  }

  // ===========================================================================
  // Find By Transaction Public ID
  // ===========================================================================

  public async findByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<FinancialSettlementAggregate | null> {
    const normalized = this.normalize(
      transactionPublicId.value,
      'Financial Transaction public ID',
    );

    const record = await this.prisma.financialSettlement.findFirst({
      where: {
        items: {
          some: {
            allocations: {
              some: {
                transactionPublicId: normalized,
              },
            },
          },
        },
      },

      include: this.aggregateInclude(),
    });

    if (record === null) {
      return null;
    }

    return this.toDomain(record);
  }

  // ===========================================================================
  // Find All By Transaction Public ID
  // ===========================================================================

  public async findAllByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<FinancialSettlementAggregate[]> {
    const normalized = this.normalize(
      transactionPublicId.value,
      'Financial Transaction public ID',
    );

    return this.findMany({
      items: {
        some: {
          allocations: {
            some: {
              transactionPublicId: normalized,
            },
          },
        },
      },
    });
  }

  // ===========================================================================
  // Find Active By Transaction Public ID
  // ===========================================================================

  public async findActiveByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<FinancialSettlementAggregate[]> {
    const normalized = this.normalize(
      transactionPublicId.value,
      'Financial Transaction public ID',
    );

    return this.findMany({
      status: {
        in: ['PENDING', 'PROCESSING'],
      },

      items: {
        some: {
          allocations: {
            some: {
              transactionPublicId: normalized,
            },
          },
        },
      },
    });
  }

  // ===========================================================================
  // Find Processing With Remaining Amount
  // ===========================================================================

  /**
   * Remaining amount is derived from the aggregate.
   *
   * No allocatedAmount column exists in persistence.
   */
  public async findProcessingWithRemainingAmount(): Promise<
    FinancialSettlementAggregate[]
  > {
    const aggregates = await this.findMany({
      status: 'PROCESSING',
    });

    return aggregates.filter((aggregate) =>
      aggregate.remainingAmount.isPositive(),
    );
  }

  // ===========================================================================
  // Find Processing Fully Allocated
  // ===========================================================================

  /**
   * Fully allocated state is derived from the aggregate.
   */
  public async findProcessingFullyAllocated(): Promise<
    FinancialSettlementAggregate[]
  > {
    const aggregates = await this.findMany({
      status: 'PROCESSING',
    });

    return aggregates.filter((aggregate) =>
      aggregate.allocatedAmount.equals(aggregate.totalAmount),
    );
  }

  // ===========================================================================
  // Find Processing With Pending Items
  // ===========================================================================

  public async findProcessingWithPendingItems(): Promise<
    FinancialSettlementAggregate[]
  > {
    return this.findMany({
      status: 'PROCESSING',

      items: {
        some: {
          status: 'PENDING',
        },
      },
    });
  }

  // ===========================================================================
  // Find Processing With All Items Settled
  // ===========================================================================

  public async findProcessingWithAllItemsSettled(): Promise<
    FinancialSettlementAggregate[]
  > {
    return this.findMany({
      status: 'PROCESSING',

      items: {
        some: {},

        every: {
          status: 'SETTLED',
        },
      },
    });
  }

  // ===========================================================================
  // Find Created Between
  // ===========================================================================

  public async findCreatedBetween(
    from: Date,
    to: Date,
  ): Promise<FinancialSettlementAggregate[]> {
    this.validateDateRange(from, to);

    return this.findMany({
      createdAt: {
        gte: from,
        lt: to,
      },
    });
  }

  // ===========================================================================
  // Find Updated Between
  // ===========================================================================

  public async findUpdatedBetween(
    from: Date,
    to: Date,
  ): Promise<FinancialSettlementAggregate[]> {
    this.validateDateRange(from, to);

    return this.findMany({
      updatedAt: {
        gte: from,
        lt: to,
      },
    });
  }

  // ===========================================================================
  // Find Processing Started Before
  // ===========================================================================

  public async findProcessingStartedBefore(
    at: Date,
  ): Promise<FinancialSettlementAggregate[]> {
    this.validateDate(at, 'Financial Settlement processing date');

    return this.findMany({
      status: 'PROCESSING',

      startedAt: {
        not: null,
        lte: at,
      },
    });
  }

  // ===========================================================================
  // Find Terminal Before
  // ===========================================================================

  public async findTerminalBefore(
    at: Date,
  ): Promise<FinancialSettlementAggregate[]> {
    this.validateDate(at, 'Financial Settlement terminal date');

    return this.findMany({
      status: {
        in: ['COMPLETED', 'FAILED', 'CANCELLED'],
      },

      updatedAt: {
        lte: at,
      },
    });
  }

  // ===========================================================================
  // Exists By Public ID
  // ===========================================================================

  public async existsByPublicId(
    publicId: FinancialSettlementPublicId,
  ): Promise<boolean> {
    const normalized = this.normalize(
      publicId.value,
      'Financial Settlement public ID',
    );

    const record = await this.prisma.financialSettlement.findUnique({
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
  // Exists By ID
  // ===========================================================================

  public async existsById(id: UniqueEntityId): Promise<boolean> {
    const normalized = this.normalize(
      id.toString(),
      'Financial Settlement internal ID',
    );

    const record = await this.prisma.financialSettlement.findUnique({
      where: {
        id: normalized,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists By Status
  // ===========================================================================

  public async existsByStatus(
    status: FinancialSettlementStatus,
  ): Promise<boolean> {
    const record = await this.prisma.financialSettlement.findFirst({
      where: {
        status: status.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists By Item Public ID
  // ===========================================================================

  public async existsByItemPublicId(
    itemPublicId: FinancialSettlementItemPublicId,
  ): Promise<boolean> {
    const normalized = this.normalize(
      itemPublicId.value,
      'Financial Settlement Item public ID',
    );

    const record = await this.prisma.financialSettlementItem.findUnique({
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

  public async existsByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<boolean> {
    const normalizedType = this.normalize(
      referenceType.value,
      'Financial Settlement reference type',
    );

    const normalizedPublicId = this.normalize(
      referencePublicId.value,
      'Financial Settlement reference public ID',
    );

    const record = await this.prisma.financialSettlementItem.findFirst({
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
  // Exists Active By Reference
  // ===========================================================================

  public async existsActiveByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<boolean> {
    const normalizedType = this.normalize(
      referenceType.value,
      'Financial Settlement reference type',
    );

    const normalizedPublicId = this.normalize(
      referencePublicId.value,
      'Financial Settlement reference public ID',
    );

    const record = await this.prisma.financialSettlement.findFirst({
      where: {
        status: {
          in: ['PENDING', 'PROCESSING'],
        },

        items: {
          some: {
            referenceType: normalizedType,
            referencePublicId: normalizedPublicId,
          },
        },
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

    const record = await this.prisma.financialSettlement.findFirst({
      where: {
        items: {
          some: {
            allocations: {
              some: {
                accountId,
              },
            },
          },
        },
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

    const record = await this.prisma.financialSettlement.findFirst({
      where: {
        status: {
          in: ['PENDING', 'PROCESSING'],
        },

        items: {
          some: {
            allocations: {
              some: {
                accountId,
              },
            },
          },
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists By Account + Status
  // ===========================================================================

  public async existsByAccountPublicIdAndStatus(
    accountPublicId: FinancialAccountPublicId,
    status: FinancialSettlementStatus,
  ): Promise<boolean> {
    const accountId = await this.resolveAccountId(this.prisma, accountPublicId);

    const record = await this.prisma.financialSettlement.findFirst({
      where: {
        status: status.value,

        items: {
          some: {
            allocations: {
              some: {
                accountId,
              },
            },
          },
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Exists By Transaction Public ID
  // ===========================================================================

  public async existsByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<boolean> {
    const normalized = this.normalize(
      transactionPublicId.value,
      'Financial Transaction public ID',
    );

    const record = await this.prisma.financialSettlementAllocation.findFirst({
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
  // Exists Active By Transaction Public ID
  // ===========================================================================

  public async existsActiveByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<boolean> {
    const normalized = this.normalize(
      transactionPublicId.value,
      'Financial Transaction public ID',
    );

    const record = await this.prisma.financialSettlement.findFirst({
      where: {
        status: {
          in: ['PENDING', 'PROCESSING'],
        },

        items: {
          some: {
            allocations: {
              some: {
                transactionPublicId: normalized,
              },
            },
          },
        },
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Internal Query Helper
  // ===========================================================================

  private async findMany(
    where: Prisma.FinancialSettlementWhereInput,
  ): Promise<FinancialSettlementAggregate[]> {
    const records = await this.prisma.financialSettlement.findMany({
      where,

      include: this.aggregateInclude(),

      orderBy: {
        createdAt: 'desc',
      },
    });

    return records.map((record) => this.toDomain(record));
  }

  // ===========================================================================
  // Aggregate Include
  // ===========================================================================

  /**
   * Defines the exact persistence graph required to rehydrate the aggregate.
   *
   * FinancialSettlement
   * └── items
   *     └── allocations
   *
   * FinancialAccount is deliberately NOT included.
   *
   * Allocation.accountId is already the Financial Account's internal
   * persistence identity.
   */
  private aggregateInclude() {
    return {
      items: {
        include: {
          allocations: true,
        },

        orderBy: {
          createdAt: 'asc' as const,
        },
      },
    } satisfies Prisma.FinancialSettlementInclude;
  }

  // ===========================================================================
  // Domain Mapping
  // ===========================================================================

  /**
   * Centralizes the mapper boundary.
   *
   * The explicit payload assertion is safe because aggregateInclude()
   * guarantees exactly this persistence graph.
   */
  private toDomain(
    record: FinancialSettlementWithItems,
  ): FinancialSettlementAggregate {
    return FinancialSettlementPrismaMapper.toDomain(record);
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
   * This exists only because repository query methods expose the Financial
   * Account public identity.
   *
   * It is intentionally NOT used by save().
   */
  private async resolveAccountId(
    prisma: PrismaClient | Prisma.TransactionClient,
    accountPublicId: FinancialAccountPublicId,
  ): Promise<string> {
    const normalized = this.normalize(
      accountPublicId.value,
      'Financial Account public ID',
    );

    const account = await prisma.financialAccount.findUnique({
      where: {
        publicId: normalized,
      },

      select: {
        id: true,
      },
    });

    if (account === null) {
      throw new FinancialSettlementException(
        `Financial Account "${normalized}" does not exist.`,
      );
    }

    return account.id;
  }

  // ===========================================================================
  // String Normalization
  // ===========================================================================

  private normalize(value: string, fieldName: string): string {
    const normalized = value.trim();

    if (!normalized) {
      throw new FinancialSettlementException(`${fieldName} must not be empty.`);
    }

    return normalized;
  }

  // ===========================================================================
  // Date Validation
  // ===========================================================================

  private validateDate(at: Date, fieldName: string): void {
    if (!(at instanceof Date) || Number.isNaN(at.getTime())) {
      throw new FinancialSettlementException(`${fieldName} must be valid.`);
    }
  }

  // ===========================================================================
  // Date Range Validation
  // ===========================================================================

  private validateDateRange(from: Date, to: Date): void {
    this.validateDate(from, 'Financial Settlement "from" date');

    this.validateDate(to, 'Financial Settlement "to" date');

    if (from >= to) {
      throw new FinancialSettlementException(
        'Financial Settlement date range requires "from" to be before "to".',
      );
    }
  }
}
