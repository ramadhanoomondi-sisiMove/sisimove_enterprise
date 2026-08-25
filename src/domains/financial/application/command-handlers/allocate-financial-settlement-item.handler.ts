// -----------------------------------------------------------------------------
// Financial Settlement — Allocate Item Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for allocating a Financial
// Settlement Item belonging to an existing Financial Settlement aggregate.
//
// Responsibilities:
//
// - Resolve the Financial Settlement aggregate.
// - Ensure the Settlement exists.
// - Ensure the requested Settlement Item belongs to the Settlement.
// - Delegate allocation to the FinancialSettlementAggregate.
// - Persist the modified aggregate.
//
// The FinancialSettlementAggregate remains authoritative for:
//
// - Settlement lifecycle validation;
// - Settlement Item ownership;
// - Settlement Item allocation state;
// - allocation completeness;
// - Settlement total versus allocated total;
// - aggregate invariants;
// - domain event creation.
//
// IMPORTANT:
//
// The current FinancialSettlementAggregate exposes:
//
//     allocate()
//
// as an aggregate-level allocation operation.
//
// It does NOT currently expose:
//
//     allocateItem(itemPublicId, ...)
//
// Therefore this handler does not directly mutate the Settlement Item.
// It delegates the allocation operation to the aggregate.
//
// Allocation does NOT:
//
// - Debit a Financial Account.
// - Credit a Financial Account.
// - Modify Financial Account balances.
// - Create or post a Financial Transaction.
// - Execute a payment.
// - Execute a disbursement.
// - Perform accounting.
// - Communicate with an external financial provider.
// - Move money.
//
// Financial movement belongs to the Financial Transaction and Financial
// Account application/domain boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_SETTLEMENT_TOKENS } from '../financial-settlement.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AllocateFinancialSettlementItemCommand } from '../commands/allocate-financial-settlement-item.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialSettlementAggregate } from '../../domain/aggregates/financial-settlement.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialSettlementRepository } from '../../domain/repositories/financial-settlement.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialSettlementException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Allocates a Financial Settlement Item belonging to an existing Financial
 * Settlement aggregate.
 *
 * Expected Item lifecycle transition:
 *
 *     PENDING → ALLOCATED
 *
 * The Financial Settlement itself remains:
 *
 *     PROCESSING
 *
 * The aggregate remains the sole authority for determining whether allocation
 * is permitted.
 *
 * Application orchestration:
 *
 *     AllocateFinancialSettlementItemCommand
 *                    │
 *                    ▼
 *     FinancialSettlementRepository
 *                    │
 *                    ▼
 *     FinancialSettlementAggregate
 *                    │
 *                    ├── validate Item ownership
 *                    │
 *                    ├── allocate()
 *                    │
 *                    └── FinancialSettlementAllocatedEvent
 *                    │
 *                    ▼
 *     FinancialSettlementRepository.save()
 *
 * No financial movement occurs in this handler.
 */
@Injectable()
export class AllocateFinancialSettlementItemHandler implements CommandHandler<
  AllocateFinancialSettlementItemCommand,
  FinancialSettlementAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_SETTLEMENT_TOKENS.REPOSITORY)
    private readonly repository: FinancialSettlementRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: AllocateFinancialSettlementItemCommand,
  ): Promise<FinancialSettlementAggregate> {
    // -------------------------------------------------------------------------
    // 1. Resolve Financial Settlement
    // -------------------------------------------------------------------------
    //
    // The command carries the public identity of the owning Settlement.
    //
    // The repository returns the complete aggregate graph:
    //
    // FinancialSettlementAggregate
    // └── FinancialSettlementEntity
    //     └── FinancialSettlementItemEntity[]
    //         └── FinancialSettlementAllocationEntity[]
    //
    // Settlement Items remain internal entities owned by the aggregate.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.settlementPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure Financial Settlement exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialSettlementException(
        `Financial Settlement "${command.settlementPublicId.value}" was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Resolve Settlement Item
    // -------------------------------------------------------------------------
    //
    // The command identifies a specific Settlement Item.
    //
    // The Item must belong to the resolved Financial Settlement aggregate.
    //
    // The handler does not mutate the Item directly.
    // -------------------------------------------------------------------------

    const item = aggregate.getItem(command.itemPublicId);

    // -------------------------------------------------------------------------
    // 4. Ensure Settlement Item exists
    // -------------------------------------------------------------------------

    if (item === undefined) {
      throw new FinancialSettlementException(
        `Financial Settlement Item "${command.itemPublicId.value}" was not found in Financial Settlement "${command.settlementPublicId.value}".`,
      );
    }

    // -------------------------------------------------------------------------
    // 5. Allocate Settlement
    // -------------------------------------------------------------------------
    //
    // IMPORTANT:
    //
    // The current aggregate API exposes allocation as:
    //
    //     allocate(at, correlationId, causationId)
    //
    // and does not expose:
    //
    //     allocateItem(itemPublicId, ...)
    //
    // Therefore the timestamp is generated by the application boundary.
    //
    // `new Date()` is explicitly typed as Date, satisfying both TypeScript
    // and @typescript-eslint/no-unsafe-argument.
    //
    // The aggregate remains authoritative for the actual allocation rules.
    // -------------------------------------------------------------------------

    aggregate.allocate(new Date(), command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 6. Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete Financial Settlement aggregate.
    //
    // This includes any Settlement Item lifecycle changes produced by the
    // aggregate allocation operation.
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 7. Return Aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AllocateFinancialSettlementItemHandler;
