// -----------------------------------------------------------------------------
// Financial Settlement — Fail Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for failing an existing Financial
// Settlement aggregate.
//
// Responsibilities:
//
// - Resolve the Financial Settlement aggregate.
// - Ensure the Settlement exists.
// - Delegate the failure transition to the aggregate.
// - Supply the failure reason.
// - Persist the modified aggregate.
//
// The FinancialSettlementAggregate remains authoritative for:
//
// - lifecycle validation;
// - terminal-state validation;
// - failure timestamp validation;
// - failure state transition;
// - failure reason validation;
// - domain event creation.
//
// Expected lifecycle transitions:
//
//     PENDING    → FAILED
//     PROCESSING → FAILED
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
//
// Any required compensating financial movement belongs to the Financial
// Transaction lifecycle and the appropriate application orchestration.
//
// Sensitive provider information must never be placed in the failure reason.
//
// -----------------------------------------------------------------------------
//
// Application orchestration:
//
//     FailFinancialSettlementCommand
//                    │
//                    ▼
//     FinancialSettlementRepository
//                    │
//                    ▼
//     FinancialSettlementAggregate
//                    │
//                    ├── fail()
//                    │
//                    └── FinancialSettlementFailedEvent
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

import type { FailFinancialSettlementCommand } from '../commands/fail-financial-settlement.command';

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
 * Fails an existing Financial Settlement.
 *
 * Expected lifecycle transitions:
 *
 *     PENDING    → FAILED
 *     PROCESSING → FAILED
 *
 * The FinancialSettlementAggregate remains the sole authority for deciding
 * whether failure is permitted.
 *
 * The aggregate validates:
 *
 * - the Settlement is not already terminal;
 * - the failure timestamp is valid;
 * - the failure reason is present;
 * - the lifecycle transition is valid.
 *
 * The aggregate then records:
 *
 *     FinancialSettlementFailedEvent
 *
 * The handler performs application orchestration only.
 *
 * No financial movement occurs in this handler.
 */
@Injectable()
export class FailFinancialSettlementHandler implements CommandHandler<
  FailFinancialSettlementCommand,
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
    command: FailFinancialSettlementCommand,
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
    // 3. Fail Financial Settlement
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the complete failure transition.
    //
    // aggregate.fail() validates:
    //
    // - Settlement is not already terminal;
    // - failure timestamp is valid;
    // - failure reason is non-empty.
    //
    // It then performs the appropriate lifecycle transition:
    //
    //     PENDING    → FAILED
    //     PROCESSING → FAILED
    //
    // and records:
    //
    //     FinancialSettlementFailedEvent
    //
    // The handler deliberately does not reproduce these domain rules.
    // -------------------------------------------------------------------------

    aggregate.fail(
      command.reason,
      new Date(),
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete modified Financial Settlement
    // aggregate.
    //
    // Failure of the Settlement does not itself reverse financial movement.
    // Any compensating transaction must be handled separately.
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

export default FailFinancialSettlementHandler;
