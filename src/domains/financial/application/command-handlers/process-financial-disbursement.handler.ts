// -----------------------------------------------------------------------------
// Financial Disbursement — Process Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for beginning processing of an existing Financial
// Disbursement aggregate.
//
// Workflow:
//
// 1. Resolve the Financial Disbursement aggregate.
// 2. Invoke the aggregate processing behavior.
// 3. Persist the aggregate.
//
// Processing represents the domain lifecycle transition:
//
// PENDING → PROCESSING
//
// The aggregate is responsible for:
//
// - validating the current lifecycle state;
// - validating destination ownership;
// - validating destination eligibility;
// - transitioning the disbursement to PROCESSING;
// - emitting FinancialDisbursementProcessingEvent.
//
// The destination is already part of the rehydrated
// FinancialDisbursementAggregate and therefore does NOT require a separate
// repository lookup in this handler.
//
// This handler does NOT:
//
// - execute a provider API;
// - create a Financial Disbursement Attempt;
// - select a provider;
// - perform provider routing;
// - move funds;
// - create or post a Financial Transaction;
// - modify Financial Account balances.
//
// Provider communication belongs to the Integration boundary.
// Financial Transaction creation/posting belongs to the Financial Transaction
// boundary.
// Financial Account balance mutation belongs to the Financial Account
// boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../financial-disbursement.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ProcessFinancialDisbursementCommand } from '../commands/process-financial-disbursement.command';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import { FinancialDisbursementAggregate } from '../../domain/aggregates/financial-disbursement.aggregate';

// -----------------------------------------------------------------------------
// Repositories
// -----------------------------------------------------------------------------

import type { FinancialDisbursementRepository } from '../../domain/repositories/financial-disbursement.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialDisbursementException } from '../../domain/exceptions';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class ProcessFinancialDisbursementHandler implements CommandHandler<
  ProcessFinancialDisbursementCommand,
  FinancialDisbursementAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.REPOSITORY)
    private readonly disbursementRepository: FinancialDisbursementRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: ProcessFinancialDisbursementCommand,
  ): Promise<FinancialDisbursementAggregate> {
    // -------------------------------------------------------------------------
    // Resolve Financial Disbursement
    // -------------------------------------------------------------------------

    const aggregate = await this.disbursementRepository.findByPublicId(
      command.disbursementPublicId,
    );

    if (aggregate === null) {
      throw new FinancialDisbursementException(
        `Financial Disbursement "${command.disbursementPublicId.value}" was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Begin Processing
    // -------------------------------------------------------------------------
    //
    // The aggregate owns all processing invariants and lifecycle mutation.
    //
    // This includes:
    //
    // - PENDING → PROCESSING validation;
    // - destination ownership validation;
    // - destination eligibility validation;
    // - processing timestamp validation;
    // - FinancialDisbursementProcessingEvent emission.
    //
    // No provider API is executed here.
    // -------------------------------------------------------------------------

    aggregate.startProcessing(
      new Date(),
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // Persisting the processing transition does not:
    //
    // - create an execution attempt;
    // - move funds;
    // - create a Financial Transaction;
    // - modify Financial Account balances.
    // -------------------------------------------------------------------------

    await this.disbursementRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ProcessFinancialDisbursementHandler;
