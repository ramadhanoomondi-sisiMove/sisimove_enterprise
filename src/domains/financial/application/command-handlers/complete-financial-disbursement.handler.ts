// -----------------------------------------------------------------------------
// Financial Disbursement — Complete Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for completing an existing Financial Disbursement
// aggregate.
//
// Workflow:
//
// 1. Resolve the Financial Disbursement aggregate.
// 2. Invoke the aggregate completion behavior.
// 3. Persist the aggregate.
//
// Completion represents the final successful lifecycle transition:
//
// PROCESSING → COMPLETED
//
// The aggregate is the authoritative boundary for completion and verifies:
//
// - the Financial Disbursement is PROCESSING;
// - exactly one successful Financial Disbursement Attempt exists;
// - the successful attempt belongs to the disbursement;
// - the attempt amount matches the disbursement amount;
// - the attempt currency matches the disbursement currency;
// - the attempt provider matches the selected destination;
// - all attempts are terminal;
// - a Financial Transaction reference exists;
// - the completion timestamp is valid.
//
// The aggregate emits FinancialDisbursementCompletedEvent after the lifecycle
// transition succeeds.
//
// This handler does NOT:
//
// - execute a provider API;
// - create or post a Financial Transaction;
// - modify Financial Account balances;
// - create another execution attempt;
// - perform accounting;
// - perform persistence directly.
//
// Financial Transaction creation/posting belongs to the Financial Transaction
// boundary.
//
// Financial Account balance mutation belongs to the Financial Account
// aggregate.
//
// Provider execution belongs to the Integration/application boundary.
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

import type { CompleteFinancialDisbursementCommand } from '../commands/complete-financial-disbursement.command';

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
export class CompleteFinancialDisbursementHandler implements CommandHandler<
  CompleteFinancialDisbursementCommand,
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
    command: CompleteFinancialDisbursementCommand,
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
    // Complete Financial Disbursement
    // -------------------------------------------------------------------------
    //
    // All completion invariants remain inside the aggregate.
    //
    // The aggregate:
    //
    // - validates PROCESSING state;
    // - validates the successful attempt;
    // - validates attempt consistency;
    // - validates attempt terminality;
    // - validates the Financial Transaction reference;
    // - transitions PROCESSING → COMPLETED;
    // - emits FinancialDisbursementCompletedEvent.
    //
    // No provider execution or money movement occurs here.
    // -------------------------------------------------------------------------

    aggregate.complete(new Date(), command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // Persistence records the completed lifecycle state and all existing
    // aggregate-owned attempt state.
    //
    // This operation does not:
    //
    // - create a Financial Transaction;
    // - post a Financial Transaction;
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

export default CompleteFinancialDisbursementHandler;
