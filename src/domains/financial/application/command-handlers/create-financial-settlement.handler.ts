// -----------------------------------------------------------------------------
// Financial Settlement — Create Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for creating a new
// Financial Settlement aggregate.
//
// Responsibilities:
//
// - Create the FinancialSettlementEntity.
// - Create the FinancialSettlementAggregate.
// - Record the FinancialSettlementCreatedEvent.
// - Persist the complete aggregate.
//
// A newly created Financial Settlement:
//
// - is PENDING;
// - is single-currency;
// - has a zero total amount;
// - contains no Settlement Items.
//
// The initial lifecycle state and zero total amount are determined by the
// FinancialSettlementEntity creation policy.
//
// This handler does NOT:
//
// - Add Settlement Items.
// - Allocate Settlement Items.
// - Begin settlement processing.
// - Create Financial Transactions.
// - Execute Financial Transactions.
// - Modify Financial Account balances.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external financial providers.
// - Move money.
//
// Those responsibilities belong to their respective domain/application
// boundaries.
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

import type { CreateFinancialSettlementCommand } from '../commands/create-financial-settlement.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialSettlementAggregate } from '../../domain/aggregates/financial-settlement.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { FinancialSettlementEntity } from '../../domain/entities/financial-settlement.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialSettlementRepository } from '../../domain/repositories/financial-settlement.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Creates a new Financial Settlement aggregate.
 *
 * The newly created Settlement is intentionally empty.
 *
 * Initial state:
 *
 *     status       = PENDING
 *     totalAmount  = zero
 *     itemCount    = 0
 *
 * Settlement Items are added after aggregate creation through the
 * FinancialSettlementAggregate while the Settlement remains PENDING.
 *
 * Creation itself does not begin settlement processing.
 *
 * The handler is responsible only for application orchestration:
 *
 *     Command
 *       │
 *       ▼
 * FinancialSettlementEntity.create()
 *       │
 *       ▼
 * FinancialSettlementAggregate.create()
 *       │
 *       ▼
 * aggregate.recordCreated()
 *       │
 *       ▼
 * repository.save()
 *
 * No financial movement occurs during this operation.
 */
@Injectable()
export class CreateFinancialSettlementHandler implements CommandHandler<
  CreateFinancialSettlementCommand,
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
    command: CreateFinancialSettlementCommand,
  ): Promise<FinancialSettlementAggregate> {
    // -------------------------------------------------------------------------
    // 1. Create Financial Settlement entity
    // -------------------------------------------------------------------------
    //
    // The Entity creation policy owns:
    //
    // - Settlement internal identity;
    // - Settlement public identity;
    // - initial PENDING status;
    // - zero total amount;
    // - empty Settlement Item collection;
    // - creation/update timestamps.
    //
    // The command intentionally supplies only the domain input required for
    // Settlement creation:
    //
    //     Currency
    //
    // Status and total amount are NOT supplied by the command.
    // -------------------------------------------------------------------------

    const settlement = FinancialSettlementEntity.create(command.currency);

    // -------------------------------------------------------------------------
    // 2. Create Financial Settlement aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate becomes the authoritative domain boundary for the
    // Financial Settlement.
    //
    // The newly created aggregate contains:
    //
    // FinancialSettlementAggregate
    // └── FinancialSettlementEntity
    //     └── Settlement Items[]
    //
    // The Settlement Item collection is initially empty.
    // -------------------------------------------------------------------------

    const aggregate = FinancialSettlementAggregate.create(settlement);

    // -------------------------------------------------------------------------
    // 3. Record creation
    // -------------------------------------------------------------------------
    //
    // Creation event recording is intentionally explicit.
    //
    // recordCreated() does NOT:
    //
    // - begin processing;
    // - create Settlement Items;
    // - allocate amounts;
    // - create Financial Transactions;
    // - modify Financial Account balances;
    // - execute disbursements;
    // - perform accounting;
    // - communicate with external providers.
    //
    // It only records FinancialSettlementCreatedEvent on the aggregate.
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 4. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete Financial Settlement aggregate.
    //
    // At creation time this consists of:
    //
    // FinancialSettlementAggregate
    // └── FinancialSettlementEntity
    //     └── no Settlement Items
    //         └── no Settlement Allocations
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 5. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateFinancialSettlementHandler;
