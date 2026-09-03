// -----------------------------------------------------------------------------
// Financial Disbursement — Cancel Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for cancelling an existing Financial Disbursement
// aggregate.
//
// Workflow:
//
// 1. Resolve the Financial Disbursement aggregate.
// 2. Invoke the aggregate cancellation behavior.
// 3. Persist the aggregate.
//
// Cancellation represents an internal Financial-domain lifecycle transition
// to the terminal CANCELLED state.
//
// Cancellation does NOT claim that an external provider cancelled an already
// submitted request.
//
// The aggregate is the authoritative boundary for cancellation and verifies:
//
// - the Financial Disbursement is not already terminal;
// - no Financial Disbursement Attempt is currently processing;
// - all existing attempts are terminal;
// - no successful attempt exists;
// - the cancellation timestamp is valid.
//
// The aggregate emits FinancialDisbursementCancelledEvent after the lifecycle
// transition succeeds.
//
// This handler does NOT:
//
// - cancel an individual Financial Disbursement Attempt;
// - call an external provider;
// - claim provider-side cancellation;
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

import type { CancelFinancialDisbursementCommand } from '../commands/cancel-financial-disbursement.command';

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
export class CancelFinancialDisbursementHandler implements CommandHandler<
  CancelFinancialDisbursementCommand,
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
    command: CancelFinancialDisbursementCommand,
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
    // Cancel Financial Disbursement
    // -------------------------------------------------------------------------
    //
    // All cancellation invariants remain inside the aggregate.
    //
    // The aggregate:
    //
    // - validates terminal-state restrictions;
    // - validates attempt terminality;
    // - prevents cancellation after successful execution;
    // - transitions the disbursement to CANCELLED;
    // - emits FinancialDisbursementCancelledEvent.
    //
    // Cancellation remains an internal Financial-domain lifecycle decision.
    // -------------------------------------------------------------------------

    aggregate.cancel(new Date(), command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // Persistence records the terminal CANCELLED lifecycle state and the
    // aggregate-owned attempt state.
    //
    // This operation does not:
    //
    // - execute provider cancellation;
    // - create or post a Financial Transaction;
    // - modify Financial Account balances;
    // - move funds externally.
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

export default CancelFinancialDisbursementHandler;
