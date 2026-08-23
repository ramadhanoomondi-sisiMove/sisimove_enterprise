// -----------------------------------------------------------------------------
// Financial Transaction — Cancel Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for cancelling a Financial Transaction aggregate.
//
// Responsibilities:
//
// - Resolve the Financial Transaction aggregate.
// - Invoke aggregate lifecycle behavior.
// - Persist the modified aggregate.
//
// The handler does NOT:
//
// - validate whether the transaction is PENDING;
// - change transaction status directly;
// - construct domain events;
// - determine whether cancellation is permitted.
//
// Those responsibilities belong to the FinancialTransactionAggregate.
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

import type { CancelFinancialTransactionCommand } from '../commands/cancel-financial-transaction.command';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { FinancialTransactionRepository } from '../../domain/repositories/financial-transaction.repository';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { FinancialNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class CancelFinancialTransactionHandler implements CommandHandler<
  CancelFinancialTransactionCommand,
  void
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
    command: CancelFinancialTransactionCommand,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // Load aggregate
    // -------------------------------------------------------------------------
    //
    // The command already carries FinancialTransactionPublicId as a domain
    // value object, so no primitive-to-VO conversion is required here.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.transactionPublicId,
    );

    if (aggregate === null) {
      throw new FinancialNotFoundException(
        `Financial transaction '${command.transactionPublicId.value}' was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Cancel aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the cancellation lifecycle transition:
    //
    // - transaction must be PENDING;
    // - transaction transitions to CANCELLED;
    // - cancellation timestamp is applied;
    // - optional cancellation reason is supplied;
    // - FinancialTransactionCancelledEvent is recorded by the aggregate.
    //
    // -------------------------------------------------------------------------

    aggregate.cancel(command.correlationId, new Date(), command.reason);

    // -------------------------------------------------------------------------
    // Persist aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CancelFinancialTransactionHandler;
