// -----------------------------------------------------------------------------
// Financial Disbursement — Created Event Subscriber
// -----------------------------------------------------------------------------
//
// Application subscriber responsible for initiating Financial Disbursement
// processing after a Financial Disbursement has been created.
//
// Workflow:
//
// 1. Subscribe to FinancialDisbursementCreated.
// 2. Acquire an idempotent processing claim.
// 3. If no claim is acquired, distinguish an already-processed event from
//    an event currently claimed by another worker.
// 4. Extract the Financial Disbursement public ID.
// 5. Dispatch ProcessFinancialDisbursementCommand.
// 6. Mark the event as processed using the claim token.
//
// This subscriber does NOT:
//
// - Execute external payment providers.
// - Create Financial Disbursement Attempts.
// - Select provider routing.
// - Move funds.
// - Create Financial Transactions.
// - Modify Financial Account balances.
//
// Those responsibilities belong to their respective boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Infrastructure — Event Bus
// -----------------------------------------------------------------------------

import { EventBus } from '../../../../infrastructure/events/event-bus';

// -----------------------------------------------------------------------------
// Foundation — Idempotency
// -----------------------------------------------------------------------------

import type { IdempotencyStore } from '../../../../foundation/events/idempotency.interface';

// -----------------------------------------------------------------------------
// Foundation — Command Handler
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { FINANCIAL_DISBURSEMENT_TOKENS } from '../financial-disbursement.tokens';

// -----------------------------------------------------------------------------
// Application — Command
// -----------------------------------------------------------------------------

import { ProcessFinancialDisbursementCommand } from '../commands/process-financial-disbursement.command';

// -----------------------------------------------------------------------------
// Domain — Event
// -----------------------------------------------------------------------------

import { FinancialDisbursementCreatedEvent } from '../../domain/events/financial-disbursement-created.event';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAggregate } from '../../domain/aggregates/financial-disbursement.aggregate';

// -----------------------------------------------------------------------------
// Domain — Value Objects
// -----------------------------------------------------------------------------

import { FinancialDisbursementPublicId } from '../../domain/value-objects';

// =============================================================================
// Constants
// =============================================================================

const CONSUMER_NAME = 'FinancialDisbursementCreatedSubscriber';

const CLAIM_LEASE_DURATION_MS = 120_000;

// =============================================================================
// Subscriber
// =============================================================================

@Injectable()
export class FinancialDisbursementCreatedSubscriber implements OnModuleInit {
  // ===========================================================================
  // Logger
  // ===========================================================================

  private readonly logger = new Logger(
    FinancialDisbursementCreatedSubscriber.name,
  );

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    private readonly eventBus: EventBus,

    @Inject(FINANCIAL_DISBURSEMENT_TOKENS.COMMAND_HANDLERS.PROCESS)
    private readonly processDisbursementHandler: CommandHandler<
      ProcessFinancialDisbursementCommand,
      FinancialDisbursementAggregate
    >,

    @Inject('IdempotencyStore')
    private readonly idempotencyStore: IdempotencyStore,
  ) {}

  // ===========================================================================
  // Register Subscriber
  // ===========================================================================

  public onModuleInit(): void {
    this.eventBus.subscribe<FinancialDisbursementCreatedEvent>(
      'FinancialDisbursementCreated',
      async (event) => this.handle(event),
    );
  }

  // ===========================================================================
  // Handle Event
  // ===========================================================================

  private async handle(
    event: FinancialDisbursementCreatedEvent,
  ): Promise<void> {
    const eventId = event.metadata.eventId;

    // -------------------------------------------------------------------------
    // 1. Acquire an exclusive processing claim
    // -------------------------------------------------------------------------
    //
    // A claim prevents concurrent workers from processing the same event
    // for this consumer.
    //
    // A null token can mean:
    // - The event has already been processed.
    // - Another worker currently owns an active claim.
    //
    // These cases must be distinguished before acknowledging the event.
    // -------------------------------------------------------------------------

    const claimToken = await this.idempotencyStore.acquireClaim(
      CONSUMER_NAME,
      eventId,
      CLAIM_LEASE_DURATION_MS,
    );

    if (claimToken === null) {
      // -----------------------------------------------------------------------
      // 1a. Check whether processing has already completed
      // -----------------------------------------------------------------------

      const alreadyProcessed = await this.idempotencyStore.exists(
        CONSUMER_NAME,
        eventId,
      );

      if (alreadyProcessed) {
        this.logger.debug(
          `Financial Disbursement Created event already processed: ${eventId}`,
        );

        return;
      }

      // -----------------------------------------------------------------------
      // 1b. Another worker owns the active claim
      // -----------------------------------------------------------------------
      //
      // Do not acknowledge this event as successfully handled.
      //
      // Throwing allows the event infrastructure to apply its configured
      // retry behaviour instead of silently losing the event.
      // -----------------------------------------------------------------------

      this.logger.warn(
        `Financial Disbursement Created event is currently claimed by another worker: ${eventId}`,
      );

      throw new Error(
        `Unable to acquire processing claim for Financial Disbursement Created event: ${eventId}`,
      );
    }

    // -------------------------------------------------------------------------
    // 2. Resolve Disbursement Public ID
    // -------------------------------------------------------------------------
    //
    // The Created event exposes its public ID as a PublicEntityId.
    //
    // Convert it into the Financial Disbursement-specific value object
    // required by ProcessFinancialDisbursementCommand.
    // -------------------------------------------------------------------------

    const disbursementPublicId = new FinancialDisbursementPublicId(
      event.publicId.toString(),
    );

    // -------------------------------------------------------------------------
    // 3. Dispatch Process Financial Disbursement Command
    // -------------------------------------------------------------------------
    //
    // The Created event triggers the processing command.
    //
    // Correlation ID is preserved from the originating event.
    //
    // Causation ID identifies the Created event that triggered processing.
    //
    // The command handler owns lifecycle validation, persistence and
    // publication of FinancialDisbursementProcessingEvent.
    //
    // If command execution fails, the error propagates. The claim remains
    // until its lease expires, allowing a later retry.
    // -------------------------------------------------------------------------

    await this.processDisbursementHandler.execute(
      new ProcessFinancialDisbursementCommand(
        disbursementPublicId,
        event.metadata.correlationId ?? eventId,
        eventId,
      ),
    );

    // -------------------------------------------------------------------------
    // 4. Mark Event as Processed
    // -------------------------------------------------------------------------
    //
    // Only the worker holding the current claim token can complete processing.
    //
    // If the claim has expired or been replaced, the idempotency store rejects
    // this completion. The error must propagate for reconciliation or retry.
    // -------------------------------------------------------------------------

    await this.idempotencyStore.markProcessed(
      CONSUMER_NAME,
      eventId,
      claimToken,
    );

    // -------------------------------------------------------------------------
    // 5. Log Successful Processing
    // -------------------------------------------------------------------------

    this.logger.log(
      `Financial Disbursement processing initiated: ${disbursementPublicId.value}`,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialDisbursementCreatedSubscriber;
