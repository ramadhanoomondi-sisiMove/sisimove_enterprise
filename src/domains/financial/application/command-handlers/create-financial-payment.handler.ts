// -----------------------------------------------------------------------------
// Financial Payment — Create Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for creating a Financial Payment
// aggregate.
//
// Aggregate:
//
// FinancialPaymentAggregate
// ├── FinancialPaymentEntity
// └── FinancialPaymentAttemptEntity[]
//
// Responsibilities:
//
// 1. Validate application-level uniqueness where required.
// 2. Create the FinancialPaymentEntity through its domain factory.
// 3. Create the FinancialPaymentAggregate.
// 4. Record the FinancialPaymentCreatedEvent.
// 5. Persist the complete aggregate.
// 6. Return the created aggregate.
//
// The handler does NOT:
//
// - create FinancialPaymentAttemptEntity;
// - execute payment providers;
// - communicate with external providers;
// - create Financial Transactions;
// - modify Financial Account balances;
// - perform settlement;
// - perform accounting.
//
// Payment attempts belong to subsequent payment execution workflows.
//
// Domain construction belongs to the domain entity/aggregate.
// Persistence belongs to the repository.
// External provider execution belongs to the integration boundary.
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

import type { CreateFinancialPaymentCommand } from '../commands/create-financial-payment.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { FinancialPaymentAggregate } from '../../domain/aggregates/financial-payment.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { FinancialPaymentEntity } from '../../domain/entities/financial-payment.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { FinancialPaymentRepository } from '../../domain/repositories/financial-payment.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class CreateFinancialPaymentHandler implements CommandHandler<
  CreateFinancialPaymentCommand,
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
    command: CreateFinancialPaymentCommand,
  ): Promise<FinancialPaymentAggregate> {
    // -------------------------------------------------------------------------
    // 1. Optional business-reference uniqueness check
    // -------------------------------------------------------------------------
    //
    // A Financial Payment may optionally be associated with an originating
    // business reference.
    //
    // When supplied, the reference can be used as an application-level
    // idempotency/uniqueness boundary.
    //
    // The command requires both reference values to be supplied together.
    // The domain entity also enforces this invariant.
    // -------------------------------------------------------------------------

    if (
      command.referenceType !== undefined &&
      command.referencePublicId !== undefined
    ) {
      const alreadyExists = await this.repository.existsByReference(
        command.referenceType,
        command.referencePublicId,
      );

      if (alreadyExists) {
        throw new Error(
          `A Financial Payment already exists for reference ` +
            `"${command.referencePublicId.value}"`,
        );
      }
    }

    // -------------------------------------------------------------------------
    // 2. Create Financial Payment Entity
    // -------------------------------------------------------------------------
    //
    // The entity owns the initial payment state.
    //
    // The entity factory establishes:
    //
    // - Financial Payment identity;
    // - PENDING status;
    // - initiation timestamp;
    // - audit timestamps;
    // - empty payment attempts;
    // - optional payment method;
    // - optional business reference.
    //
    // The handler intentionally does NOT construct any of those values
    // itself.
    // -------------------------------------------------------------------------

    const payment = FinancialPaymentEntity.create(
      command.accountId,
      command.amount,
      command.methodId,
      command.referenceType,
      command.referencePublicId,
    );

    // -------------------------------------------------------------------------
    // 3. Create aggregate
    // -------------------------------------------------------------------------
    //
    // The FinancialPaymentAggregate becomes the unit of domain ownership
    // and persistence.
    //
    // FinancialPaymentAttemptEntity instances are intentionally NOT created
    // here because payment attempts represent actual provider execution.
    // -------------------------------------------------------------------------

    const aggregate = FinancialPaymentAggregate.create(payment);

    // -------------------------------------------------------------------------
    // 4. Record creation event
    // -------------------------------------------------------------------------
    //
    // Aggregate creation and event recording are intentionally separate.
    //
    // The aggregate owns the FinancialPaymentCreatedEvent.
    //
    // correlationId and causationId remain application-level tracing
    // information and are supplied by the command.
    // -------------------------------------------------------------------------

    aggregate.emitCreatedEvent(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // 5. Persist aggregate
    // -------------------------------------------------------------------------
    //
    // The repository persists the complete Financial Payment aggregate:
    //
    // FinancialPaymentAggregate
    // ├── FinancialPaymentEntity
    // └── FinancialPaymentAttemptEntity[]
    //
    // At creation time the attempts collection is empty.
    // -------------------------------------------------------------------------

    await this.repository.create(aggregate);

    // -------------------------------------------------------------------------
    // 6. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateFinancialPaymentHandler;
