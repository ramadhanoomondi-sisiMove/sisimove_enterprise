// -----------------------------------------------------------------------------
// Financial Payment — Process Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for moving a Financial Payment into
// PROCESSING state.
//
// Aggregate:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Responsibilities:
//
// 1. Load the existing Financial Payment aggregate.
// 2. Ensure the aggregate exists.
// 3. Start Financial Payment processing through the aggregate.
// 4. Persist the updated aggregate.
// 5. Return the updated aggregate.
//
// The handler does NOT:
//
// - execute a payment provider;
// - communicate directly with external providers;
// - create FinancialPaymentAttemptEntity;
// - create Financial Transactions;
// - modify Financial Account balances;
// - perform settlement;
// - perform accounting.
//
// Starting the payment lifecycle and executing the external provider operation
// are separate responsibilities.
//
// The aggregate owns payment lifecycle invariants and emits the corresponding
// domain event.
//
// Query/retrieval belongs to the repository.
// Domain lifecycle behavior belongs to FinancialPaymentAggregate.
// Persistence belongs to the repository.
// Provider execution belongs to the integration/application boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { ProcessFinancialPaymentCommand } from '../commands/process-financial-payment.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialPaymentAggregate } from '../../domain/aggregates/financial-payment.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { FinancialPaymentNotFoundException } from '../../domain/exceptions';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class ProcessFinancialPaymentHandler implements CommandHandler<
  ProcessFinancialPaymentCommand,
  FinancialPaymentAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(FINANCIAL_PAYMENT_TOKENS.REPOSITORY)
    private readonly repository: FinancialPaymentRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: ProcessFinancialPaymentCommand,
  ): Promise<FinancialPaymentAggregate> {
    // -------------------------------------------------------------------------
    // 1. Load Financial Payment aggregate
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for rehydrating the complete aggregate:
    //
    // FinancialPaymentAggregate
    // ├── FinancialPaymentEntity
    // └── FinancialPaymentAttemptEntity[]
    //
    // The handler intentionally works with the aggregate root.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.paymentPublicId,
    );

    // -------------------------------------------------------------------------
    // 2. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new FinancialPaymentNotFoundException(
        command.paymentPublicId.value,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Start payment processing
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the lifecycle transition.
    //
    // This operation:
    //
    // - validates the payment lifecycle transition;
    // - moves the payment into PROCESSING;
    // - updates the payment lifecycle timestamp;
    // - emits FinancialPaymentProcessingEvent.
    //
    // It does NOT execute an external payment provider.
    // -------------------------------------------------------------------------

    aggregate.startProcessing(
      new Date(),
      command.correlationId,
      command.causationId,
    );

    // -------------------------------------------------------------------------
    // 4. Persist updated aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete Financial Payment aggregate.
    //
    // Any domain event raised by the aggregate remains available for the
    // application's event/persistence infrastructure.
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);

    // -------------------------------------------------------------------------
    // 5. Return updated aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ProcessFinancialPaymentHandler;
