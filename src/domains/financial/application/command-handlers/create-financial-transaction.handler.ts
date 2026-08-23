// -----------------------------------------------------------------------------
// Financial Transaction — Create Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for creating a Financial Transaction
// aggregate.
//
// Responsibilities:
//
// - receive the application command;
// - delegate transaction creation to the aggregate;
// - persist the complete aggregate;
// - return the created aggregate.
//
// The handler does NOT:
//
// - create entities directly;
// - generate public IDs;
// - determine lifecycle state;
// - enforce debit/credit integrity;
// - mutate Financial Account balances;
// - create Accounting Journal entries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_TRANSACTION_TOKENS } from '../financial-transaction.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CreateFinancialTransactionCommand } from '../commands/create-financial-transaction.command';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import { FinancialTransactionAggregate } from '../../domain/aggregates/financial-transaction.aggregate';

// -----------------------------------------------------------------------------
// Domain Repository
// -----------------------------------------------------------------------------

import type { FinancialTransactionRepository } from '../../domain/repositories/financial-transaction.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class CreateFinancialTransactionHandler implements CommandHandler<
  CreateFinancialTransactionCommand,
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
    command: CreateFinancialTransactionCommand,
  ): Promise<FinancialTransactionAggregate> {
    // -------------------------------------------------------------------------
    // Domain creation
    // -------------------------------------------------------------------------
    //
    // Optional properties are only included when they actually exist.
    //
    // This is required because the project uses:
    //
    // exactOptionalPropertyTypes: true
    //
    // Therefore:
    //
    // sourceAccount?: FinancialAccountReference
    //
    // means the property may be omitted, but it does not mean:
    //
    // sourceAccount: FinancialAccountReference | undefined
    // -------------------------------------------------------------------------

    const aggregate = FinancialTransactionAggregate.create(
      {
        type: command.type,

        amount: command.amount,

        ...(command.sourceAccount !== undefined && {
          sourceAccount: command.sourceAccount,
        }),

        ...(command.destinationAccount !== undefined && {
          destinationAccount: command.destinationAccount,
        }),

        ...(command.reference !== undefined && {
          reference: command.reference,
        }),
      },
      command.correlationId,
    );

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

export default CreateFinancialTransactionHandler;
