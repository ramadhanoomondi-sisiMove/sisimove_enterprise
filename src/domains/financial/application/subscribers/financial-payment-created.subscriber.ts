import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { EventBus } from '../../../../infrastructure/events/event-bus';

import type { IdempotencyStore } from '../../../../foundation/events/idempotency.interface';
import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

import { FINANCIAL_PAYMENT_TOKENS } from '../financial-payment.tokens';

import { ProcessFinancialPaymentCommand } from '../commands/process-financial-payment.command';

import { FinancialPaymentCreatedEvent } from '../../domain/events/financial-payment-created.event';

import type { FinancialPaymentAggregate } from '../../domain/aggregates/financial-payment.aggregate';

// =============================================================================
// Constants
// =============================================================================

const CONSUMER_NAME = 'FinancialPaymentCreatedSubscriber';

const CLAIM_LEASE_DURATION_MS = 120_000;

// =============================================================================
// Subscriber
// =============================================================================

@Injectable()
export class FinancialPaymentCreatedSubscriber implements OnModuleInit {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    private readonly eventBus: EventBus,

    @Inject(FINANCIAL_PAYMENT_TOKENS.COMMAND_HANDLERS.PROCESS)
    private readonly processPaymentHandler: CommandHandler<
      ProcessFinancialPaymentCommand,
      FinancialPaymentAggregate
    >,

    @Inject('IdempotencyStore')
    private readonly idempotencyStore: IdempotencyStore,
  ) {}

  // ===========================================================================
  // Register Subscriber
  // ===========================================================================

  public onModuleInit(): void {
    this.eventBus.subscribe<FinancialPaymentCreatedEvent>(
      'FinancialPaymentCreated',
      async (event) => this.handle(event),
    );
  }

  // ===========================================================================
  // Handle Event
  // ===========================================================================

  private async handle(event: FinancialPaymentCreatedEvent): Promise<void> {
    const eventId = event.metadata.eventId;

    // -------------------------------------------------------------------------
    // 1. Acquire an exclusive processing claim
    // -------------------------------------------------------------------------
    //
    // The claim prevents multiple workers from processing the same event
    // concurrently for this consumer.
    //
    // A null token means:
    //
    // - The event has already been processed; or
    // - Another worker currently owns an unexpired claim.
    //
    // In either case, this worker must not continue.
    // -------------------------------------------------------------------------

    const claimToken = await this.idempotencyStore.acquireClaim(
      CONSUMER_NAME,
      eventId,
      CLAIM_LEASE_DURATION_MS,
    );

    if (claimToken === null) {
      return;
    }

    // -------------------------------------------------------------------------
    // 2. Route payment according to its execution channel
    // -------------------------------------------------------------------------

    if (event.channel.isStkPush()) {
      // STK Push is initiated by SisiMove.
      //
      // Preserve the existing payment-processing workflow.
      //
      // The handler is responsible for executing the appropriate
      // payment-processing operation.

      await this.processPaymentHandler.execute(
        new ProcessFinancialPaymentCommand(
          event.publicId,
          event.metadata.correlationId ?? eventId,
          event.metadata.causationId ?? eventId,
        ),
      );
    } else if (event.channel.isC2B()) {
      // C2B is an incoming customer-initiated payment.
      //
      // Do not initiate STK Push.
      // Do not execute the outbound payment-processing workflow.
      //
      // The Daraja C2B callback is responsible for reporting the
      // external payment event that drives subsequent processing.
    } else {
      throw new Error(
        `Unsupported Financial Payment Channel: ${event.channel.toString()}`,
      );
    }

    // -------------------------------------------------------------------------
    // 3. Mark event processed
    // -------------------------------------------------------------------------
    //
    // Mark only after the relevant channel responsibility has completed.
    //
    // The claim token proves ownership. The idempotency store must reject
    // completion if the claim has expired or has been replaced.
    //
    // If processing throws, this operation is not reached. The claim
    // remains until its lease expires, allowing a later retry.
    // -------------------------------------------------------------------------

    await this.idempotencyStore.markProcessed(
      CONSUMER_NAME,
      eventId,
      claimToken,
    );
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default FinancialPaymentCreatedSubscriber;
