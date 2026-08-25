// -----------------------------------------------------------------------------
// Financial Settlement — Complete Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for completing an existing
// Financial Settlement aggregate.
//
// Responsibilities:
//
// - Resolve the Financial Settlement aggregate.
// - Ensure the Settlement exists.
// - Delegate the PROCESSING → COMPLETED lifecycle transition to the aggregate.
// - Persist the modified aggregate.
//
// The FinancialSettlementAggregate remains authoritative for:
//
// - lifecycle validation;
// - requiring at least one Settlement Item;
// - requiring all Settlement Items to be allocated;
// - requiring all Settlement Items to be settled;
// - requiring the full Settlement amount to be allocated;
// - completion timestamp validation;
// - domain event creation.
//
// This handler does NOT:
//
// - Allocate Settlement Items.
// - Settle Settlement Items.
// - Create Financial Transactions.
// - Execute Financial Transactions.
// - Modify Financial Account balances.
// - Move money.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external settlement/payment providers.
// - Reverse unrelated Financial Transactions.
//
// Completion represents the successful conclusion of the Settlement lifecycle.
// Actual financial movement belongs to the appropriate Financial Transaction,
// Financial Account, Disbursement, and Integration boundaries.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
//     PROCESSING → COMPLETED
//
// Application orchestration:
//
//     CompleteFinancialSettlementCommand
//                    │
//                    ▼
//     FinancialSettlementRepository
//                    │
//                    ▼
//     FinancialSettlementAggregate
//                    │
//                    ├── complete()
//                    │
//                    └── FinancialSettlementCompletedEvent
//                    │
//                    ▼
//     FinancialSettlementRepository.save()
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

import type { CompleteFinancialSettlementCommand } from '../commands/complete-financial-settlement.command';

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
 * Completes an existing Financial Settlement.
 *
 * Lifecycle transition:
 *
 *     PROCESSING → COMPLETED
 *
 * The FinancialSettlementAggregate remains the sole authority for deciding
 * whether completion is permitted.
 *
 * Completion requires the aggregate to confirm:
 *
 * - the Settlement is PROCESSING;
 * - at least one Settlement Item exists;
 * - every Settlement Item is allocated;
 * - every Settlement Item is settled;
 * - the allocated amount equals the Settlement total.
 *
 * The handler performs application orchestration only.
 *
 * No financial movement occurs in this handler.
 */
@Injectable()
export class CompleteFinancialSettlementHandler implements CommandHandler<
  CompleteFinancialSettlementCommand,
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
    command: CompleteFinancialSettlementCommand,
  ): Promise<FinancialSettlementAggregate> {
    // -------------------------------------------------------------------------
    // 1. Resolve Financial Settlement
    // -------------------------------------------------------------------------
    //
    // The command carries the public Settlement identity.
    //
    // The repository returns the complete aggregate graph:
    //
    // FinancialSettlementAggregate
    // └── FinancialSettlementEntity
    //     └── FinancialSettlementItemEntity[]
    //         └── FinancialSettlementAllocationEntity[]
    //
    // Settlement Items and Allocations remain internal to the aggregate.
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
    // 3. Complete Financial Settlement
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the complete lifecycle transition.
    //
    // aggregate.complete() validates:
    //
    // - Settlement is currently PROCESSING;
    // - Settlement contains at least one Settlement Item;
    // - every Settlement Item is settled;
    // - every Settlement Item is allocated;
    // - allocated amount equals Settlement total;
    // - completion timestamp is valid.
    //
    // The aggregate then performs:
    //
    //     PROCESSING → COMPLETED
    //
    // and records:
    //
    //     FinancialSettlementCompletedEvent
    //
    // The handler deliberately does not duplicate these domain rules.
    // -------------------------------------------------------------------------

    aggregate.complete(new Date(), command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 4. Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete modified aggregate.
    //
    // Persistence remains atomic from the aggregate's perspective.
    //
    // Domain-event publication remains governed by the application's
    // persistence/event publication strategy.
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 5. Return Aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CompleteFinancialSettlementHandler;
