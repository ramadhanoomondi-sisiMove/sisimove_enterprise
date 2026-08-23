// -----------------------------------------------------------------------------
// Financial Transaction — Fail Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for failing a Financial Transaction aggregate.
//
// Responsibilities:
//
// - Resolve the Financial Transaction aggregate.
// - Invoke the aggregate failure lifecycle behavior.
// - Persist the modified aggregate.
//
// The handler does NOT:
//
// - validate transaction lifecycle rules;
// - change transaction status directly;
// - construct domain events;
// - determine whether the transaction may be failed.
//
// Those responsibilities belong to the FinancialTransactionAggregate.
//
// The command already carries a domain FinancialTransactionPublicId value
// object, so the handler does NOT recreate or re-wrap the identifier.
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

import type { FailFinancialTransactionCommand } from '../commands/fail-financial-transaction.command';

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
export class FailFinancialTransactionHandler implements CommandHandler<
  FailFinancialTransactionCommand,
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
    command: FailFinancialTransactionCommand,
  ): Promise<void> {
    // -------------------------------------------------------------------------
    // Load aggregate
    // -------------------------------------------------------------------------
    //
    // The command already contains the domain FinancialTransactionPublicId
    // value object.
    //
    // No primitive-to-domain conversion is required here.
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
    // Fail aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the failure lifecycle transition.
    //
    // The aggregate is responsible for enforcing:
    //
    //   PENDING → FAILED
    //
    // and for recording the corresponding domain event.
    //
    // The application layer supplies the current application time.
    //
    // -------------------------------------------------------------------------

    aggregate.fail(command.correlationId, new Date(), command.reason);

    // -------------------------------------------------------------------------
    // Persist aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FailFinancialTransactionHandler;
