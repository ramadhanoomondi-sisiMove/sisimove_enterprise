// -----------------------------------------------------------------------------
// Financial Settlement — Cancel Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for cancelling an existing
// Financial Settlement aggregate.
//
// Responsibilities:
//
// - Resolve the Financial Settlement aggregate.
// - Ensure the Settlement exists.
// - Delegate the cancellation transition to the aggregate.
// - Supply the optional cancellation reason.
// - Persist the modified aggregate.
//
// The FinancialSettlementAggregate remains authoritative for:
//
// - lifecycle validation;
// - terminal-state validation;
// - cancellation timestamp validation;
// - cancellation state transition;
// - cancellation reason normalization;
// - domain event creation.
//
// Expected lifecycle transitions:
//
//     PENDING    → CANCELLED
//     PROCESSING → CANCELLED
//
// Cancellation records the Settlement lifecycle outcome only.
//
// This handler does NOT:
//
// - Reverse previously executed Financial Transactions.
// - Create Financial Transactions.
// - Execute Financial Transactions.
// - Modify Financial Account balances.
// - Move money.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external financial providers.
// - Automatically refund or reverse financial movements.
//
// Any required financial reversal must be performed explicitly through the
// Financial Transaction lifecycle and appropriate application orchestration.
//
// -----------------------------------------------------------------------------
//
// Application orchestration:
//
//     CancelFinancialSettlementCommand
//                    │
//                    ▼
//     FinancialSettlementRepository
//                    │
//                    ▼
//     FinancialSettlementAggregate
//                    │
//                    ├── cancel()
//                    │
//                    └── FinancialSettlementCancelledEvent
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

import type { CancelFinancialSettlementCommand } from '../commands/cancel-financial-settlement.command';

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
 * Cancels an existing Financial Settlement.
 *
 * Expected lifecycle transitions:
 *
 *     PENDING    → CANCELLED
 *     PROCESSING → CANCELLED
 *
 * The FinancialSettlementAggregate remains the sole authority for deciding
 * whether cancellation is permitted.
 *
 * The aggregate validates:
 *
 * - the Settlement is not already terminal;
 * - the cancellation timestamp is valid;
 * - the lifecycle transition is valid;
 * - the optional cancellation reason is normalized.
 *
 * The aggregate then records:
 *
 *     FinancialSettlementCancelledEvent
 *
 * The handler performs application orchestration only.
 *
 * No financial movement occurs in this handler.
 */
@Injectable()
export class CancelFinancialSettlementHandler implements CommandHandler<
  CancelFinancialSettlementCommand,
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
    command: CancelFinancialSettlementCommand,
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
    // Child entities remain owned by the Settlement aggregate.
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
    // 3. Cancel Financial Settlement
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the complete cancellation transition.
    //
    // aggregate.cancel() validates:
    //
    // - Settlement is not already terminal;
    // - cancellation timestamp is valid;
    // - cancellation lifecycle transition is permitted;
    // - optional reason is normalized.
    //
    // It then performs the appropriate lifecycle transition:
    //
    //     PENDING    → CANCELLED
    //     PROCESSING → CANCELLED
    //
    // and records:
    //
    //     FinancialSettlementCancelledEvent
    //
    // The handler deliberately does not reproduce these domain rules.
    // -------------------------------------------------------------------------

    aggregate.cancel(
      new Date(),
      command.correlationId,
      command.causationId,
      command.reason,
    );

    // -------------------------------------------------------------------------
    // 4. Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete modified Financial Settlement
    // aggregate.
    //
    // Cancellation does not itself reverse financial movement.
    //
    // Any required compensating transaction must be handled independently
    // through the appropriate Financial Transaction workflow.
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

export default CancelFinancialSettlementHandler;
