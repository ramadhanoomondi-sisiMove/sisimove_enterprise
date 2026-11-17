// -----------------------------------------------------------------------------
// Financial Payment — Create Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler responsible for creating a Financial Payment
// aggregate.
//
// Responsibilities:
//
// 1. Validate payment-channel requirements.
// 2. Validate application-level business-reference uniqueness.
// 3. Create the FinancialPaymentEntity.
// 4. Create the FinancialPaymentAggregate.
// 5. Record the FinancialPaymentCreatedEvent.
// 6. Persist the complete aggregate.
// 7. Persist domain events into the transactional outbox.
// 8. Return the created aggregate.
//
// Channel requirements:
//
// STK_PUSH:
// - Requires a selected Financial Payment Method.
// - Provider execution happens through ProcessFinancialPaymentHandler.
//
// C2B:
// - Does not require a saved Financial Payment Method.
// - Does not execute STK Push.
// - Proceeds through the separate C2B payment workflow.
//
// This handler does NOT:
//
// - create FinancialPaymentAttemptEntity;
// - execute payment providers;
// - communicate with external providers;
// - create Financial Transactions;
// - modify Financial Account balances;
// - perform settlement;
// - perform accounting.
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
      // 1. Validate payment-channel requirements
      // -----------------------------------------------------------------------

      if (command.channel.isStkPush()) {
        if (command.methodId === undefined) {
          throw new Error(
            'STK Push Financial Payments require a selected payment method.',
          );
        }
      } else if (command.channel.isC2B()) {
        if (command.methodId !== undefined) {
          throw new Error(
            'C2B Financial Payments must not use a saved payment method.',
          );
        }
      } else {
        throw new Error(
          `Unsupported Financial Payment channel: ${command.channel.value}`,
        );
      }

      // -----------------------------------------------------------------------
      // 2. Validate business-reference completeness
      // -----------------------------------------------------------------------

      const hasReferenceType = command.referenceType !== undefined;
      const hasReferencePublicId = command.referencePublicId !== undefined;

      if (hasReferenceType !== hasReferencePublicId) {
        throw new Error(
          'Financial Payment referenceType and referencePublicId must be supplied together.',
        );
      }

      // -----------------------------------------------------------------------
      // 3. Optional business-reference uniqueness check
      // -----------------------------------------------------------------------

      if (hasReferenceType && hasReferencePublicId) {
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
      // 4. Create Financial Payment Entity
      // -----------------------------------------------------------------------

      const payment = FinancialPaymentEntity.create(
        command.accountId,
        command.amount,
        command.channel,
        command.methodId,
        command.referenceType,
        command.referencePublicId,
      );

      // -----------------------------------------------------------------------
      // 5. Create aggregate
      // -----------------------------------------------------------------------

      const aggregate = FinancialPaymentAggregate.create(payment);

      // -----------------------------------------------------------------------
      // 6. Record creation event
      // -----------------------------------------------------------------------

      aggregate.emitCreatedEvent(command.correlationId, command.causationId);

      // -----------------------------------------------------------------------
      // 7. Persist aggregate
      // -----------------------------------------------------------------------

      await this.repository.create(aggregate);

      // -----------------------------------------------------------------------
      // 8. Persist domain events into the transactional outbox
      // -----------------------------------------------------------------------

      const domainEvents = aggregate.pullDomainEvents();

      if (domainEvents.length > 0) {
        await this.eventPublisher.publishAll(domainEvents);
      }

      // -----------------------------------------------------------------------
      // 9. Return aggregate
      // -----------------------------------------------------------------------

      return aggregate;
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateFinancialPaymentHandler;
