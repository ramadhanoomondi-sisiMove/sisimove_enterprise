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
// 6. Persist domain events into the transactional outbox.
// 7. Return the created aggregate.
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
// Event persistence belongs to the EventPublisher port.
// Transaction coordination belongs to the UnitOfWork port.
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
// Foundation — Unit of Work
// -----------------------------------------------------------------------------

import { UNIT_OF_WORK } from '../../../../foundation/persistence/unit-of-work.token';

import type { UnitOfWork } from '../../../../foundation/persistence/unit-of-work.interface';

// -----------------------------------------------------------------------------
// Foundation — Event Publisher
// -----------------------------------------------------------------------------

import { EVENT_PUBLISHER } from '../../../../foundation/events/event-publisher.token';

import type { EventPublisher } from '../../../../foundation/events/event-publisher.interface';

// -----------------------------------------------------------------------------
// Foundation — Command Handler
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

    @Inject(UNIT_OF_WORK)
    private readonly unitOfWork: UnitOfWork,

    @Inject(EVENT_PUBLISHER)
    private readonly eventPublisher: EventPublisher,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    command: CreateFinancialPaymentCommand,
  ): Promise<FinancialPaymentAggregate> {
    return this.unitOfWork.execute(async () => {
      // -----------------------------------------------------------------------
      // 1. Optional business-reference uniqueness check
      // -----------------------------------------------------------------------

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

      // -----------------------------------------------------------------------
      // 2. Create Financial Payment Entity
      // -----------------------------------------------------------------------

      const payment = FinancialPaymentEntity.create(
        command.accountId,
        command.amount,
        command.methodId,
        command.referenceType,
        command.referencePublicId,
      );

      // -----------------------------------------------------------------------
      // 3. Create aggregate
      // -----------------------------------------------------------------------

      const aggregate = FinancialPaymentAggregate.create(payment);

      // -----------------------------------------------------------------------
      // 4. Record creation event
      // -----------------------------------------------------------------------

      aggregate.emitCreatedEvent(command.correlationId, command.causationId);

      // -----------------------------------------------------------------------
      // 5. Persist aggregate
      // -----------------------------------------------------------------------

      await this.repository.create(aggregate);

      // -----------------------------------------------------------------------
      // 6. Persist domain events into the transactional outbox
      // -----------------------------------------------------------------------
      //
      // pullDomainEvents() returns the pending events and clears the
      // aggregate's internal event collection.
      //
      // EventPublisher persists the events and their outbox records using
      // the same transaction context established by UnitOfWork.
      //
      // No event is dispatched to subscribers directly from this handler.
      // The OutboxWorker handles dispatch after the transaction commits.
      // -----------------------------------------------------------------------

      const domainEvents = aggregate.pullDomainEvents();

      if (domainEvents.length > 0) {
        await this.eventPublisher.publishAll(domainEvents);
      }

      // -----------------------------------------------------------------------
      // 7. Return aggregate
      // -----------------------------------------------------------------------

      return aggregate;
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateFinancialPaymentHandler;
