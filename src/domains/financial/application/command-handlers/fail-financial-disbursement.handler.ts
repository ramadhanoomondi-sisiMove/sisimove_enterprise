// -----------------------------------------------------------------------------
// Financial Disbursement — Fail Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for permanently failing an existing Financial
// Disbursement aggregate.
//
// Workflow:
//
// 1. Resolve the Financial Disbursement aggregate.
// 2. Invoke the aggregate failure behavior.
// 3. Persist the aggregate.
//
// Failure represents a terminal lifecycle transition to FAILED.
//
// The aggregate is the authoritative boundary for failure and verifies:
//
// - the Financial Disbursement is not already terminal;
// - no Financial Disbursement Attempt is currently processing;
// - all existing attempts are terminal;
// - no successful attempt exists;
// - the failure reason is not empty;
// - the failure timestamp is valid.
//
// Individual Financial Disbursement Attempt failures do NOT automatically
// fail the parent Financial Disbursement.
//
// The aggregate emits FinancialDisbursementFailedEvent after the lifecycle
// transition succeeds.
//
// This handler does NOT:
//
// - fail an individual Financial Disbursement Attempt;
// - execute a provider API;
// - cancel a provider request;
// - move funds;
// - create or post a Financial Transaction;
// - modify Financial Account balances;
// - create another execution attempt;
// - perform accounting.
//
// Provider communication belongs to the Integration/application boundary.
//
// Financial Transaction creation/posting belongs to the Financial Transaction
// boundary.
//
// Financial Account balance mutation belongs to the Financial Account
// aggregate.
//
// Persistence belongs to the repository/infrastructure boundary.
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

import type { FailFinancialDisbursementCommand } from '../commands/fail-financial-disbursement.command';

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
export class FailFinancialDisbursementHandler implements CommandHandler<
  FailFinancialDisbursementCommand,
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
    command: FailFinancialDisbursementCommand,
  ): Promise<FinancialDisbursementAggregate> {
    // -------------------------------------------------------------------------
    // Resolve Financial Disbursement
    // -------------------------------------------------------------------------
    //
    // The repository must return a fully rehydrated aggregate, including:
    //
    // - FinancialDisbursementEntity;
    // - all FinancialDisbursementAttemptEntity children;
    // - associated FinancialDisbursementDestinationEntity.
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
    // Fail Financial Disbursement
    // -------------------------------------------------------------------------
    //
    // All failure invariants remain inside the aggregate.
    //
    // The aggregate:
    //
    // - validates terminal-state restrictions;
    // - validates attempt terminality;
    // - prevents failure after successful execution;
    // - validates the failure reason;
    // - transitions the disbursement to FAILED;
    // - emits FinancialDisbursementFailedEvent.
    //
    // Individual attempt failure remains a separate lifecycle operation.
    // -------------------------------------------------------------------------

    aggregate.fail(
      command.reason,
      new Date(),
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // Persistence records the terminal FAILED lifecycle state and the
    // aggregate-owned attempt state.
    //
    // This operation does not:
    //
    // - create or post a Financial Transaction;
    // - modify Financial Account balances;
    // - execute an external provider.
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

export default FailFinancialDisbursementHandler;
