// -----------------------------------------------------------------------------
// Financial Transaction — Reverse Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for reversing a Financial Transaction aggregate.
//
// Responsibilities:
//
// - Resolve the Financial Transaction aggregate.
// - Invoke aggregate lifecycle behavior.
// - Persist the modified aggregate.
// - Return the updated aggregate.
//
// The handler does NOT:
//
// - validate whether the transaction is COMPLETED;
// - mutate transaction status directly;
// - mutate historical transaction entries;
// - construct domain events;
// - create the compensating financial transaction.
//
// Those responsibilities belong to the FinancialTransactionAggregate and the
// appropriate application workflow.
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

import type { ReverseFinancialTransactionCommand } from '../commands/reverse-financial-transaction.command';

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
export class ReverseFinancialTransactionHandler implements CommandHandler<
  ReverseFinancialTransactionCommand,
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
    command: ReverseFinancialTransactionCommand,
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
    // Reverse aggregate
    // -------------------------------------------------------------------------
    //
    // The FinancialTransactionAggregate owns the reversal lifecycle:
    //
    // - transaction must be COMPLETED;
    // - transaction transitions to REVERSED;
    // - historical transaction entries remain immutable;
    // - the reversal domain event is recorded by the aggregate.
    //
    // The compensating financial movement is NOT created here.
    //
    // A separate Financial Transaction must represent the compensating
    // financial movement through the appropriate application workflow.
    //
    // -------------------------------------------------------------------------

    aggregate.reverse(command.correlationId, new Date(), command.reason);

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

export default ReverseFinancialTransactionHandler;
