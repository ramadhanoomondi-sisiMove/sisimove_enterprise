// -----------------------------------------------------------------------------
// Financial Transaction — Complete Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for completing a Financial Transaction aggregate.
//
// Responsibilities:
//
// - Resolve the Financial Transaction aggregate.
// - Invoke aggregate lifecycle behavior.
// - Persist the modified aggregate.
// - Return the updated aggregate to the application caller.
//
// The handler does NOT:
//
// - validate transaction balance;
// - validate transaction entries;
// - validate debit/credit totals;
// - change transaction status directly;
// - construct domain events.
//
// Those responsibilities belong to the FinancialTransactionAggregate.
//
// The command already carries a domain FinancialTransactionPublicId value
// object. Therefore, the handler does not reconstruct or re-wrap the
// transaction identifier.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application
// -----------------------------------------------------------------------------

import { FINANCIAL_TRANSACTION_TOKENS } from '../financial-transaction.tokens';

import type { CompleteFinancialTransactionCommand } from '../commands/complete-financial-transaction.command';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { FinancialTransactionAggregate } from '../../domain/aggregates/financial-transaction.aggregate';

import type { FinancialTransactionRepository } from '../../domain/repositories/financial-transaction.repository';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { FinancialNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class CompleteFinancialTransactionHandler implements CommandHandler<
  CompleteFinancialTransactionCommand,
  FinancialTransactionAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_TRANSACTION_TOKENS.REPOSITORY)
    private readonly repository: FinancialTransactionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: CompleteFinancialTransactionCommand,
  ): Promise<FinancialTransactionAggregate> {
    // -------------------------------------------------------------------------
    // Load aggregate
    // -------------------------------------------------------------------------
    //
    // The command already contains the domain FinancialTransactionPublicId
    // value object.
    //
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.transactionPublicId,
    );

    // -------------------------------------------------------------------------
    // Aggregate not found
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialNotFoundException(
        `Financial transaction '${command.transactionPublicId.value}' was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Complete aggregate
    // -------------------------------------------------------------------------
    //
    // The FinancialTransactionAggregate owns all completion invariants:
    //
    // - transaction must be PENDING;
    // - at least one entry;
    // - at least one debit;
    // - at least one credit;
    // - debit and credit totals must balance;
    // - debit total must equal transaction amount;
    // - credit total must equal transaction amount.
    //
    // The aggregate also records the corresponding domain event.
    //
    // -------------------------------------------------------------------------

    aggregate.complete(command.correlationId);

    // -------------------------------------------------------------------------
    // Persist aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CompleteFinancialTransactionHandler;
